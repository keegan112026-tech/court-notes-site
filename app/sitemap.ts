import type { MetadataRoute } from 'next';
import { getLocalSessionsIndex } from '@/lib/local-data';

const siteUrl = 'https://court-notes-site.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/about',
        '/guide',
        '/knowledge',
        '/sessions',
        '/sessions/compose',
        '/forum',
        '/contact',
        '/rankings',
    ].map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
    }));

    const sessionRoutes: MetadataRoute.Sitemap = getLocalSessionsIndex().map((session) => ({
        url: `${siteUrl}/sessions/${session.id}`,
        lastModified: new Date(session.date),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...sessionRoutes];
}
