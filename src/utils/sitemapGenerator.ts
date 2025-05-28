
interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemap = (): string => {
  const baseUrl = "https://43a9f196-fcd9-4f8d-b60a-9c37d14325e5.lovableproject.com";
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/vocabulary`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/translator`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/tax-advisor`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/calculator`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/laws`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/shifts`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/vehicle`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/travel-planning`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/settings`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: `${baseUrl}/faq`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: `${baseUrl}/premium`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/pricing`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      loc: `${baseUrl}/cookies`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    }
  ];

  // Add law sub-pages
  const lawPages = [
    'minimum-wage', 'tax-classes', 'health-insurance', 'work-contract',
    'tax-return', 'pension-insurance', 'employee-protection', 'child-benefits',
    'working-hours', 'minimum-holidays', 'parental-allowance', 'legal-aid'
  ];

  lawPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}/laws/${page}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
};

export const downloadSitemap = (): void => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
