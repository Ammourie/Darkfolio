import {
  getProjectBySlug,
  getAllProjectSlugs,
  getAvailableLocales,
  getPortfolioData,
} from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github } from 'lucide-react';
import { ImageGallery } from '@/components/image-viewer';
import type { Metadata } from 'next';
import { Language } from '@/types/portfolio';
import { ResponsiveImage } from '@/components/responsive-image';
import { BackgroundDecorations } from '@/components/background-decorations';
import { BentoCard } from '@/components/portfolio/bento-card';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const lang = (resolvedSearchParams.lang as Language) || 'en';
  const project = await getProjectBySlug(resolvedParams.slug, lang);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Darkfolio`,
    description: project.description_short,
  };
}

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const params: { slug: string; lang: string }[] = [];

  for (const lang of locales) {
    const slugs = await getAllProjectSlugs(lang as Language);
    slugs.forEach((s) => {
      params.push({ slug: s.slug, lang: lang });
    });
  }

  return params;
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const lang = (resolvedSearchParams.lang as Language) || 'en';
  const project = await getProjectBySlug(resolvedParams.slug, lang);
  const data = await getPortfolioData(lang);

  if (!project) {
    notFound();
  }

  const imageSrc =
    project.main_image ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundDecorations />
      <div className="fixed top-6 left-6 z-30 rtl:left-auto rtl:right-6">
        <Button
          asChild
          variant="outline"
          className="rounded-full border-white/[0.08] bg-background/70 backdrop-blur-xl"
        >
          <Link href={`/?lang=${lang}#projects`}>
            <ArrowLeft className="h-4 w-4" />
            {data.static_strings['back_to_projects']}
          </Link>
        </Button>
      </div>

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-24 md:px-6">
        <BentoCard glow className="overflow-hidden">
          <div className="relative min-h-[280px]">
            <ResponsiveImage src={imageSrc} alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-5 p-8 md:p-12 pt-32">
              <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] shadow-material md:h-56">
                <Image
                  src={imageSrc}
                  alt={`Main image for ${project.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-center font-headline text-3xl font-bold tracking-tight md:text-5xl">{project.title}</h1>
              <div className="flex flex-wrap justify-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {(project.google_play || project.apple_store || project.source_code_url) && (
                <div className="flex flex-wrap justify-center gap-3">
                  {project.google_play && (
                    <Button asChild className="rounded-full">
                      <Link href={project.google_play} target="_blank">
                        Google Play
                      </Link>
                    </Button>
                  )}
                  {project.apple_store && (
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={project.apple_store} target="_blank">
                        Apple Store
                      </Link>
                    </Button>
                  )}
                  {project.source_code_url && (
                    <Button asChild variant="secondary" className="rounded-full">
                      <Link href={project.source_code_url} target="_blank">
                        <Github className="h-4 w-4" />
                        Source
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </BentoCard>

        <BentoCard className="mt-6 p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            {data.static_strings['about_project'] || 'About this project'}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{project.description_long}</p>
        </BentoCard>

        {project.gallery_images && project.gallery_images.length > 0 && (
          <BentoCard className="mt-6 p-8 md:p-10">
            <h2 className="font-headline text-2xl font-bold">{data.static_strings['gallery']}</h2>
            <div className="mt-6">
              <ImageGallery images={project.gallery_images} altPrefix={`Gallery image for ${project.title}`} />
            </div>
          </BentoCard>
        )}
      </main>
    </div>
  );
}
