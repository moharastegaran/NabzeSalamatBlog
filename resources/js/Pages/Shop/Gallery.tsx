import { Head } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';
import { GalleryItem } from '@/types/models';
import { useState } from 'react';
import galleryBG from '../../../images/gallery-bg.jpg';

const PERSIAN_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const EVENT_LABELS: Record<string, string> = { seminar: 'سمینار', exhibition: 'نمایشگاه' };
type Filter = 'all' | 'seminar' | 'exhibition';

interface Props {
    items: GalleryItem[];
    cartCount?: number;
}

export default function GalleryPage({ items, cartCount = 0 }: Props) {
    const [filter, setFilter] = useState<Filter>('all');
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

    const filtered = filter === 'all' ? items : items.filter(i => i.event === filter);

    return (
        <ShopLayout cartCount={cartCount}>
            <Head title="گالری تصاویر جی‌سان" />

            <img src={galleryBG} alt="گالری تصاویر جی‌سان" className="w-full object-cover lg:max-h-[70vh] -mt-[95px]"/>

            <div className="mx-auto max-w-shop min-h-screen space-y-8" dir="rtl">

                {/* ── Page header ── */}
                <h1 className="text-4xl mx-auto text-center font-bold text-[#1F0001]">گالری تصاویر</h1>


                {/* ── Filter tabs ── */}
                <div className="w-fit mx-auto flex items-center justify-center gap-2 rounded-full bg-[#F2F2F2] p-2">
                    {([['all', 'همه'], ['seminar', 'سمینارها'], ['exhibition', 'نمایشگاه‌ها']] as [Filter, string][]).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                                filter === key
                                    ? 'bg-[#B8181E] hover:bg-[#E31F25] text-white shadow-sm'
                                    : 'text-[#1F0001] hover:text-[#E31F25]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── Grid ── */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">تصویری برای نمایش وجود ندارد.</p>
                    </div>
                ) : (
                    <div className="columns-2 sm:columns-3 gap-5 space-y-5">
                        {filtered.map(item => (
                            <div
                                key={item.id}
                                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
                                onClick={() => setLightbox(item)}
                            >
                                <img
                                    src={`/storage/${item.img}`}
                                    alt={`${EVENT_LABELS[item.event]} — ${item.city?.name}`}
                                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-1">
                                    {/*<div className="flex items-center gap-1.5">*/}
                                    {/*    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${*/}
                                    {/*        item.event === 'seminar' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'*/}
                                    {/*    }`}>*/}
                                    {/*        {EVENT_LABELS[item.event]}*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    <p className="text-white text-sm font-medium truncate">{item.city?.name}</p>
                                    <p className="text-white/70 text-xs">{PERSIAN_MONTHS[item.month - 1]} {item.year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Lightbox ── */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div
                        className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={`/storage/${lightbox.img}`}
                            alt=""
                            className="w-full max-h-[80vh] object-contain bg-black"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 flex items-center justify-between" dir="rtl">
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                                    lightbox.event === 'seminar' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                                }`}>
                                    {EVENT_LABELS[lightbox.event]}
                                </span>
                                <span className="text-white text-sm">{lightbox.city?.name}</span>
                                <span className="text-white/60 text-xs">{PERSIAN_MONTHS[lightbox.month - 1]} {lightbox.year}</span>
                            </div>
                            <button
                                onClick={() => setLightbox(null)}
                                className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/40 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ShopLayout>
    );
}
