import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import type { FooterQuickLinksContent } from '@/types';

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

export default function FooterQuickLinksEdit({ page }: Props) {
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState<FooterQuickLinksContent>(page.content);
    const [processing, setProcessing] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('footer-quick-links.update'), {
            title,
            content: {
                section_title: content.section_title,
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
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">لینک‌ها</h3>
                            <button
                                type="button"
                                onClick={() => setContent(c => ({ ...c, links: [...c.links, { label: '', href: '' }] }))}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + افزودن لینک
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">هر مورد شامل برچسب و آدرس مقصد (href) است.</p>

                        {content.links.map((link, i) => (
                            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                                <div>
                                    <label className={labelClass}>برچسب *</label>
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={e => {
                                            const links = [...content.links];
                                            links[i] = { ...links[i], label: e.target.value };
                                            setContent(c => ({ ...c, links }));
                                        }}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>آدرس مقصد *</label>
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={link.href}
                                        onChange={e => {
                                            const links = [...content.links];
                                            links[i] = { ...links[i], href: e.target.value };
                                            setContent(c => ({ ...c, links }));
                                        }}
                                        className={inputClass}
                                        placeholder="https://example.com"
                                    />
                                </div>
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
                        ))}
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
