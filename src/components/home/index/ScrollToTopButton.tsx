
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";

interface ScrollToTopButtonProps {
  scrolled: boolean;
}

export const ScrollToTopButton = ({ scrolled }: ScrollToTopButtonProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          className="fixed bottom-7 right-5 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <motion.button
            className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl dark:bg-primary/90 dark:text-primary-foreground"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
