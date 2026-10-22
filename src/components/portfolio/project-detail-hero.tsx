import Image from 'next/image';
import Link from 'next/link';
import { Building2, ExternalLink, Github, Layers, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BentoCard } from '@/components/portfolio/bento-card';
import {
  getProjectCoverSrc,
  hasProjectAsset,
  isProjectCoverPlaceholder,
  PROJECT_COVER_PLACEHOLDER,
} from '@/lib/project-images';
import type { Project } from '@/types/portfolio';
import { cn } from '@/lib/utils';

type StoreLabels = {
  googlePlay: string;
  appleStore: string;
  sourceCode: string;
};

type ProjectDetailHeroProps = {
  project: Project;
  storeLabels: StoreLabels;
};

const storeLinkClass =
  'inline-flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold';

/** Cover + title/meta block for the project detail page. */
export function ProjectDetailHero({ project, storeLabels }: ProjectDetailHeroProps) {
  const coverSrc = getProjectCoverSrc(project.cover_image);
  const iconSrc = hasProjectAsset(project.main_image) ? project.main_image : PROJECT_COVER_PLACEHOLDER;
  const coverIsPlaceholder = isProjectCoverPlaceholder(coverSrc);
  const showIcon = hasProjectAsset(project.main_image) && project.main_image !== coverSrc;

  const hasStores = Boolean(project.google_play || project.apple_store || project.source_code_url);

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
      <BentoCard
        glow
        className="group relative aspect-[16/10] overflow-hidden sm:aspect-[2/1] lg:order-1 lg:col-span-7 lg:aspect-auto lg:min-h-[380px] rtl:lg:order-2"
      >
        <div className="absolute inset-0">
          {!coverIsPlaceholder ? (
            <Image
              src={coverSrc}
              alt=""
              fill
              className="object-cover blur-2xl scale-110 opacity-35"
              aria-hidden
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
          <Image
            src={coverSrc}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className={cn(
              'transition-surface',
              coverIsPlaceholder ? 'object-contain p-10 opacity-90' : 'object-cover'
            )}
          />
          {coverIsPlaceholder ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Layers className="h-10 w-10 text-primary/35" aria-hidden />
            </div>
          ) : null}
          {showIcon ? (
            <div className="absolute bottom-4 start-4 z-10 h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-background/85 shadow-lg md:h-20 md:w-20">
              <Image src={iconSrc} alt="" fill className="object-cover" sizes="80px" priority />
            </div>
          ) : null}
        </div>
      </BentoCard>

      <BentoCard className="flex h-full flex-col gap-5 p-6 text-start md:p-8 lg:order-2 lg:col-span-5 lg:min-h-[380px] lg:justify-between rtl:lg:order-1">
        <div className="flex flex-col gap-4">
          {!showIcon ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/[0.12] bg-background/80 md:h-20 md:w-20">
              <Image src={iconSrc} alt="" fill className="object-cover" sizes="80px" priority />
            </div>
          ) : null}

          <div>
            <h1 className="text-balance font-headline text-2xl font-bold tracking-tight md:text-3xl">
              {project.title}
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
              {project.description_short}
            </p>
          </div>

          {project.company ? (
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              <li className="flex min-w-0 max-w-full items-center gap-2.5">
                <Building2 className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                <span className="truncate">{project.company}</span>
              </li>
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {hasStores ? (
            <div className="flex flex-col gap-2">
              {project.google_play ? (
                <Button asChild className="h-11 w-full rounded-xl px-4">
                  <Link href={project.google_play} target="_blank" rel="noopener noreferrer" className={storeLinkClass}>
                    <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
                    {storeLabels.googlePlay}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                  </Link>
                </Button>
              ) : null}
              {project.apple_store ? (
                <Button asChild variant="outline" className="h-11 w-full rounded-xl border-white/[0.1] px-4">
                  <Link href={project.apple_store} target="_blank" rel="noopener noreferrer" className={storeLinkClass}>
                    {storeLabels.appleStore}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                  </Link>
                </Button>
              ) : null}
              {project.source_code_url ? (
                <Button asChild variant="secondary" className="h-11 w-full rounded-xl px-4">
                  <Link href={project.source_code_url} target="_blank" rel="noopener noreferrer" className={storeLinkClass}>
                    <Github className="h-4 w-4 shrink-0" aria-hidden />
                    {storeLabels.sourceCode}
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}

          {project.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground md:text-[11px]">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </BentoCard>
    </div>
  );
}
