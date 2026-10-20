'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  displayName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', displayName: 'English', flag: '🇺🇸' },
  { code: 'ar', displayName: 'العربية', flag: '🇸🇾' },
];

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  /** Icon-only trigger for compact header layouts */
  compact?: boolean;
}

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  compact = false,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
    
    // Update URL with language parameter
    const newPath = pathname.includes('?') 
      ? `${pathname}&lang=${languageCode}`
      : `${pathname}?lang=${languageCode}`;
    router.push(newPath);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? 'icon' : 'sm'}
          className={cn(
            'text-foreground hover:bg-white/[0.06] transition-surface',
            compact
              ? 'h-9 w-9 rounded-full'
              : 'flex items-center gap-2 px-3 py-2 text-sm font-medium'
          )}
          aria-label={currentLang.displayName}
        >
          <Globe className="h-4 w-4" />
          {!compact && (
            <>
              <span className="text-lg">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.displayName}</span>
            </>
          )}
          {!compact && <ChevronDown className="h-3 w-3" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-200 ${
              currentLanguage === language.code
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{language.displayName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 