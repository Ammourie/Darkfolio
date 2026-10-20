/** Default wide banner when a project has no Play Store / cover asset. */
export const PROJECT_COVER_PLACEHOLDER = '/images/project-cover-placeholder.svg';

/** True when path is a real project asset (not empty). */
export function hasProjectAsset(src: string | undefined): boolean {
  return Boolean(src?.trim());
}

/** Cover for cards and hero — placeholder if missing. */
export function getProjectCoverSrc(coverImage: string | undefined): string {
  return hasProjectAsset(coverImage) ? coverImage!.trim() : PROJECT_COVER_PLACEHOLDER;
}

export function isProjectCoverPlaceholder(src: string): boolean {
  return src === PROJECT_COVER_PLACEHOLDER;
}
