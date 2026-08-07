const fs = require('fs');
const path = require('path');
const config = require('./site-config');

const ROOT = path.join(__dirname, '..');
const PARTIALS = path.join(ROOT, 'partials');
const TEMPLATES = path.join(ROOT, 'templates');

const PAGES = [
  {
    file: 'index.html',
    active: 'home',
    title: 'TEXAXIS - Textile Processing Chemicals & Enzymes | Home',
    description:
      'TEXAXIS - Leading supplier of high-quality textile processing chemicals and enzymes in Pakistan. Serving Lahore, Faisalabad, and Karachi.',
    path: '/',
    ogType: 'website',
  },
  {
    file: 'aboutus.html',
    active: 'about',
    title: 'About Us - TEXAXIS | Textile Processing Chemicals',
    description:
      'Learn about TEXAXIS - Your trusted partner in textile processing chemicals and enzymes with 18+ years of industry experience.',
    path: '/aboutus.html',
    ogType: 'website',
  },
  {
    file: 'products.html',
    active: 'products',
    title: 'Products - TEXAXIS | Textile Processing Chemicals',
    description:
      'Explore TEXAXIS product range - High-quality textile processing chemicals, enzymes, and auxiliaries for the textile industry.',
    path: '/products.html',
    ogType: 'website',
  },
  {
    file: 'contact.html',
    active: 'contact',
    title: 'Contact Us - TEXAXIS | Get in Touch',
    description:
      'Contact TEXAXIS for textile processing chemicals and enzymes. Reach us in Lahore, Faisalabad, or Karachi.',
    path: '/contact.html',
    ogType: 'website',
    headerCtaHref: '#contactForm',
    headerCtaLabel: 'Enquire',
    ctaPrimaryHref: '#contactForm',
    ctaPrimaryLabel: 'Send a Message',
  },
];

// Default CTAs for non-contact pages
PAGES.forEach((page) => {
  if (page.active === 'contact') return;
  page.headerCtaHref = page.headerCtaHref || 'contact.html#contactForm';
  page.headerCtaLabel = page.headerCtaLabel || 'Enquire';
  page.ctaPrimaryHref = page.ctaPrimaryHref || 'contact.html#contactForm';
  page.ctaPrimaryLabel = page.ctaPrimaryLabel || 'Enquire';
});

function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS, name), 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';
}

function applyVars(html, vars) {
  let out = html;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  return out;
}

function navVars(active, page) {
  const on = (name) => (active === name ? ' active' : '');
  return {
    ACTIVE_HOME: on('home'),
    ACTIVE_ABOUT: on('about'),
    ACTIVE_PRODUCTS: on('products'),
    ACTIVE_CONTACT: on('contact'),
    HEADER_CTA_HREF: page.headerCtaHref || 'contact.html#contactForm',
    HEADER_CTA_LABEL: page.headerCtaLabel || 'Enquire',
    CTA_PRIMARY_HREF: page.ctaPrimaryHref || 'contact.html#contactForm',
    CTA_PRIMARY_LABEL: page.ctaPrimaryLabel || 'Enquire',
  };
}

