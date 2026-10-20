import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Briefcase, GraduationCap, Layers, Mail, Phone, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';
import { CvDownloads, type CvDownloadLabels } from '@/components/cv-downloads';
import { ProjectCard } from '@/components/project-card';
import { BentoCard } from '@/components/portfolio/bento-card';
import { SectionLabel } from '@/components/portfolio/section-label';
import { SocialLinks } from '@/components/portfolio/social-links';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { LocaleData } from '@/types/portfolio';
import type { Language } from '@/types/portfolio';

type PortfolioBentoHomeProps = {
  data: LocaleData;
  lang: Language;
  avatarSrc: string;
  cvLabels: CvDownloadLabels;
  phoneHref: string;
};

/** Bento-grid portfolio layout (modern single-page template). */
export function PortfolioBentoHome({
  data,
  lang,
  avatarSrc,
  cvLabels,
  phoneHref,
}: PortfolioBentoHomeProps) {
  const projects = data.projects || [];
  const featuredProjects = projects.slice(0, 2);
  const moreProjects = projects.slice(2);
  const skills = data.skills || [];
  const nameParts = data.personal.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? data.personal.name;
  const restName = nameParts.slice(1).join(' ');

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
      {/* Editorial hero */}
      <AnimatedSection id="hero" className="scroll-mt-28 min-h-[75vh] flex flex-col justify-end pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {data.personal.title}
            </div>
            <h1 className="mt-6 font-headline text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tighter">
              <span className="block text-foreground">{firstName}</span>
              {restName ? (
                <span className="block text-muted-foreground/90">{restName}</span>
              ) : null}
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              {data.about.description.slice(0, 160)}
              {data.about.description.length > 160 ? '…' : ''}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-6">
                <a href="#projects">
                  {data.static_strings['view_projects']}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <CvDownloads labels={cvLabels} />
            </div>
          </div>
          <div className="hidden md:block text-muted-foreground">
            <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
          </div>
        </div>
      </AnimatedSection>

      {/* Intro bento */}
      <AnimatedSection id="about" className="scroll-mt-28 mt-4" delay={80}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[minmax(140px,auto)]">
          <BentoCard glow span="md:col-span-5 md:row-span-2" className="p-2 min-h-[320px]">
            <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-xl">
              <Image
                src={avatarSrc}
                alt={data.personal.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-sm font-medium text-muted-foreground">{data.static_strings['personal_info']}</p>
                <p className="text-lg font-semibold text-foreground">{data.personal.name}</p>
              </div>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-7" className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <SectionLabel title={data.about.title} subtitle={data.navigation.about} className="mb-4" />
              <p className="text-muted-foreground leading-relaxed">{data.about.description}</p>
            </div>
            <SocialLinks social={data.personal.social} className="mt-6" size="lg" />
          </BentoCard>

          <BentoCard span="md:col-span-4" className="p-6">
            <p className="text-4xl font-bold font-headline text-primary">{projects.length}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{data.sections.projects.title}</p>
          </BentoCard>

          <BentoCard span="md:col-span-4" className="p-6">
            <p className="text-4xl font-bold font-headline text-primary">{skills.length}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{data.sections.skills.title}</p>
          </BentoCard>

          <BentoCard span="md:col-span-4" className="flex flex-col justify-center gap-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{data.navigation.cv}</p>
            <CvDownloads labels={cvLabels} size="sm" />
          </BentoCard>
        </div>
      </AnimatedSection>

      {/* Experience */}
      <AnimatedSection id="experience" className="scroll-mt-28 mt-20 md:mt-28" delay={120}>
        <SectionLabel title={data.sections.experience.title} subtitle={data.navigation.experience} />
        <div className="grid gap-4 md:grid-cols-2">
          {(data.experience || []).map((item) => (
            <BentoCard key={`${item.company}-${item.title}`} className="p-6 md:p-7 transition-surface hover:border-primary/25">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.period}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold font-headline">{item.company}</h3>
              <p className="mt-1 text-sm font-semibold text-primary/90">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </BentoCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Education */}
      <AnimatedSection id="education" className="scroll-mt-28 mt-20 md:mt-28" delay={160}>
        <SectionLabel title={data.sections.education.title} subtitle={data.navigation.education} />
        <div className="grid gap-4 md:grid-cols-2">
          {(data.education || []).map((item) => (
            <BentoCard key={`${item.institution}-${item.degree}`} className="p-6 md:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold font-headline">{item.institution}</h3>
              <p className="mt-1 text-sm font-semibold text-foreground/90">{item.degree}</p>
              <p className="mt-2 text-xs font-medium text-muted-foreground">{item.period}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </BentoCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Skills bento */}
      <AnimatedSection id="skills" className="scroll-mt-28 mt-20 md:mt-28" delay={200}>
        <SectionLabel title={data.sections.skills.title} subtitle={data.navigation.skills} />
        <div className="grid gap-4 lg:grid-cols-12">
          <BentoCard glow span="lg:col-span-5" className="p-6 md:p-8">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Stack</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-foreground/90"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </BentoCard>
          <BentoCard span="lg:col-span-7" className="p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => (
                <div key={skill.name} className="rounded-xl border border-white/[0.05] bg-background/30 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{skill.name}</span>
                    <span className="text-xs font-bold text-primary">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="mt-3 h-1.5 bg-white/[0.06]" aria-label={`${skill.name} proficiency`} />
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </AnimatedSection>

      {/* Projects */}
      <AnimatedSection id="projects" className="scroll-mt-28 mt-20 md:mt-28" delay={240}>
        <SectionLabel title={data.sections.projects.title} subtitle={data.navigation.projects} />
        {featuredProjects.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} lang={lang} featured />
            ))}
          </div>
        )}
        {moreProjects.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moreProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} lang={lang} />
            ))}
          </div>
        )}
      </AnimatedSection>

      {/* Contact bento */}
      <AnimatedSection id="contact" className="scroll-mt-28 mt-20 md:mt-28" delay={280}>
        <BentoCard glow className="p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionLabel title={data.navigation.contact} subtitle="Contact" className="mb-4" />
              <p className="text-lg text-muted-foreground leading-relaxed">{data.static_strings['contact_description']}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <a href={`mailto:${data.personal.email}`}>
                    <Mail className="h-4 w-4" />
                    {data.static_strings['email']}
                  </a>
                </Button>
                <CvDownloads labels={cvLabels} />
              </div>
            </div>
            <div className="grid gap-4">
              <a
                href={`mailto:${data.personal.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-surface hover:border-primary/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{data.static_strings['email']}</p>
                  <p className="truncate font-semibold group-hover:text-primary transition-surface">{data.personal.email}</p>
                </div>
              </a>
              {data.personal.phone && (
                <a
                  href={`tel:${phoneHref}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-surface hover:border-primary/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{data.static_strings['phone']}</p>
                    <p className="font-semibold group-hover:text-primary transition-surface">{data.personal.phone}</p>
                  </div>
                </a>
              )}
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <SocialLinks social={data.personal.social} />
              </div>
            </div>
          </div>
        </BentoCard>
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {data.personal.name}
        </footer>
      </AnimatedSection>
    </main>
  );
}
