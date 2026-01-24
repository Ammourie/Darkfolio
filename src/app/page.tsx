import { getPortfolioData } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code2, Download, Phone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ProjectCard } from '@/components/project-card';
import { EducationTimeline, ExperienceTimeline } from '@/components/timeline';
import { AnimatedSection } from '@/components/animated-section';
import { BackgroundDecorations } from '@/components/background-decorations';
import { ClientPageWrapper } from '@/components/client-page-wrapper';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTelegram
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Language } from '@/types/portfolio';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function isLanguage(lang: any): lang is Language {
  return lang === 'en' || lang === 'ar';
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const langParam = params?.lang; // Safely access lang
  const currentLanguage: Language = isLanguage(langParam) ? langParam : 'en';
  const data = await getPortfolioData(currentLanguage);

  // Ensure we have a valid avatar URL
  const avatarSrc = data.personal.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  /**
   * Small hero “tech chips” derived from the top skills list.
   * This avoids hardcoding and stays consistent across locales.
   */
  const topSkillChips = (data.skills || []).slice(0, 4).map((s) => s.name);

  /**
   * Prefer a normalized phone number for the `tel:` href while keeping the
   * original formatting in the UI.
   */
  const phoneHref = (data.personal.phone || '').replace(/\s+/g, '');

  return (
    <ClientPageWrapper initialLanguage={currentLanguage} navigation={data.navigation}>
      <div className="relative flex flex-col min-h-screen bg-background overflow-x-hidden">
        <BackgroundDecorations />

        <main className="flex-1 container mx-auto px-4 py-8 md:py-16 mt-16 md:mt-20">
          {/* Hero Section */}
          <AnimatedSection id="hero" className="min-h-[80vh] flex items-center">
            <Card className="relative w-full max-w-6xl mx-auto overflow-hidden border-border/60 bg-card/40 backdrop-blur-md shadow-material-xl">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

              <div className="relative grid gap-10 md:grid-cols-[1.25fr_0.75fr] items-center p-6 md:p-10">
                {/* Hero copy */}
                <div className="order-2 md:order-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    {data.personal.name}
                  </h1>
                  <p className="mt-4 text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
                    {data.personal.title}
                  </p>

                  {/* Tech chips */}
                  {topSkillChips.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                      {topSkillChips.map((chip) => (
                        <Badge
                          key={chip}
                          variant="secondary"
                          className="bg-muted/60 text-foreground/90 border border-border/50 px-3 py-1"
                        >
                          {chip}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Personal info chips */}
                  <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-4 py-2 text-sm font-medium text-foreground/90 hover:bg-background/50"
                      href={`mailto:${data.personal.email}`}
                    >
                      <MdEmail className="h-4 w-4" />
                      <span className="break-all">{data.personal.email}</span>
                    </a>
                    {data.personal.phone && (
                      <a
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-4 py-2 text-sm font-medium text-foreground/90 hover:bg-background/50"
                        href={`tel:${phoneHref}`}
                      >
                        <Phone className="h-4 w-4" />
                        <span>{data.personal.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Primary Actions */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3 sm:gap-4 justify-center md:justify-start">
                    <Button asChild size="lg" className="rounded-xl px-6">
                      <a href="/cv/cv.pdf" download="Mohammed-Ammourie-CV.pdf">
                        <Download className="h-5 w-5" />
                        {data.static_strings['download_cv']}
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-xl px-6 border-border/60 bg-background/30 hover:bg-background/50">
                      <a href="#projects">
                        {data.static_strings['view_projects']}
                      </a>
                    </Button>
                  </div>

                  {/* Social icons */}
                  <div className="mt-8 flex gap-2 justify-center md:justify-start">
                    <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                      <Link href={data.personal.social.github} target="_blank" aria-label="GitHub">
                        <FaGithub className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                      <Link href={data.personal.social.linkedin} target="_blank" aria-label="LinkedIn">
                        <FaLinkedin className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                      <Link href={data.personal.social.twitter} target="_blank" aria-label="Twitter">
                        <FaTwitter className="h-5 w-5" />
                      </Link>
                    </Button>

                    <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                      <Link href={data.personal.social.telegram} target="_blank" aria-label="Telegram">
                        <FaTelegram className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Avatar */}
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                  <div className="relative">
                    {/* Ambient glow behind the avatar */}
                    <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-primary/25 via-accent/15 to-secondary/25 blur-3xl opacity-60 animate-glow-slow" />

                    {/* Modern avatar frame: animated gradient ring + glass layer + badge */}
                    <div className="relative w-52 h-52 md:w-80 md:h-80">
                      {/* Animated conic gradient ring (kept outside the image so it doesn't rotate the photo) */}
                      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#2196f3,#009688,#9c27b0,#2196f3)] opacity-80 blur-[0.4px] animate-spin motion-reduce:animate-none [animation-duration:18s]" />
                      <div className="absolute inset-[6px] rounded-full bg-card/40 backdrop-blur-md border border-border/60 shadow-material-xl" />
                      {/* Soft highlight to give a “lens” feel */}
                      <div className="pointer-events-none absolute -top-2 left-8 h-10 w-28 rotate-[-18deg] rounded-full bg-white/10 blur-xl opacity-70" />

                      <div className="absolute inset-[10px]">
                        <Avatar className="h-full w-full ring-1 ring-border/60 shadow-material-xl">
                          <AvatarImage src={avatarSrc} alt={data.personal.name} />
                          <AvatarFallback className="text-3xl font-bold">{data.personal.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>

                      {/* “Code” badge */}
                      <div className="absolute bottom-2 right-2 h-11 w-11 rounded-2xl border border-border/60 bg-background/35 backdrop-blur-md shadow-material flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          {/* About Section */}
          <AnimatedSection id="about" className="mt-24 max-w-4xl mx-auto" delay={100}>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {data.about.title}
              </h2>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-10">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                  {data.about.description}
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Experience Section */}
          <AnimatedSection id="experience" className="mt-24 max-w-4xl mx-auto" delay={200}>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {data.sections.experience.title}
              </h2>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <ExperienceTimeline items={data.experience || []} />
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Education Section */}
          <AnimatedSection id="education" className="mt-24 max-w-4xl mx-auto" delay={300}>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {data.sections.education.title}
              </h2>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <EducationTimeline items={data.education || []} />
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Skills Section */}
          <AnimatedSection id="skills" className="mt-24" delay={400}>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {data.sections.skills.title}
              </h2>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            <Card className="max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {(data.skills || []).map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-2xl border border-border/60 bg-background/25 p-5 hover:bg-background/35 hover:-translate-y-0.5 hover:shadow-material-lg transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-foreground">{skill.name}</h3>
                        <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                      </div>
                      <div className="relative mt-4">
                        <Progress
                          value={skill.level}
                          className="h-3 bg-background/50"
                          aria-label={`${skill.name} proficiency`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-50"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Projects Section */}
          <AnimatedSection id="projects" className="mt-24" delay={500}>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {data.sections.projects.title}
              </h2>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
              {(data.projects || []).map((project) => (
                <div key={project.slug} className="h-full">
                  <ProjectCard project={project} lang={currentLanguage} />
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact Section */}
          <AnimatedSection id="contact" className="mt-24 max-w-4xl mx-auto" delay={600}>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {data.navigation.contact}
              </h2>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <p className="text-lg text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {data.static_strings['contact_description']}
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/60 bg-background/25 p-5 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <MdEmail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-muted-foreground">{data.static_strings['email']}</p>
                      <a className="font-semibold hover:underline break-all" href={`mailto:${data.personal.email}`}>
                        {data.personal.email}
                      </a>
                    </div>
                  </div>

                  {data.personal.phone && (
                    <div className="rounded-2xl border border-border/60 bg-background/25 p-5 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-muted-foreground">{data.static_strings['phone']}</p>
                        <a className="font-semibold hover:underline" href={`tel:${phoneHref}`}>
                          {data.personal.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="rounded-xl px-6">
                    <a href={`mailto:${data.personal.email}`}>
                      <MdEmail className="h-5 w-5" />
                      {data.static_strings['email']}
                    </a>
                  </Button>
                  <Button asChild variant="secondary" className="rounded-xl px-6">
                    <a href="/cv/cv.pdf" download="Mohammed-Ammourie-CV.pdf">
                      <Download className="h-5 w-5" />
                      {data.static_strings['download_cv']}
                    </a>
                  </Button>
                </div>

                <div className="mt-8 flex gap-2 justify-center">
                  <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                    <Link href={data.personal.social.github} target="_blank" aria-label="GitHub">
                      <FaGithub className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                    <Link href={data.personal.social.linkedin} target="_blank" aria-label="LinkedIn">
                      <FaLinkedin className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                    <Link href={data.personal.social.twitter} target="_blank" aria-label="Twitter">
                      <FaTwitter className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-background/20 hover:bg-primary/10 hover:text-primary">
                    <Link href={data.personal.social.telegram} target="_blank" aria-label="Telegram">
                      <FaTelegram className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </main>

        {/* Footer
        <footer className="w-full py-12 bg-card/50 backdrop-blur-sm border-t border-border/50 mt-24">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {data.personal.name}. {data.footer.copyright}
            </p>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <a href="/portfolio-data.json" download="portfolio-config.json">
                  <Download className="mr-2 h-4 w-4" />
                  {data.footer.downloadJson}
                </a>
              </Button>
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200">
                  <Link href={data.personal.social.github} target="_blank" aria-label="GitHub">
                    <FaGithub />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200">
                  <Link href={data.personal.social.linkedin} target="_blank" aria-label="LinkedIn">
                    <FaLinkedin />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200">
                  <Link href={`mailto:${data.personal.email}`} aria-label="Email">
                    <MdEmail />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </footer> */}
      </div>
    </ClientPageWrapper>
  );
}
