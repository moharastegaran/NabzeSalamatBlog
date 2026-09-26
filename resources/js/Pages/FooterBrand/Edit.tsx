import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import type { FooterBrandContent } from '@/types';

interface Props {
    page: {
        title: string;
        content: FooterBrandContent;
    };
}

const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const sectionClass = 'space-y-4 bg-white rounded-xl shadow-sm p-6';

export default function FooterBrandEdit({ page }: Props) {
    const [title, setTitle] = useState(page.title);
    const [html, setHtml] = useState(page.content.html ?? '');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        router.put(route('footer-brand.update'), {
            title,
            content: { html },
        }, {
            preserveScroll: true,
            onError: (errors) => {
                setError(errors['content.html'] ?? errors.title ?? 'ذخیره انجام نشد.');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش معرفی فوتر</h2>}>
            <Head title="معرفی فوتر" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <form onSubmit={submit} className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    <div className={sectionClass}>
                        <div>
                            <label className={labelClass}>عنوان صفحه (ادمین)</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
                        </div>
                        <p className="text-xs text-gray-500">
                            این متن زیر لوگو در فوتر سایت نمایش داده می‌شود. می‌توانید قالب‌بندی، لینک و تراز را از نوار ابزار تنظیم کنید.
                        </p>
                    </div>

                    <div className={sectionClass}>
                        <label className={labelClass}>متن معرفی</label>
                        <RichTextEditor
                            value={html}
                            onChange={setHtml}
                            placeholder="متن معرفی فوتر را بنویسید…"
                            minHeight={180}
                            maxHeight={360}
                            dir="rtl"
                            toolbar="simple"
                            imageResize={false}
                            showStats
                            showFullscreen={false}
                        />
                        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
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
