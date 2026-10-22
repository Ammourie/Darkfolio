#!/usr/bin/env python3
"""
Download ONLY the screenshot gallery of a Google Play app listing, at full resolution.
(The app icon and feature graphic are skipped by default.)

Usage:
    python download_play_screenshots.py "https://play.google.com/store/apps/details?id=com.osoustech.crenny&hl=en"
    python download_play_screenshots.py com.osoustech.crenny -o crenny_shots
    python download_play_screenshots.py com.osoustech.crenny --list        # preview only, no download
    python download_play_screenshots.py com.osoustech.crenny --skip 1      # drop first N detected images
    python download_play_screenshots.py com.osoustech.crenny --include-all # disable all filtering

Requires: pip install requests
"""

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

import requests

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

IMG_RE = re.compile(r"https://play-lh\.googleusercontent\.com/[A-Za-z0-9_\-]+(?:=[A-Za-z0-9\-_]+)?")
SIZE_RE = re.compile(r"=w(\d+)-h(\d+)")

EXT_BY_TYPE = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
}


def package_id(arg: str) -> str:
    if arg.startswith("http"):
        qs = parse_qs(urlparse(arg).query)
        if "id" not in qs:
            sys.exit("Could not find ?id=<package> in that URL.")
        return qs["id"][0]
    return arg


def fetch_listing(pkg: str, lang: str) -> str:
    r = requests.get(
        "https://play.google.com/store/apps/details",
        params={"id": pkg, "hl": lang},
        headers=HEADERS,
        timeout=30,
    )
    if r.status_code == 404:
        sys.exit(f"App not found: {pkg}")
    r.raise_for_status()
    return r.text


def base_of(url: str) -> str:
    return url.split("=", 1)[0]


def non_gallery_bases(html: str) -> set:
    """Images used for the app icon / social preview: meta tags and the 'Icon image' <img>."""
    bases = set()
    for tag in re.findall(r"<meta[^>]+>", html):
        bases.update(base_of(u) for u in IMG_RE.findall(tag))
    for tag in re.findall(r"<img[^>]*alt=\"Icon image\"[^>]*>", html):
        bases.update(base_of(u) for u in IMG_RE.findall(tag))
    return bases


def extract_images(html: str, include_all: bool):
    """Return [(base_url, width, height)] of gallery screenshots in page order."""
    excluded = set() if include_all else non_gallery_bases(html)
    # Embedded JSON escapes some characters
    html = html.replace("\\u003d", "=").replace("\\/", "/")

    seen, result = set(), []
    for m in IMG_RE.finditer(html):
        url = m.group(0)
        base, _, suffix = url.partition("=")
        if base in seen or base in excluded:
            continue
        size = SIZE_RE.search("=" + suffix) if suffix else None
        w, h = (int(size.group(1)), int(size.group(2))) if size else (0, 0)
        if not include_all:
            if not size or w < 300 or h < 300:      # icons / avatars / tiny thumbnails
                continue
            if w > h and w / h > 1.95:              # wide banner = feature graphic
                continue
        seen.add(base)
        result.append((base, w, h))
    return result


def download(base: str, size_param: str, dest_stem: Path) -> Path:
    r = requests.get(f"{base}={size_param}", headers=HEADERS, timeout=60)
    r.raise_for_status()
    ext = EXT_BY_TYPE.get(r.headers.get("Content-Type", "").split(";")[0], ".png")
    path = dest_stem.with_suffix(ext)
    path.write_bytes(r.content)
    return path


def main():
    ap = argparse.ArgumentParser(description="Download Google Play gallery screenshots in high resolution.")
    ap.add_argument("app", help="Play Store URL or package name (e.g. com.osoustech.crenny)")
    ap.add_argument("-o", "--out", help="Output folder (default: <package>_screenshots)")
    ap.add_argument("-l", "--lang", default="en", help="Listing language (default: en)")
    ap.add_argument("--size", default="s0",
                    help="Google image size param. s0 = original size (default). "
                         "Alternative: w2160-h3840 to cap dimensions.")
    ap.add_argument("--skip", type=int, default=0, help="Skip the first N detected images")
    ap.add_argument("--list", action="store_true", help="Only list detected images, don't download")
    ap.add_argument("--include-all", action="store_true",
                    help="Disable filtering (also gets icon, feature graphic, other images)")
    args = ap.parse_args()

    pkg = package_id(args.app)
    print(f"Fetching listing for {pkg} ...")
    images = extract_images(fetch_listing(pkg, args.lang), args.include_all)[args.skip:]
    if not images:
        sys.exit("No gallery images found. Google may have changed the page layout, or blocked the request.")

    if args.list:
        for i, (base, w, h) in enumerate(images, 1):
            print(f"  [{i:02d}] {w}x{h}  {base}")
        return

    out = Path(args.out or f"{pkg}_screenshots")
    out.mkdir(parents=True, exist_ok=True)
    print(f"Found {len(images)} gallery image(s). Downloading to {out.resolve()}")
    for i, (base, _, _) in enumerate(images, 1):
        try:
            path = download(base, args.size, out / f"{i:02d}")
            print(f"  [{i:02d}] {path.name}  ({path.stat().st_size / 1024:.0f} KB)")
        except requests.RequestException as e:
            print(f"  [{i:02d}] FAILED: {e}")
    print("Done.")


if __name__ == "__main__":
    main()
