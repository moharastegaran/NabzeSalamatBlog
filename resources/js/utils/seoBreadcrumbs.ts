export type BreadcrumbItem = {
    name: string;
    url?: string | null;
};

/** Build schema.org BreadcrumbList JSON-LD from trail items (absolute or site-relative urls). */
export function breadcrumbJsonLd(
    items: BreadcrumbItem[],
    appUrl: string,
): Record<string, unknown> {
    const base = appUrl.replace(/\/$/, '');

    const absolutize = (pathOrUrl: string) => {
        if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
        return `${base}/${pathOrUrl.replace(/^\//, '')}`;
    };

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            ...(item.url ? { item: absolutize(item.url) } : {}),
        })),
    };
}
