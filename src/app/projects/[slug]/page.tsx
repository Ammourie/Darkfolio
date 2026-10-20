import {
  getProjectBySlug,
  getAllProjectSlugs,
  getAvailableLocales,
  getPortfolioData,
} from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ImageGallery } from '@/components/image-viewer';
import type { Metadata } from 'next';
import { Language } from '@/types/portfolio';
import { BackgroundDecorations } from '@/components/background-decorations';
import { BentoCard } from '@/components/portfolio/bento-card';
import { ProjectDetailHero } from '@/components/portfolio/project-detail-hero';
import { SectionLabel } from '@/components/portfolio/section-label';

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
    title: project.title,
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

  const aboutLabel = data.static_strings['about_project'] || 'About this project';
  const galleryLabel = data.static_strings['gallery'];
  const hasGallery = project.gallery_images && project.gallery_images.length > 0;

  const storeLabels = {
    googlePlay: data.static_strings['google_play'],
    appleStore: data.static_strings['apple_store'],
    sourceCode: data.static_strings['source_code'],
  };

  return (
    <div className="relative isolate min-h-screen text-foreground">
      <BackgroundDecorations />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-20 outline-none md:px-6 md:pt-24">
        <div className="mb-5 flex items-center md:mb-6">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-white/[0.08] bg-background/70 backdrop-blur-xl"
          >
            <Link href={`/?lang=${lang}#projects`}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
              {data.static_strings['back_to_projects']}
            </Link>
          </Button>
        </div>

        <ProjectDetailHero project={project} storeLabels={storeLabels} />

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <BentoCard className="p-6 md:p-8 lg:col-span-12">
            <SectionLabel
              title={aboutLabel}
              className="!mb-4 md:!mb-5 [&_h2]:text-2xl [&_h2]:md:text-3xl"
            />
            <p className="max-w-3xl text-start text-base leading-[1.8] text-muted-foreground md:text-lg">
              {project.description_long}
            </p>
          </BentoCard>

          {hasGallery ? (
            <BentoCard className="p-6 md:p-8 lg:col-span-12">
              <SectionLabel
                title={galleryLabel}
                className="!mb-4 md:!mb-5 [&_h2]:text-2xl [&_h2]:md:text-3xl"
              />
              <ImageGallery
                images={project.gallery_images}
                altPrefix={`Gallery image for ${project.title}`}
                variant="bento"
              />
            </BentoCard>
          ) : null}
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {data.personal.name}
        </footer>
      </main>
    </div>
  );
}
