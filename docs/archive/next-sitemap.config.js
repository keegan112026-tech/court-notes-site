/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://court-notes-site.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/demo',
          '/demo2',
          '/demo3',
          '/demo4',
          '/beautification-demo',
          '/sessions/history',
          '/sessions/history/v1',
          '/sessions/history/v2',
          '/sessions/history/v3',
          '/guide-prototype',
          '/project-intention-prototype',
          '/admin',
        ],
      },
    ],
  },
  additionalPaths: async () => [],
  transform: async (config, path) => {
    const noIndexPaths = [
      '/demo',
      '/demo2',
      '/demo3',
      '/demo4',
      '/beautification-demo',
      '/sessions/history',
      '/sessions/history/v1',
      '/sessions/history/v2',
      '/sessions/history/v3',
      '/guide-prototype',
      '/project-intention-prototype',
    ];

    if (noIndexPaths.some((p) => path === p || path.startsWith(p + '/'))) {
      return null; // 排除出 sitemap（等同 noindex 效果）
    }

    return {
      loc: path,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : path.startsWith('/sessions') ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
