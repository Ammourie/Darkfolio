import type { ReactNode } from 'react';
import Image from 'next/image';
import { Briefcase, ExternalLink, GraduationCap, Mail, Phone, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';
import { CV_FILES, CV_LINK_PROPS, type CvDownloadLabels } from '@/components/cv-downloads';
import { ProjectCard } from '@/components/project-card';
import { BentoCard } from '@/components/portfolio/bento-card';
import { SectionLabel } from '@/components/portfolio/section-label';
import { SocialLinks } from '@/components/portfolio/social-links';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { LocaleData } from '@/types/portfolio';
import type { Language } from '@/types/portfolio';

type PortfolioBentoHomeProps = {
  data: LocaleData;
  lang: Language;
  avatarSrc: string;
  cvLabels: CvDownloadLabels;
  phoneHref: string;
};

type AboutActionTileProps = {
  href: string;
  label: string;
  sublabel?: string;
  icon: ReactNode;
  openInNewTab?: boolean;
};

/** Quick-action tile for CV and contact links in About. */
function AboutActionTile({ href, label, sublabel, icon, openInNewTab }: AboutActionTileProps) {
  const className = 'bento-tile group flex h-full min-h-[5.5rem] flex-col justify-between gap-3';

  const inner = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-surface group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight text-foreground">{label}</p>
        {sublabel ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{sublabel}</p> : null}
      </div>
    </>
  );

  return (
    <a
      href={href}
      {...(openInNewTab ? CV_LINK_PROPS : {})}
      aria-label={label}
      className={className}
    >
      {inner}
    </a>
  );
}

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

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-24 outline-none md:px-6 md:pt-28"
    >
      {/* About bento — portrait, bio, actions (page top) */}
      <AnimatedSection id="about" initialVisible className="scroll-mt-24 md:scroll-mt-28" delay={0}>
        <SectionLabel title={data.about.title} className="!mb-6 md:!mb-8" />
        <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch lg:gap-5">
          <BentoCard glow span="lg:col-span-4" className="flex h-full min-h-0 flex-col p-4 md:p-5">
            <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-background/40 lg:aspect-auto lg:min-h-[12rem] lg:flex-1">
              <Image
                src={avatarSrc}
                alt={data.personal.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 320px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
            <div className="mt-5 px-1">
              <h1 className="text-lg font-bold font-headline tracking-tight">{data.personal.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{data.personal.title}</p>
            </div>
            <SocialLinks social={data.personal.social} className="mt-auto px-0.5 pt-5" size="lg" />
          </BentoCard>

          <div className="flex h-full min-h-0 flex-col gap-4 lg:col-span-8">
            <BentoCard className="relative flex min-h-0 flex-1 flex-col p-6 md:p-8 lg:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 end-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
              />
              <p className="relative flex-1 text-base leading-[1.75] text-muted-foreground md:text-lg md:leading-[1.8]">
                {data.about.description}
              </p>
            </BentoCard>

            <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              <AboutActionTile
                href={CV_FILES.english.href}
                openInNewTab
                label={cvLabels.english}
                sublabel="PDF"
                icon={<ExternalLink className="h-4 w-4" />}
              />
              <AboutActionTile
                href={CV_FILES.arabic.href}
                openInNewTab
                label={cvLabels.arabic}
                sublabel="PDF"
                icon={<ExternalLink className="h-4 w-4" />}
              />
              <AboutActionTile
                href={`mailto:${data.personal.email}`}
                label={data.static_strings['email']}
                sublabel={data.personal.email}
                icon={<Mail className="h-4 w-4" />}
              />
              {data.personal.phone ? (
                <AboutActionTile
                  href={`tel:${phoneHref}`}
                  label={data.static_strings['phone']}
                  sublabel={data.personal.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
              ) : (
                <div className="bento-tile flex min-h-[5.5rem] flex-col justify-center gap-2 opacity-60">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">{data.navigation.projects}</p>
                  <a href="#projects" className="text-xs font-semibold text-primary hover:underline">
                    {data.static_strings['view_projects']}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Experience */}
      <AnimatedSection id="experience" className="scroll-mt-28 mt-20 md:mt-28" delay={120}>
        <SectionLabel title={data.sections.experience.title} />
        <div className="grid gap-4 md:grid-cols-2">
          {(data.experience || []).map((item) => (
            <BentoCard
              key={`${item.company}-${item.title}`}
              className="border-s-2 border-s-transparent p-6 transition-surface hover:border-s-primary/60 hover:border-primary/20 md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {item.period}
                </span>
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
        <SectionLabel title={data.sections.education.title} />
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

      {/* Skills */}
      <AnimatedSection id="skills" className="scroll-mt-28 mt-20 md:mt-28" delay={200}>
        <SectionLabel title={data.sections.skills.title} />
        <BentoCard glow className="p-6 md:p-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill) => (
              <li
                key={skill.name}
                className="rounded-xl border border-white/[0.06] bg-background/30 p-4 transition-surface hover:border-primary/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{skill.name}</span>
                  <span className="text-xs font-bold tabular-nums text-primary">{skill.level}%</span>
                </div>
                <Progress
                  value={skill.level}
                  className="mt-3 h-1.5 bg-white/[0.06]"
                  aria-label={`${skill.name} ${skill.level}%`}
                />
              </li>
            ))}
          </ul>
        </BentoCard>
      </AnimatedSection>

      {/* Projects */}
      <AnimatedSection id="projects" className="scroll-mt-28 mt-20 md:mt-28" delay={240}>
        <SectionLabel title={data.sections.projects.title} />
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
        {projects.length === 0 && (
          <BentoCard className="p-8 text-center text-muted-foreground">{data.static_strings['projects_empty']}</BentoCard>
        )}
      </AnimatedSection>

      {/* Contact anchor — email/phone/CV live in About only */}
      <AnimatedSection id="contact" className="scroll-mt-28 mt-20 md:mt-28" delay={280}>
        <BentoCard
          glow
          className={cn(
            'relative overflow-hidden p-8 text-center md:p-10',
            'before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent'
          )}
        >
          <SectionLabel title={data.navigation.contact} className="!mb-4 text-center [&_h2]:text-3xl [&_h2]:md:text-4xl" />
          <p className="mx-auto max-w-lg text-muted-foreground leading-relaxed">{data.static_strings['contact_description']}</p>
          <div className="mt-6">
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/[0.12] bg-white/[0.02] px-8">
              <a href="#about">{data.static_strings['contact_details_in_about']}</a>
            </Button>
          </div>
        </BentoCard>
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {data.personal.name}
        </footer>
      </AnimatedSection>
    </main>
  );
}
