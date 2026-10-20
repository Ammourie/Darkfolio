const url = 'https://play.google.com/store/apps/developer?id=Osous+Technology&hl=en';
const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
const html = await res.text();
await import('fs/promises').then((fs) => fs.writeFile('scripts/tmp-dev-page.html', html));
console.log('length', html.length);
const ids = [...html.matchAll(/details\?id=([a-zA-Z0-9._]+)/g)].map((m) => m[1]);
console.log('ids', [...new Set(ids)].slice(0, 20));
const imgs = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/[^"'\\s<>]+/g)].map((m) => m[0].replace(/\\u003d/g, '='));
console.log('img count', imgs.length);
