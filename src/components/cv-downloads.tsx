import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Public CV paths for reuse in about tiles. */
export const CV_FILES = {
  english: { href: '/cv/cv_english.pdf' },
  arabic: { href: '/cv/cv_arabic.pdf' },
} as const;

/** Shared attrs so PDFs open in the browser (new tab). */
export const CV_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

export type CvDownloadLabels = {
  english: string;
  arabic: string;
};

type CvDownloadsProps = {
  labels: CvDownloadLabels;
  /** Compact styling for the header nav */
  size?: 'default' | 'sm';
  className?: string;
  onClick?: () => void;
};

/** English (filled) and Arabic (outline) CV links — open PDF in a new tab. */
export function CvDownloads({ labels, size = 'default', className, onClick }: CvDownloadsProps) {
  const isSm = size === 'sm';

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        asChild
        size={isSm ? 'sm' : 'lg'}
        className={cn('rounded-xl', isSm && 'px-3 text-xs font-semibold')}
      >
        <a
          href={CV_FILES.english.href}
          {...CV_LINK_PROPS}
          aria-label={labels.english}
          onClick={onClick}
        >
          <ExternalLink className={cn(isSm ? 'h-3.5 w-3.5' : 'h-5 w-5')} />
          {labels.english}
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size={isSm ? 'sm' : 'lg'}
        className={cn(
          'rounded-xl border-border/60 bg-background/20 hover:bg-background/40',
          isSm && 'px-3 text-xs font-semibold'
        )}
      >
        <a
          href={CV_FILES.arabic.href}
          {...CV_LINK_PROPS}
          aria-label={labels.arabic}
          onClick={onClick}
        >
          <ExternalLink className={cn(isSm ? 'h-3.5 w-3.5' : 'h-5 w-5')} />
          {labels.arabic}
        </a>
      </Button>
    </div>
  );
}
