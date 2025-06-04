
import { Helmet } from "react-helmet";
import ModernHero from "@/components/home/ModernHero";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PendlerApp - Pomocník pro české pracovníky v Německu</title>
        <meta name="description" content="Komplexní řešení pro české pracovníky v Německu. Správa směn, výuka němčiny, kalkulačky mezd a vše potřebné pro úspěšnou práci v zahraničí." />
        <meta name="keywords" content="pendler, německo, práce, směny, němčina, kalkulačka mezd" />
        <meta property="og:title" content="PendlerApp - Pomocník pro české pracovníky v Německu" />
        <meta property="og:description" content="Komplexní řešení pro české pracovníky v Německu. Správa směn, výuka němčiny, kalkulačky mezd a vše potřebné pro úspěšnou práci v zahraničí." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pendlerapp.com" />
      </Helmet>
      <ModernHero />
    </>
  );
};

export default Index;
