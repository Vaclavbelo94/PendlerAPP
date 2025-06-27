import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiamondIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/hooks/auth';
import { useUnifiedPremiumStatus } from "@/hooks/useUnifiedPremiumStatus";

export const IndexBanners = () => {
  const { user } = useAuth();
  const { canAccess } = useUnifiedPremiumStatus();

  return (
    <AnimatePresence>
      {!user && (
        <motion.div 
          className="bg-primary text-primary-foreground py-3 px-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
            Nemáte ještě účet? 
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register">
                <Button variant="secondary" size="sm">
                  Registrujte se zdarma
                </Button>
              </Link>
            </motion.div>
          </p>
        </motion.div>
      )}
        
      {user && !canAccess && (
        <motion.div 
          className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 py-3 px-4 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animované pozadí */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.652-1.1 2.782-2.752 3.112-4.744.33-1.992-.23-3.743-1.85-5.88C21.368 6.93 19.8 4.44 18.52 2.225 17.236.01 16.904-.633 15.416.48c-1.413 1.06-2.047 2.46-2.23 3.784-.13 1.276.022 2.76.51 4.684C14.354 12.36 15.75 17.2 19.51 20h1.675zm-2.37-9.45c.655-2.08-.297-3.225-1.47-3.08-.95.1-1.7.93-1.953 2.083-.12.9.292 1.716.99 2.384.695.67 1.56.977 2.43.83zm-8.5-12.627c.47-.226.86-.285 1.36-.075 2.24.942 3.366 2.987 3.526 5.876.1 1.674-.093 3.34-.565 4.962-.32 1.12-.87 2.2-1.514 3.214-.55.888-1.186 1.627-2.198 2.09-1.11.5-2.144.395-3.206.062-1.67-.52-2.865-1.488-3.787-2.884-.733-1.12-1.184-2.42-1.33-3.772-.152-1.38 0-2.75.52-4.123.532-1.4 1.368-2.63 2.353-3.742.866-.975 1.72-1.536 2.918-1.78 1.196-.244 2.11-.104 3.088.303zm-5.54 6.548c.046-1.086.617-1.972 1.218-2.4.506-.36 1.154-.454 1.624-.16.54.334.755.867.553 1.597-.135.486-.406.886-.732 1.244-.53.576-1.16.99-1.888 1.228-.216.06-.436.103-.654.147-.067-.57-.073-1.13-.12-1.656zm42.42 4.77c1.073-1.1 2.43-1.9 3.848-2.28.616-.163 1.25-.257 1.88-.275.335-.01.77.033 1.003.368.13.188.132.435.123.656-.135 3.324-1.66 6.235-4.255 8.572-.83.747-1.75 1.4-2.73 1.97-.75.43-1.526.817-2.335 1.15-.207.087-.448.125-.666.18-.425.11-.708-.23-.39-.618.17-.216.395-.4.598-.6.404-.4.807-.816 1.196-1.236 1.144-1.235 2.072-2.52 2.502-4.17.067-.26.117-.527.16-.8.022-.16.038-.43-.04-.56-.124-.234-.414-.136-.597-.103-.255.046-.505.096-.75.166-1.775.497-3.135 1.5-3.903 3.21-.275.607-.437 1.246-.518 1.898-.087.7-.096 1.43.098 2.117.306 1.084 1.072 1.88 2.07 2.357.497.238 1.073.36 1.627.36.627.005 1.26.016 1.877-.067 1.914-.262 3.484-1.172 4.692-2.596.766-.905 1.363-1.93 1.822-3.044.815-1.97 1.433-3.994 1.6-6.13.022-.232.045-.47-.01-.696-.092-.355-.4-.605-.778-.682-.77-.158-1.518.012-2.252.218-1.847.518-3.463 1.406-4.96 2.583-.476.375-.94.777-1.4 1.174-.086-.778.007-1.485.25-2.154.49-1.343 1.494-2.16 2.785-2.633.795-.288 1.63-.448 2.473-.583.988-.158 1.963-.298 2.934-.515.356-.08.658-.352.75-.708.107-.4-.073-.685-.395-.878-.96-.574-1.98-.88-3.08-.96-1.052-.077-2.08.096-3.08.44-1.612.558-2.933 1.555-4.07 2.83-.896 1.004-1.7 2.098-2.39 3.276-.017.03-.05.056-.066.087-.684-.44-1.05-1.06-1.277-1.813-.313-1.045-.345-2.118-.153-3.183.26-1.44.95-2.597 2.08-3.483.242-.188.518-.334.672-.605.137-.238.065-.504-.2-.595-.582-.203-1.154-.28-1.757-.203-.518.066-1.05.148-1.046.802 0 .15-.088.288-.102.436-.28 3.045.487 5.67 2.586 7.916zm15.94-7.746c1.285.715 2.345 1.656 3.14 2.883.872 1.345 1.447 2.835 1.837 4.403.102.408-.065.645-.373.806-.268.14-.756.21-.82-.138-.113-.614-.273-1.24-.438-1.853-.492-1.814-1.156-3.57-2.027-5.24-.23-.44-.896-.98-1.32-.868z' fill='%23b07b02' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
            }}
            animate={{ x: [0, 100, 0] }}
            transition={{ 
              duration: 60, 
              repeat: Infinity, 
              repeatType: "loop" 
            }}
          />

          <p className="flex items-center justify-center gap-2 text-sm sm:text-base relative z-10">
            <motion.div 
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }} 
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <DiamondIcon className="h-4 w-4" />
            </motion.div>
            Odemkněte všechny funkce s Premium 
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/premium">
                <Button variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
                  Aktivovat Premium
                </Button>
              </Link>
            </motion.div>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IndexBanners;
