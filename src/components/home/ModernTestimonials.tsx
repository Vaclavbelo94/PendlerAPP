
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

export const ModernTestimonials = () => {
  const testimonials = [
    {
      name: 'Pavel Novák',
      role: 'Pendler, 3 roky zkušeností',
      content: 'Pendlerův Pomocník mi ušetřil spoustu času. Správa směn je skvělá a německé lekce mi pomohly zlepšit komunikaci s kolegy.',
      rating: 5,
      initials: 'PN',
      location: 'Praha → Mnichov'
    },
    {
      name: 'Marie Svobodová',
      role: 'HR specialistka',
      content: 'Daňové kalkulačky jsou přesné a velmi užitečné. Konečně vím, kolik si skutečně vydělám po všech srážkách.',
      rating: 5,
      initials: 'MS',
      location: 'Brno → Stuttgart'
    },
    {
      name: 'Tomáš Dvořák',
      role: 'Dělník ve výrobě',
      content: 'Aplikace je intuitivní a má vše co potřebuji. Zejména oceňuji offline funkce a správu vozidla.',
      rating: 5,
      initials: 'TD',
      location: 'Ostrava → Dresden'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Co říkají naši uživatelé
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Přečtěte si skutečné příběhy lidí, kterým Pendlerův Pomocník změnil způsob práce v zahraničí.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="mr-3">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-primary font-medium">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernTestimonials;
