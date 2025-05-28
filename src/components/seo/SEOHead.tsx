
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'service';
  ogImage?: string;
  structuredData?: object;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage,
  structuredData,
  breadcrumbs
}) => {
  const baseUrl = "https://43a9f196-fcd9-4f8d-b60a-9c37d14325e5.lovableproject.com";
  const defaultImage = `${baseUrl}/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png`;
  
  const fullTitle = title 
    ? `${title} | Pendlerův Pomocník`
    : "Pendlerův Pomocník - Komplexní průvodce pro pracovníky v Německu";
  
  const fullDescription = description || 
    "Kompletní průvodce pro Čechy pracující v Německu. Výuka němčiny, kalkulačky mezd, správa směn, vozidel a právní poradenství pro pendlery.";
  
  const fullCanonical = canonical || window.location.href;
  const fullImage = ogImage || defaultImage;

  // Generate breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:site_name" content="Pendlerův Pomocník" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Breadcrumb structured data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
