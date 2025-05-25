
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { IndexBanners } from "@/components/home/index/IndexBanners";
import { IndexContent } from "@/components/home/index/IndexContent";
import { ScrollToTopButton } from "@/components/home/index/ScrollToTopButton";
import { useIndexScrollHandling } from "@/components/home/index/useIndexScrollHandling";

const Index = () => {
  const { scrolled, animatedHeroVisible } = useIndexScrollHandling();
  const isMobile = !useMediaQuery("md");
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow relative">
        <IndexBanners />
        
        <IndexContent animatedHeroVisible={animatedHeroVisible} />

        <ScrollToTopButton scrolled={scrolled} />
      </main>
    </div>
  );
};

export default Index;
