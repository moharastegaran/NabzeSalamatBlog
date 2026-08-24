import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import type { FooterQuickLink, FooterQuickLinksContent } from '@/types';

interface Props {
    page: {
        title: string;
        content: FooterQuickLinksContent;
    };
}

const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const sectionClass = 'space-y-4 bg-white rounded-xl shadow-sm p-6';

function moveLink(links: FooterQuickLink[], from: number, to: number): FooterQuickLink[] {
    if (to < 0 || to >= links.length || from === to) return links;
    const next = [...links];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

export default function FooterQuickLinksEdit({ page }: Props) {
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState<FooterQuickLinksContent>(page.content);
    const [processing, setProcessing] = useState(false);

    const updateLink = (index: number, patch: Partial<FooterQuickLink>) => {
        setContent(c => {
            const links = [...c.links];
            links[index] = { ...links[index], ...patch };
            return { ...c, links };
        });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('footer-quick-links.update'), {
            title,
            content: {
                section_title: content.section_title,
                // Array order is the display / sort order
                links: content.links.map(l => ({ label: l.label, href: l.href })),
            },
        }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش دسترسی سریع فوتر</h2>}>
            <Head title="دسترسی سریع فوتر" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <form onSubmit={submit} className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    <div className={sectionClass}>
                        <div>
                            <label className={labelClass}>عنوان صفحه (ادمین)</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>عنوان بخش در فوتر</label>
                            <input
                                type="text"
                                value={content.section_title}
                                onChange={e => setContent(c => ({ ...c, section_title: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className={sectionClass}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">لینک‌ها</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    ترتیب نمایش در فوتر همان ترتیب این لیست است. با دکمه‌های بالا / پایین جابه‌جا کنید.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setContent(c => ({ ...c, links: [...c.links, { label: '', href: '' }] }))}
                                className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + افزودن لینک
                            </button>
                        </div>

                        <div className="space-y-3">
                            {content.links.map((link, i) => (
                                <div key={i} className="rounded-lg border border-gray-200 p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-gray-100 px-2 text-xs font-bold text-gray-600">
                                                {i + 1}
                                            </span>
                                            <span className="text-xs text-gray-400">ترتیب نمایش</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                title="انتقال به بالا"
                                                disabled={i === 0}
                                                onClick={() => setContent(c => ({ ...c, links: moveLink(c.links, i, i - 1) }))}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                title="انتقال به پایین"
                                                disabled={i === content.links.length - 1}
                                                onClick={() => setContent(c => ({ ...c, links: moveLink(c.links, i, i + 1) }))}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setContent(c => ({
                                                    ...c,
                                                    links: c.links.filter((_, idx) => idx !== i),
                                                }))}
                                                disabled={content.links.length <= 1}
                                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>برچسب *</label>
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={e => updateLink(i, { label: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>آدرس مقصد *</label>
                                            <input
                                                type="text"
                                                dir="ltr"
                                                value={link.href}
                                                onChange={e => updateLink(i, { href: e.target.value })}
                                                className={inputClass}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-8">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
