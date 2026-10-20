import { cn } from '@/lib/utils';

type SectionLabelProps = {
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
};

/** Section heading pattern for bento layout pages. */
export function SectionLabel({ title, subtitle, className, id }: SectionLabelProps) {
  return (
    <div id={id} className={cn('mb-8 md:mb-10', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">{subtitle ?? 'Section'}</p>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">{title}</h2>
    </div>
  );
}
