
'use client';

import Link from 'next/link';
import { Landmark, Menu, Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/context/language-context';

export function Header() {
  const { t, setLanguage } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/#features', label: t('nav.features') },
    { href: '/track', label: 'Track Complaint' },
  ];

  const mobileNavLinks = [
    ...navLinks,
    { href: '/admin', label: t('nav.adminPanel') },
    { href: '/complaint', label: t('nav.submitComplaint') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Landmark className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl font-headline">CivicRoute AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-black font-bold"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin">
                <Button variant="ghost" className="text-black font-bold">{t('nav.adminPanel')}</Button>
            </Link>
            <Link href="/complaint">
              <Button>{t('nav.submitComplaint')}</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Languages className="h-5 w-5" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')}>
                  हिंदी (Hindi)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/login">
              <Button variant="outline" className="font-bold">{t('nav.login')}</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-800 hover:bg-blue-900 text-white">{t('nav.signUp')}</Button>
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                  <Landmark className="h-6 w-6 text-primary" />
                  <span className="font-bold">CivicRoute AI</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {mobileNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-medium hover:underline"
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t pt-4 flex flex-col gap-4">
                  <Link href="/signup">
                    <Button className="w-full">{t('nav.signUp')}</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
