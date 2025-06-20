
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/hooks/useLanguage';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('terms')} - PendlerApp</title>
        <meta 
          name="description" 
          content={t('termsIntro')}
        />
      </Helmet>
      
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">{t('termsTitle')}</h1>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">1. {t('terms.introTitle')}</h2>
              <p className="text-muted-foreground">{t('termsIntro')}</p>
              <p className="text-muted-foreground">{t('terms.agreement')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. {t('terms.registrationTitle')}</h2>
              <p className="text-muted-foreground">{t('terms.registrationDesc')}</p>
              <p className="text-muted-foreground">{t('terms.userResponsibility')}</p>
              <p className="text-muted-foreground">{t('terms.accountTermination')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. {t('terms.rightsTitle')}</h2>
              <p className="text-muted-foreground">{t('terms.userCommits')}</p>
              <ul className="list-disc pl-5 space-y-2 my-4 text-muted-foreground">
                <li>{t('terms.noHarm')}</li>
                <li>{t('terms.noIllegalContent')}</li>
                <li>{t('terms.noSpam')}</li>
                <li>{t('terms.noTampering')}</li>
                <li>{t('terms.noAutomation')}</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">4. {t('terms.liabilityTitle')}</h2>
              <p className="text-muted-foreground">{t('terms.informationNature')}</p>
              <p className="text-muted-foreground">{t('terms.userContentLiability')}</p>
              <p className="text-muted-foreground">{t('terms.thirdPartyLinks')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">5. {t('terms.availabilityTitle')}</h2>
              <p className="text-muted-foreground">{t('terms.noGuarantee')}</p>
              <p className="text-muted-foreground">{t('terms.serviceChanges')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">6. {t('terms.privacyTitle')}</h2>
              <p className="text-muted-foreground">{t('terms.privacyReference')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">7. {t('terms.finalTitle')}</h2>
              <p className="text-muted-foreground">{t('terms.czechLaw')}</p>
              <p className="text-muted-foreground">{t('terms.termsChanges')}</p>
              <p className="text-muted-foreground">{t('terms.effectiveDate')}</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
