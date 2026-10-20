import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Public CV paths for reuse in about tiles. */
export const CV_FILES = {
  english: {
    href: '/cv/cv_english.pdf',
    download: 'Mohammed-Ammourie-CV-EN.pdf',
  },
  arabic: {
    href: '/cv/cv_arabic.pdf',
    download: 'Mohammed-Ammourie-CV-AR.pdf',
  },
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

/** English (filled) and Arabic (outline) CV download buttons. */
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
          download={CV_FILES.english.download}
          aria-label={labels.english}
          onClick={onClick}
        >
          <Download className={cn(isSm ? 'h-3.5 w-3.5' : 'h-5 w-5')} />
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
          download={CV_FILES.arabic.download}
          aria-label={labels.arabic}
          onClick={onClick}
        >
          <Download className={cn(isSm ? 'h-3.5 w-3.5' : 'h-5 w-5')} />
          {labels.arabic}
        </a>
      </Button>
    </div>
  );
}
