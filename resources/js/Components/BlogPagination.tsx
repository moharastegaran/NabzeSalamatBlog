import { Link } from '@inertiajs/react';
import type { PaginatedData } from '@/types/models';

function isPageNumber(label: string): boolean {
    return /^\d+$/.test(label.replace(/<[^>]*>/g, '').trim());
}

function formatLabel(label: string): string {
    const plain = label.replace(/<[^>]*>/g, '').trim();

    if (label === 'pagination.previous' || plain === 'Previous' || plain === 'قبلی') {
        return '&laquo; قبلی ';
    }

    if (label === 'pagination.next' || plain === 'Next' || plain === 'بعدی') {
        return '&raquo; بعدی';
    }

    return label;
}

type Props = {
    links: PaginatedData<unknown>['links'];
    className?: string;
};

export default function BlogPagination({ links, className = 'pt-10' }: Props) {
    const pageLinks = links.filter(l => isPageNumber(l.label));
    if (pageLinks.length <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-1 flex-wrap ${className}`}>
            {links.map((link, i) => {
                const html = formatLabel(link.label);
                const classes = `px-3 py-1.5 text-sm font-medium transition-colors ${
                    link.active
                        ? 'bg-[#F24F00] text-white'
                        : link.url
                          ? 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                          : 'text-gray-300 ring-1 ring-gray-100'
                }`;

                return link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={classes}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                ) : (
                    <span
                        key={i}
                        className={classes}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                );
            })}
        </div>
    );
}
