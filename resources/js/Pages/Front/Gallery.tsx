import { useMemo, useState } from 'react';
import BlogLayout from '@/Layouts/BlogLayout';
import SeoHead from '@/Components/SeoHead';
import type { GalleryItem } from '@/types/models';

const PERSIAN_MONTHS = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

const EVENT_LABELS: Record<string, string> = {
    seminar: 'سمینار',
    exhibition: 'نمایشگاه',
};

type Filter = 'all' | 'seminar' | 'exhibition';

interface Props {
    items: GalleryItem[];
}

function itemAlt(item: GalleryItem): string {
    const event = EVENT_LABELS[item.event] ?? 'رویداد';
    const city = item.city?.name ? ` — ${item.city.name}` : '';
    const month = PERSIAN_MONTHS[(item.month || 1) - 1] ?? '';
    return `${event}${city}، ${month} ${item.year}`;
}

function itemSrc(item: GalleryItem): string {
    if (!item.img) return '';
    if (item.img.startsWith('http') || item.img.startsWith('/')) return item.img;
    return `/storage/${item.img}`;
}

export default function Gallery({ items }: Props) {
    const [filter, setFilter] = useState<Filter>('all');
    const [active, setActive] = useState<GalleryItem | null>(null);

    const filtered = useMemo(
        () => (filter === 'all' ? items : items.filter(i => i.event === filter)),
        [items, filter],
    );

    return (
        <BlogLayout>
            <SeoHead
                title="گالری تصاویر"
                description="گالری تصاویر سمینارها و نمایشگاه‌های پایگاه خبری نبض سلامت."
                url="/gallery"
                image={items[0] ? itemSrc(items[0]) : null}
            />

            <div className="border-b border-gray-100 bg-gradient-to-l from-[#042F10]/5 via-white to-[#F24F00]/5">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <span className="inline-block bg-[#F24F00] px-3 py-1 text-xs font-black uppercase tracking-widest text-white mb-4">
                        آرشیو تصویری
                    </span>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
                        گالری تصاویر
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                        تصاویر منتخب از سمینارها و نمایشگاه‌های حوزه سلامت.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="فیلتر نوع رویداد">
                    {([
                        ['all', 'همه'],
                        ['seminar', 'سمینار'],
                        ['exhibition', 'نمایشگاه'],
                    ] as const).map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={filter === key}
                            onClick={() => setFilter(key)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                filter === key
                                    ? 'bg-[#075F26] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                    <span className="mr-auto text-xs text-gray-400">
                        {filtered.length.toLocaleString('fa-IR')} تصویر
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
                        <p className="text-sm text-gray-500">هنوز تصویری در این بخش ثبت نشده است.</p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {filtered.map(item => (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => setActive(item)}
                                    className="group relative block w-full overflow-hidden rounded-xl bg-gray-100 text-right ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-[#F24F00]"
                                >
                                    <img
                                        src={itemSrc(item)}
                                        alt={itemAlt(item)}
                                        loading="lazy"
                                        className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-white">
                                        <span className="block text-xs font-semibold">
                                            {EVENT_LABELS[item.event] ?? item.event}
                                            {item.city?.name ? ` · ${item.city.name}` : ''}
                                        </span>
                                        <span className="block text-[11px] text-white/80">
                                            {(PERSIAN_MONTHS[(item.month || 1) - 1] ?? '')} {item.year}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {active && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setActive(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={itemAlt(active)}
                >
                    <button
                        type="button"
                        onClick={() => setActive(null)}
                        className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                    >
                        بستن
                    </button>
                    <figure
                        className="max-h-[90vh] max-w-5xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={itemSrc(active)}
                            alt={itemAlt(active)}
                            className="max-h-[80vh] w-full rounded-lg object-contain"
                        />
                        <figcaption className="mt-3 text-center text-sm text-white/90">
                            {itemAlt(active)}
                        </figcaption>
                    </figure>
                </div>
            )}
        </BlogLayout>
    );
}
