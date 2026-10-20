export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  /**
   * Phone number shown in the contact section (kept as a string to preserve formatting).
   */
  phone: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    telegram: string;
  };
  avatar: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Project {
  slug: string;
  title: string;
  description_short: string;
  description_long: string;
  tags: string[];
  main_image: string;
  /** Wide hero / card banner; empty → UI uses cover placeholder. */
  cover_image?: string;
  gallery_images: string[];
  source_code_url?: string;
  google_play?: string;
  apple_store?: string;
  date?: string;
  company?: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface ThemeConfig {
  colors: {
    primary: { [key: string]: string };
    secondary: { [key: string]: string };
    accent: { [key: string]: string };
    neutral: { [key: string]: string };
  };
  typography: {
    fontFamily: {
      sans: string[];
      headline: string[];
      mono?: string[];
    };
    fontSize?: { [key: string]: string };
  };
  spacing?: { [key: string]: string };
  shadows?: { [key: string]: string };
  borderRadius?: { [key: string]: string };
}

export interface Navigation {
  home: string;
  about: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  /**
   * Label for the CV/resume download navigation item.
   */
  cv: string;
  contact: string;
}

export interface AboutSection {
  title: string;
  description: string;
}

export interface Sections {
  experience: { title: string };
  education: { title: string };
  skills: { title: string };
  projects: { 
    title: string;
    viewProject: string;
    viewDetails: string;
  };
}

export interface Footer {
  copyright: string;
  downloadJson: string;
}

export interface LocaleData {
  displayName: string;
  navigation: Navigation;
  personal: PersonalInfo;
  about: AboutSection;
  sections: Sections;
  footer: Footer;
  skills?: Skill[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  static_strings: { [key: string]: string };
}

export interface PortfolioData extends LocaleData {
  theme: ThemeConfig;
}

export type Language = 'en' | 'ar';
