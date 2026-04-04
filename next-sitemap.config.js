/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://taxcalc-global.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  additionalPaths: async () => [
    { loc: '/in', priority: 0.9, changefreq: 'monthly' },
    { loc: '/us', priority: 0.9, changefreq: 'monthly' },
    { loc: '/uk', priority: 0.9, changefreq: 'monthly' },
    { loc: '/compare', priority: 0.8, changefreq: 'monthly' },
  ],
};
