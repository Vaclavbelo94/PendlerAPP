
import { Helmet } from "react-helmet";
import ModernHero from "@/components/home/ModernHero";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>PendlerApp - {t('czechWorkersHelper')}</title>
        <meta name="description" content={t('completeGermanySolution')} />
        <meta name="keywords" content="pendler, německo, práce, směny, němčina, kalkulačka mezd" />
        <meta property="og:title" content={`PendlerApp - ${t('czechWorkersHelper')}`} />
        <meta property="og:description" content={t('completeGermanySolution')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pendlerapp.com" />
      </Helmet>
      <ModernHero />
    </>
  );
};

export default Index;
