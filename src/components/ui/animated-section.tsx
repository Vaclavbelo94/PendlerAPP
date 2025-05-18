
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
  threshold?: number;
  type?: "fade" | "slide" | "scale" | "combined";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
  threshold = 0.1,
  type = "fade",
}: AnimatedSectionProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once && ref.current) observer.unobserve(ref.current);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [once, threshold]);
  
  const getAnimationVariants = () => {
    switch (type) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, delay } }
        };
      case "slide":
        const offset = 50;
        const directionOffset = {
          up: { y: offset },
          down: { y: -offset },
          left: { x: offset },
          right: { x: -offset }
        };
        return {
          hidden: { opacity: 0, ...directionOffset[direction] },
          visible: { 
            opacity: 1, 
            x: 0, 
            y: 0, 
            transition: { 
              duration, 
              delay 
            } 
          }
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { 
              duration, 
              delay 
            } 
          }
        };
      case "combined":
        const combinedOffset = 30;
        const combinedDirection = {
          up: { y: combinedOffset },
          down: { y: -combinedOffset },
          left: { x: combinedOffset },
          right: { x: -combinedOffset }
        };
        return {
          hidden: { opacity: 0, scale: 0.9, ...combinedDirection[direction] },
          visible: { 
            opacity: 1, 
            scale: 1, 
            x: 0, 
            y: 0, 
            transition: { 
              duration, 
              delay,
              ease: "easeOut"
            } 
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, delay } }
        };
    }
  };
  
  return (
    <div ref={ref} className={cn(className)}>
      <motion.div
        variants={getAnimationVariants()}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}) {
  // Pokud je poskytnut index, použijeme ho pro výpočet zpoždění
  const itemDelay = index !== undefined ? index * 0.1 + delay : delay;
  
  return (
    <AnimatedSection 
      delay={itemDelay} 
      className={className} 
      type="combined" 
      direction="up"
    >
      {children}
    </AnimatedSection>
  );
}

export function HoverEffectCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-300",
        className
      )}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        y: -5
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  className,
  formatter = (value: number) => Math.floor(value).toString(),
  suffix = "",
  prefix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  formatter?: (value: number) => string;
  suffix?: string;
  prefix?: string;
}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(from);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = from + progress * (to - from);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(to);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animateCount);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [from, to, duration, delay, isInView]);

  return (
    <div ref={ref} className={className}>
      {prefix}{formatter(count)}{suffix}
    </div>
  );
}
