/**
 * Site-wide publish settings used by the page builder and social meta tags.
 *
 * Before deployment:
 * 1. Set siteUrl to your live domain (or SITE_URL env var)
 * 2. Run: npm run build
 * 3. Upload the built root HTML + styles/ scripts/ images/ robots.txt sitemap.xml
 */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://texaxis.com',
  siteName: 'TEXAXIS (SMC-PRIVATE) LIMITED',
  locale: 'en_PK',
  twitterHandle: '', // e.g. '@texaxis' when available
};
