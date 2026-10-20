import type { Project } from '@/types/portfolio';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Layers } from 'lucide-react';
import { getPortfolioData } from '@/lib/data';
import { isLanguage } from '@/app/page';
import { Language } from '@/types/portfolio';
import { ResponsiveImage } from './responsive-image';
import { BentoCard } from '@/components/portfolio/bento-card';
import { cn } from '@/lib/utils';
import {
  getProjectCoverSrc,
  hasProjectAsset,
  isProjectCoverPlaceholder,
} from '@/lib/project-images';

export async function ProjectCard({
  project,
  lang,
  featured = false,
}: {
  project: Project;
  lang: Language;
  featured?: boolean;
}) {
  const currentLanguage: Language = isLanguage(lang) ? lang : 'en';
  const data = await getPortfolioData(currentLanguage);
  const coverSrc = getProjectCoverSrc(project.cover_image);
  const iconSrc = project.main_image;
  const showIcon = hasProjectAsset(iconSrc);
  const coverIsPlaceholder = isProjectCoverPlaceholder(coverSrc);

  return (
    <Link
      href={`/projects/${project.slug}?lang=${lang}`}
      className={cn('group block h-full', featured && 'md:min-h-[360px]')}
    >
      <BentoCard
        className={cn(
          'flex h-full flex-col transition-surface hover:border-primary/30 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]',
          'overflow-hidden'
        )}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden bg-muted/20',
            featured ? 'h-52 md:h-64' : 'h-44'
          )}
        >
          {!coverIsPlaceholder ? (
            <Image src={coverSrc} alt="" fill className="object-cover blur-2xl scale-110 opacity-40" aria-hidden />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <ResponsiveImage src={coverSrc} alt={project.title} />
          {coverIsPlaceholder ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Layers className="h-8 w-8 text-primary/40" aria-hidden />
            </div>
          ) : null}
          {showIcon && iconSrc !== coverSrc ? (
            <div className="absolute bottom-3 start-3 z-10 h-14 w-14 overflow-hidden rounded-xl border border-white/20 bg-background/80 shadow-lg md:h-16 md:w-16">
              <Image src={iconSrc} alt="" fill className="object-cover" sizes="64px" />
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className={cn('font-bold font-headline tracking-tight', featured ? 'text-2xl' : 'text-lg')}>
              {project.title}
            </h3>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-muted-foreground transition-surface group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {project.description_short}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, featured ? 5 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-surface group-hover:opacity-100">
            {data.static_strings['view_details']}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden />
          </span>
        </div>
      </BentoCard>
    </Link>
  );
}
