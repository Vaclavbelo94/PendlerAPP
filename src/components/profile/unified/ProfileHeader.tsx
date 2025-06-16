
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ShieldIcon, UserIcon, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const ProfileHeader = () => {
  const { user, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  const isLandscapeMobile = isMobile && orientation === "landscape";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className={`relative z-10 ${isLandscapeMobile ? "py-4 px-4" : "py-8 px-6"}`}>
        <motion.div 
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isLandscapeMobile ? "mb-3" : "mb-6"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={isMobile ? 'text-center' : ''}>
            <motion.h1 
              className={`font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${isLandscapeMobile ? "text-2xl" : "text-3xl md:text-4xl"} ${isMobile ? 'text-center' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Můj profil
            </motion.h1>
            <motion.p 
              className={`text-muted-foreground ${isLandscapeMobile ? "text-sm" : "text-lg"} ${isMobile ? 'text-center' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Spravujte své osobní údaje a nastavení
            </motion.p>
          </div>
          
          <motion.div 
            className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isAdmin && (
              <Badge variant="destructive" className={`flex items-center gap-1 ${isLandscapeMobile ? "text-xs px-2 py-0" : ""}`}>
                <ShieldIcon className={isLandscapeMobile ? "h-2 w-2" : "h-3 w-3"} />
                {isLandscapeMobile ? "Admin" : "Administrátor"}
              </Badge>
            )}
            {isPremium && (
              <Badge className={`bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex items-center gap-1 ${isLandscapeMobile ? "text-xs px-2 py-0" : ""}`}>
                <Crown className={isLandscapeMobile ? "h-2 w-2" : "h-3 w-3"} />
                <Sparkles className={isLandscapeMobile ? "h-2 w-2" : "h-3 w-3"} />
                Premium
              </Badge>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className={`flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 ${isLandscapeMobile ? "p-3" : "p-6"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className={`rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 ${
              isLandscapeMobile ? "h-12 w-12" : "h-16 w-16"
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <UserIcon className={`${isLandscapeMobile ? "h-6 w-6" : "h-8 w-8"} text-primary`} />
          </motion.div>
          
          <div className={`flex-1 ${isMobile ? 'text-center' : ''}`}>
            <motion.h2 
              className={`font-semibold ${isLandscapeMobile ? "text-lg" : "text-xl md:text-2xl"} ${isMobile ? 'text-center' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Uživatel'}
            </motion.h2>
            <motion.p 
              className={`text-muted-foreground ${isLandscapeMobile ? "text-sm" : "text-base"} ${isMobile ? 'text-center' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {user?.email}
            </motion.p>
            <motion.div 
              className={`flex items-center gap-2 ${isLandscapeMobile ? "mt-1" : "mt-2"} ${isMobile ? 'justify-center' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <span className={`text-muted-foreground ${isLandscapeMobile ? "text-xs" : "text-sm"} ${isMobile ? 'text-center' : ''}`}>
                Registrován: {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'N/A'}
              </span>
            </motion.div>
          </div>

          <motion.div 
            className={`flex flex-col sm:flex-row gap-2 ${isMobile ? 'items-center' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {!isPremium && (
              <Button 
                onClick={() => navigate("/premium")}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg transition-all duration-300 hover:scale-105"
                size={isLandscapeMobile ? "sm" : "sm"}
              >
                <Crown className="h-4 w-4 mr-2" />
                {isLandscapeMobile ? "Premium" : "Aktivovat Premium"}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileHeader;
