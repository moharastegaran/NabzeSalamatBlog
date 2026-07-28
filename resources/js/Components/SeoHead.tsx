import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export type SeoHeadProps = {
    title: string;
    description?: string | null;
    image?: string | null;
    url?: string | null;
    type?: 'website' | 'article';
    publishedTime?: string | null;
    modifiedTime?: string | null;
    author?: string | null;
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function absolutize(pathOrUrl: string, appUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
        return pathOrUrl;
    }

    return `${appUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
}

function resolveImage(image: string | null | undefined, appUrl: string): string | null {
    if (!image) {
        return null;
    }

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    if (image.startsWith('/storage/') || image.startsWith('/')) {
        return absolutize(image, appUrl);
    }

    return absolutize(`/storage/${image}`, appUrl);
}

export default function SeoHead({
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
    jsonLd,
}: SeoHeadProps) {
    const { app } = usePage<PageProps>().props;
    const siteName = app?.name ?? 'نبض سلامت';
    const appUrl = app?.url ?? '';
    const locale = app?.locale ?? 'fa_IR';

    const canonical = url ? absolutize(url, appUrl) : (typeof window !== 'undefined' ? window.location.href : appUrl);
    const ogImage = resolveImage(image, appUrl);
    const metaDescription = (description ?? '').trim().slice(0, 320) || undefined;

    const jsonLdPayload = jsonLd
        ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        : [];

    return (
        <Head title={title}>
            {metaDescription && <meta head-key="description" name="description" content={metaDescription} />}
            {noindex
                ? <meta head-key="robots" name="robots" content="noindex, nofollow" />
                : <meta head-key="robots" name="robots" content="index, follow" />}

            <link head-key="canonical" rel="canonical" href={canonical} />

            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:site_name" property="og:site_name" content={siteName} />
            <meta head-key="og:locale" property="og:locale" content={locale} />
            <meta head-key="og:title" property="og:title" content={title} />
            {metaDescription && <meta head-key="og:description" property="og:description" content={metaDescription} />}
            <meta head-key="og:url" property="og:url" content={canonical} />
            {ogImage && <meta head-key="og:image" property="og:image" content={ogImage} />}

            <meta head-key="twitter:card" name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
            <meta head-key="twitter:title" name="twitter:title" content={title} />
            {metaDescription && <meta head-key="twitter:description" name="twitter:description" content={metaDescription} />}
            {ogImage && <meta head-key="twitter:image" name="twitter:image" content={ogImage} />}

            {type === 'article' && publishedTime && (
                <meta head-key="article:published_time" property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta head-key="article:modified_time" property="article:modified_time" content={modifiedTime} />
            )}
            {type === 'article' && author && (
                <meta head-key="article:author" property="article:author" content={author} />
            )}

            {jsonLdPayload.map((item, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                />
            ))}
        </Head>
    );
}
