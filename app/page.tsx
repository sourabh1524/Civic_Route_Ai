
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FilePlus2,
  BotMessageSquare,
  GanttChartSquare,
  Star,
  Zap,
  Clock,
  Lightbulb,
  Users,
  Building2,
  Shield,
  Droplets,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { t } = useLanguage();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  const howItWorksSteps = [
    {
      icon: <FilePlus2 className="h-10 w-10 text-primary" />,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      icon: <BotMessageSquare className="h-10 w-10 text-primary" />,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      icon: <GanttChartSquare className="h-10 w-10 text-primary" />,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
    {
      icon: <Star className="h-10 w-10 text-primary" />,
      title: t('howItWorks.step4.title'),
      description: t('howItWorks.step4.description'),
    },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 mb-4 text-primary" />,
      title: t('features.feature1.title'),
      description: t('features.feature1.description'),
    },
    {
      icon: <Clock className="h-8 w-8 mb-4 text-primary" />,
      title: t('features.feature2.title'),
      description: t('features.feature2.description'),
    },
    {
      icon: <Lightbulb className="h-8 w-8 mb-4 text-primary" />,
      title: t('features.feature3.title'),
      description: t('features.feature3.description'),
    },
    {
      icon: <Users className="h-8 w-8 mb-4 text-primary" />,
      title: t('features.feature4.title'),
      description: t('features.feature4.description'),
    },
  ];

  const departments = [
    { icon: <Building2 className="h-12 w-12 text-primary" />, name: t('departments.municipalCorp') },
    { icon: <Shield className="h-12 w-12 text-primary" />, name: t('departments.police') },
    { icon: <Zap className="h-12 w-12 text-primary" />, name: t('departments.electricityBoard') },
    { icon: <Droplets className="h-12 w-12 text-primary" />, name: t('departments.waterAuthority') },
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/complaint">
                <Button size="lg" className="font-bold text-lg py-6 px-8">
                  {t('hero.submitButton')}
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="secondary" className="font-bold text-lg py-6 px-8">
                  {t('hero.trackButton')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {t('howItWorks.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center flex flex-col items-center">
                  {step.icon}
                  <h3 className="text-xl font-bold mt-4 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {t('features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              {t('departments.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              {t('departments.subtitle')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {departments.map((dept) => (
                <div key={dept.name} className="flex flex-col items-center justify-center gap-4 p-6 bg-muted rounded-lg transition-transform hover:scale-105">
                  {dept.icon}
                  <span className="font-semibold text-lg">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              {t('cta.subtitle')}
            </p>
            <Link href="/complaint">
              <Button size="lg" variant="secondary" className="font-bold text-lg py-6 px-8">
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