function jsonLd(page) {
  const base = config.siteUrl.replace(/\/$/, '');
  const organizationId = `${base}/#organization`;
  const localId = `${base}/#localbusiness`;
  const websiteId = `${base}/#website`;

  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: config.siteName,
      alternateName: 'TEXAXIS',
      url: `${base}/`,
      logo: `${base}/images/texaxis.png`,
      image: `${base}/images/og-image.jpg`,
      description:
        'Supplier of textile processing chemicals and enzymes in Pakistan, with head office in Lahore and coverage in Faisalabad and Karachi.',
      email: 'info@texaxis.com',
      telephone: '+92-333-4374264',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Office No. 12, 1st Floor, Ahmad Arcade Civic Center, Mustafa Town',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      areaServed: [
        { '@type': 'City', name: 'Lahore' },
        { '@type': 'City', name: 'Faisalabad' },
        { '@type': 'City', name: 'Karachi' },
      ],
      sameAs: [
        'https://www.linkedin.com/company/texaxis-smc-private-limited/',
        'https://wa.me/923334374264',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+92-333-4374264',
          contactType: 'sales',
          areaServed: 'PK',
          availableLanguage: ['en', 'ur'],
        },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': localId,
      name: config.siteName,
      url: `${base}/`,
      image: `${base}/images/og-image.jpg`,
      telephone: '+92-333-4374264',
      email: 'info@texaxis.com',
      parentOrganization: { '@id': organizationId },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Office No. 12, 1st Floor, Ahmad Arcade Civic Center, Mustafa Town',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
    },
  ];

  if (page.active === 'home') {
    graph.push({
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${base}/`,
      name: 'TEXAXIS',
      publisher: { '@id': organizationId },
      inLanguage: 'en-PK',
    });
  }

  const payload = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  const body = JSON.stringify(payload, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');

  return `    <script type="application/ld+json">
${body}
    </script>
`;
}

function socialMeta(page) {
  const url = `${config.siteUrl.replace(/\/$/, '')}${page.path === '/' ? '/' : page.path}`;
  const image = `${config.siteUrl.replace(/\/$/, '')}/images/og-image.jpg`;
  const twitter = config.twitterHandle
    ? `    <meta name="twitter:site" content="${config.twitterHandle}">\n`
    : '';

  return `    <!-- Open Graph / social share -->
    <meta property="og:type" content="${page.ogType}">
    <meta property="og:site_name" content="${config.siteName}">
    <meta property="og:locale" content="${config.locale}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="TEXAXIS — Textile Processing Chemicals & Enzymes">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${image}">
${twitter}    <link rel="canonical" href="${url}">
    <link rel="apple-touch-icon" href="./images/apple-touch-icon.png">
    <meta name="theme-color" content="#0052cc">
${jsonLd(page)}`;
}

function expandIncludes(template, page) {
  const vars = navVars(page.active, page);
  const partials = {
    'top-bar': () => readPartial('top-bar.html'),
    header: () => applyVars(readPartial('header.html'), vars),
    'footer-cta': () => applyVars(readPartial('footer-cta.html'), vars),
    footer: () => readPartial('footer.html'),
    scripts: () => readPartial('scripts.html'),
    'social-meta': () => socialMeta(page),
    'theme-boot': () => readPartial('theme-boot.html'),
    'partners-strip': () => readPartial('partners-strip.html'),
  };

  return template.replace(/^[ \t]*<!--\s*include:([a-z0-9-]+)\s*-->[ \t]*$/gim, (match, name) => {
    const key = name.toLowerCase();
    if (!partials[key]) {
      throw new Error(`Unknown partial include: ${name} (in ${page.file})`);
    }
    return partials[key]().replace(/\s+$/, '');
  });
}

function ensureSocialSlot(html) {
  if (/<!--\s*include:social-meta\s*-->/i.test(html)) return html;
  return html.replace(/<\/title>\s*/i, (m) => `${m}    <!-- include:social-meta -->\n`);
}

function ensureThemeBoot(html) {
  if (/<!--\s*include:theme-boot\s*-->/i.test(html) || /texaxis-theme/.test(html)) {
    return html;
  }
  return html.replace(/<head>\s*/i, (m) => `${m}    <!-- include:theme-boot -->\n`);
}

function build() {
  if (!fs.existsSync(TEMPLATES)) {
    console.error('Missing templates/ folder. Run once after creating templates.');
    process.exit(1);
  }

  const baseUrl = config.siteUrl.replace(/\/$/, '');

  // Keep SEO files aligned with siteUrl
  fs.writeFileSync(
    path.join(ROOT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/aboutus.html</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/products.html</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact.html</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`,
    'utf8'
  );

  let built = 0;
  for (const page of PAGES) {
    const templatePath = path.join(TEMPLATES, page.file);
    if (!fs.existsSync(templatePath)) {
      console.error('Missing template:', templatePath);
      process.exit(1);
    }

    let template = fs.readFileSync(templatePath, 'utf8').replace(/\r\n/g, '\n');
    template = ensureThemeBoot(template);
    template = ensureSocialSlot(template);
    const output = expandIncludes(template, page);
    fs.writeFileSync(path.join(ROOT, page.file), output, 'utf8');
    built += 1;
    console.log(`Built ${page.file}`);
  }

  console.log(`\nDone — ${built} pages built from partials (siteUrl: ${config.siteUrl})`);
  console.log('Updated robots.txt and sitemap.xml');
}

build();
