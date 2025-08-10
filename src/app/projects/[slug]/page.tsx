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
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { ImageViewer, ImageGallery } from '@/components/image-viewer';
import type { Metadata } from 'next';
import { Language } from '@/types/portfolio';
import { ResponsiveImage } from '@/components/responsive-image';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}
export async function generateMetadata(
  { params, searchParams }: Props,
): Promise<Metadata> {
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
    slugs.forEach(s => {
      params.push({ slug: s.slug, lang: lang });
    });
  }

  return params;
}

export default async function ProjectPage({ params, searchParams }: Props) {
  // Await params and searchParams to resolve their values
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Safely access lang and slug
  const lang = (resolvedSearchParams.lang as Language) || 'en';
  const project = await getProjectBySlug(resolvedParams.slug, lang);
  const data = await getPortfolioData(lang);

  if (!project) {
    notFound();
  }

  // Ensure we have a valid image URL
  const imageSrc = project.main_image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 z-30">
        <Button asChild variant="ghost" className="shadow-lg">
          <Link href={`/?lang=${lang}#projects`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {data.static_strings['back_to_projects']}
          </Link>
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          {/* Hero Section */}
          <section className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-950/80 to-background mb-4">
            <div className="absolute inset-0">
              <ResponsiveImage
                src={imageSrc}
                alt=""
                
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 to-background" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-6 p-8 md:p-12">
              <div className="w-full md:w-[360px] h-[240px] relative rounded-xl overflow-hidden shadow-xl border border-blue-900 bg-black/60 mb-4">
                <Image
                  src={imageSrc}
                  alt={`Main image for ${project.title}`}
                  fill
                  className="object-cover"
                  data-ai-hint="app mockup"
                  priority
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground mb-2 drop-shadow-lg text-center">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-base px-3 py-1 rounded-full shadow">
                    {tag}
                  </Badge>
                ))}
              </div>
              {/* Platform Buttons Row */}
              {(project.google_play || project.apple_store || project.source_code_url) && (
                <div className="flex flex-row gap-4 mt-2">
                  {project.google_play && (
                    <Button asChild size="lg" className="flex items-center gap-2">
                      <Link href={project.google_play} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.654 2.978a1.5 1.5 0 0 1 1.7-.09l13.5 8.25a1.5 1.5 0 0 1 0 2.624l-13.5 8.25A1.5 1.5 0 0 1 3 20.25v-16.5a1.5 1.5 0 0 1 .654-1.272zm1.346 1.772v14.5l7.5-7.25-7.5-7.25zm9.03 7.25l6.47 3.96a.5.5 0 0 0 0-.872l-6.47-3.088zm0-1.5l6.47-3.088a.5.5 0 0 0 0-.872l-6.47 3.96z"/></svg>
                        Google Play
                      </Link>
                    </Button>
                  )}
                  {project.apple_store && (
                    <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                      <Link href={project.apple_store} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.03 0-.06 0-.09-.01-.09-1.13.94-2.06 2.07-2.06.03 0 .06 0 .09.01zm2.13 3.62c-1.14-.13-2.1.65-2.65.65-.56 0-1.43-.63-2.36-.61-.97.02-1.87.57-2.37 1.45-1.01 1.75-.26 4.34.72 5.76.48.7 1.05 1.48 1.8 1.45.72-.03.99-.47 1.86-.47.87 0 1.11.47 1.87.46.77-.01 1.25-.7 1.72-1.41.54-.78.76-1.54.77-1.58-.02-.01-1.48-.57-1.5-2.26-.01-1.42 1.16-2.09 1.21-2.12-.66-.97-1.68-1.08-2.04-1.1zm-2.18 12.13c-.41.94-.84 1.87-1.51 1.89-.66.02-.87-.61-1.63-.61-.76 0-.99.59-1.62.63-.65.04-1.15-.99-1.56-1.92-1.07-2.34-.94-5.36.45-5.38.41-.01.84.28 1.38.28.54 0 .93-.29 1.38-.28 1.41.02 1.56 3.09.48 5.39zm-2.18-13.13c.01-.01.02-.01.03-.01.01 0 .02 0 .03.01z"/></svg>
                        Apple Store
                      </Link>
                    </Button>
                  )}
                  {project.source_code_url && (
                    <Button asChild variant="secondary" size="lg" className="flex items-center gap-2">
                      <Link href={project.source_code_url} target="_blank">
                        <Github className="w-5 h-5" />
                        Source Code
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Description Section */}
          <section className="rounded-2xl bg-card/80 shadow-lg p-8 flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-headline mb-2 text-primary-foreground">
              {data.static_strings['about_project'] || 'About this project'}
            </h2>
            <p className="prose prose-invert text-lg leading-relaxed text-muted-foreground">
              {project.description_long}
            </p>
          </section>

          {/* Gallery Section */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <section id="gallery" className="rounded-2xl bg-card/80 shadow-lg p-8">
              <h2 className="text-3xl font-bold font-headline mb-6 mt-2 text-primary-foreground">
                {data.static_strings['gallery']}
              </h2>
              <ImageGallery
                images={project.gallery_images}
                altPrefix={`Gallery image for ${project.title}`}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
