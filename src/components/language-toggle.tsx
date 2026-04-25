'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const onSelectLocale = (nextLocale: string) => {
    // Reconstruct the full path with search parameters if any exist
    const currentParams = searchParams.toString();
    const href = currentParams ? `${pathname}?${currentParams}` : pathname;
    
    router.replace(href as any, { locale: nextLocale, scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Languages className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onSelectLocale('en-gb')}
          className={locale === 'en-gb' ? 'bg-blue-50 text-blue-600 font-medium' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onSelectLocale('de-de')}
          className={locale === 'de-de' ? 'bg-blue-50 text-blue-600 font-medium' : ''}
        >
          Deutsch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
