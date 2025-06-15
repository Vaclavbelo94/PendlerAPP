
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { ModernNavbar } from "@/components/modern/ModernNavbar";

const ModernIndex = () => {
  const { t } = useLanguage();

  return (
    <>
      <ModernNavbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">{t('heroTitle')}</h1>
        <p className="mb-2">{t('heroSubtitle')}</p>
        <p className="mb-2">{t('heroDescription')}</p>
      </main>
    </>
  );
};

export default ModernIndex;
