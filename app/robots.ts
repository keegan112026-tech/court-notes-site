import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/about',
                    '/guide',
                    '/knowledge',
                    '/sessions',
                    '/forum',
                    '/contact',
                    '/rankings',
                ],
                disallow: [
                    '/about-preview',
                    '/guide-prototype',
                    '/project-intention-prototype',
                    '/beautification-demo',
                    '/demo',
                    '/demo2',
                    '/demo3',
                    '/demo4',
                    '/sessions/history',
                ],
            },
        ],
        sitemap: 'https://court-notes-site.vercel.app/sitemap.xml',
    };
}
