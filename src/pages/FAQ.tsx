import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const { t } = useTranslation(['faq', 'navigation']);

  const faqCategories = [
    {
      title: t('faq:generalTitle'),
      items: [
        {
          question: t('faq:general1Q'),
          answer: t('faq:general1A')
        },
        {
          question: t('faq:general2Q'),
          answer: t('faq:general2A')
        },
        {
          question: t('faq:general3Q'),
          answer: t('faq:general3A')
        },
        {
          question: t('faq:general4Q'),
          answer: t('faq:general4A')
        }
      ]
    },
    {
      title: t('faq:premiumTitle'),
      items: [
        {
          question: t('faq:premium1Q'),
          answer: t('faq:premium1A')
        },
        {
          question: t('faq:premium2Q'),
          answer: t('faq:premium2A')
        },
        {
          question: t('faq:premium3Q'),
          answer: t('faq:premium3A')
        },
        {
          question: t('faq:premium4Q'),
          answer: t('faq:premium4A')
        }
      ]
    },
    {
      title: t('faq:technicalTitle'),
      items: [
        {
          question: t('faq:technical1Q'),
          answer: t('faq:technical1A')
        },
        {
          question: t('faq:technical2Q'),
          answer: t('faq:technical2A')
        },
        {
          question: t('faq:technical3Q'),
          answer: t('faq:technical3A')
        },
        {
          question: t('faq:technical4Q'),
          answer: t('faq:technical4A')
        }
      ]
    },
    {
      title: t('faq:workTitle'),
      items: [
        {
          question: t('faq:work1Q'),
          answer: t('faq:work1A')
        },
        {
          question: t('faq:work2Q'),
          answer: t('faq:work2A')
        },
        {
          question: t('faq:work3Q'),
          answer: t('faq:work3A')
        }
      ]
    },
    {
      title: t('faq:hrTitle'),
      items: [
        {
          question: t('faq:hr1Q'),
          answer: t('faq:hr1A')
        },
        {
          question: t('faq:hr2Q'),
          answer: t('faq:hr2A')
        },
        {
          question: t('faq:hr3Q'),
          answer: t('faq:hr3A')
        }
      ]
    },
    {
      title: t('faq:dhlTitle'),
      items: [
        {
          question: t('faq:dhl1Q'),
          answer: t('faq:dhl1A')
        },
        {
          question: t('faq:dhl2Q'),
          answer: t('faq:dhl2A')
        },
        {
          question: t('faq:dhl3Q'),
          answer: t('faq:dhl3A')
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('faq:title')} | DHL Helper</title>
        <meta name="description" content={t('faq:description')} />
      </Helmet>
      
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('faq:title')}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('faq:subtitle')}
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem
                          key={itemIndex}
                          value={`${categoryIndex}-${itemIndex}`}
                          className="border-b last:border-b-0"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            <span className="font-medium">{item.question}</span>
                          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4">
            <div dangerouslySetInnerHTML={{ __html: item.answer }} />
          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Card className="bg-accent">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">{t('faq:stillNeedHelp')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('faq:contactPrompt')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:info@dhlhelper.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t('faq:emailSupport')}
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent rounded-md transition-colors"
                  >
                    {t('faq:contactForm')}
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default FAQ;