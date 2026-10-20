import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaGithub, FaLinkedin, FaTwitter, FaTelegram } from 'react-icons/fa';
import type { PersonalInfo } from '@/types/portfolio';
import { cn } from '@/lib/utils';

type SocialLinksProps = {
  social: PersonalInfo['social'];
  className?: string;
  size?: 'default' | 'lg';
};

/** Social icon row for hero, bento, and contact. */
export function SocialLinks({ social, className, size = 'default' }: SocialLinksProps) {
  const iconClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const btnClass =
    size === 'lg'
      ? 'h-12 w-12 rounded-xl'
      : 'h-10 w-10 rounded-lg';

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button asChild variant="ghost" size="icon" className={cn(btnClass, 'bg-white/[0.04] hover:bg-primary/15 hover:text-primary transition-surface')}>
        <Link href={social.github} target="_blank" aria-label="GitHub">
          <FaGithub className={iconClass} />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className={cn(btnClass, 'bg-white/[0.04] hover:bg-primary/15 hover:text-primary transition-surface')}>
        <Link href={social.linkedin} target="_blank" aria-label="LinkedIn">
          <FaLinkedin className={iconClass} />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className={cn(btnClass, 'bg-white/[0.04] hover:bg-primary/15 hover:text-primary transition-surface')}>
        <Link href={social.twitter} target="_blank" aria-label="Twitter">
          <FaTwitter className={iconClass} />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className={cn(btnClass, 'bg-white/[0.04] hover:bg-primary/15 hover:text-primary transition-surface')}>
        <Link href={social.telegram} target="_blank" aria-label="Telegram">
          <FaTelegram className={iconClass} />
        </Link>
      </Button>
    </div>
  );
}
