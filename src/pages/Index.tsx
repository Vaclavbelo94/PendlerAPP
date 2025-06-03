
import React from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { IndexBanners } from "@/components/home/index/IndexBanners";
import { ModernIndexContent } from "@/components/home/index/ModernIndexContent";
import { ScrollToTopButton } from "@/components/home/index/ScrollToTopButton";
import { useIndexScrollHandling } from "@/components/home/index/useIndexScrollHandling";

const Index = () => {
  const { scrolled, animatedHeroVisible } = useIndexScrollHandling();
  const isMobile = !useMediaQuery("md");
  
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Pendlerův Pomocník - Váš průvodce pro práci v zahraničí</title>
        <meta name="description" content="Komplexní průvodce pro Čechy pracující v Německu. Výuka němčiny, kalkulačky mezd, správa směn a vozidel." />
        
        {/* Google AdSense Verification Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5766122497657850"
          crossOrigin="anonymous"
        />
      </Helmet>
      
      <main className="flex-grow relative">
        <IndexBanners />
        
        <ModernIndexContent animatedHeroVisible={animatedHeroVisible} />

        <ScrollToTopButton scrolled={scrolled} />
      </main>
    </div>
  );
};

export default Index;
