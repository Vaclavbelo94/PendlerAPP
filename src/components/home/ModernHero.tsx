import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";

const ModernHero = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-primary/10 to-background py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg mb-4 text-muted-foreground">
            {t('heroSubtitle')}
          </p>
          <p className="mb-8 text-base">{t('heroDescription')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg">
              <Link to="/register">{t('getStarted')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">{t('learnMore')}</Link>
            </Button>
          </div>
        </div>
        {/* Ilustrační obrázek je volitelný */}
        <div className="md:w-1/2 w-full flex items-center justify-center">
          <img
            src="/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png"
            alt="Pendler Hero Illustration"
            className="max-w-md w-full rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
