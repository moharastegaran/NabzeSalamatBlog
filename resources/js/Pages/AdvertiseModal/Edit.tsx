import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type AdvertiseContent = {
    title: string;
    subtitle: string;
    descriptions: string[];
    features: string[];
    hint: string;
    primary_button: { label: string; url: string };
    secondary_button: { label: string; url: string | null };
};

interface Props {
    page: {
        title: string;
        content: AdvertiseContent;
    };
}

const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const sectionClass = 'space-y-4 bg-white rounded-xl shadow-sm p-6';

function Field({
    label,
    value,
    onChange,
    textarea = false,
    rows = 3,
    dir,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    textarea?: boolean;
    rows?: number;
    dir?: 'ltr' | 'rtl';
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    rows={rows}
                    dir={dir}
                    className={inputClass}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    dir={dir}
                    className={inputClass}
                />
            )}
        </div>
    );
}

function StringList({
    title,
    items,
    onChange,
    textarea = false,
}: {
    title: string;
    items: string[];
    onChange: (items: string[]) => void;
    textarea?: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
                <button
                    type="button"
                    onClick={() => onChange([...items, ''])}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                    + افزودن
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    {textarea ? (
                        <textarea
                            value={item}
                            onChange={e => {
                                const next = [...items];
                                next[i] = e.target.value;
                                onChange(next);
                            }}
                            rows={3}
                            className={inputClass}
                        />
                    ) : (
                        <input
                            type="text"
                            value={item}
                            onChange={e => {
                                const next = [...items];
                                next[i] = e.target.value;
                                onChange(next);
                            }}
                            className={inputClass}
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                        disabled={items.length <= 1}
                        className="self-start rounded-md border border-gray-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                    >
                        حذف
                    </button>
                </div>
            ))}
        </div>
    );
}

export default function AdvertiseModalEdit({ page }: Props) {
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState<AdvertiseContent>(page.content);
    const [processing, setProcessing] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('advertise-modal.update'), { title, content }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش مودال آگهی</h2>}>
            <Head title="ویرایش مودال آگهی" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <form onSubmit={submit} className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    <div className={sectionClass}>
                        <Field label="عنوان صفحه (ادمین)" value={title} onChange={setTitle} />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">محتوای مودال</h3>
                        <Field
                            label="عنوان"
                            value={content.title}
                            onChange={v => setContent(c => ({ ...c, title: v }))}
                        />
                        <Field
                            label="زیرعنوان"
                            value={content.subtitle}
                            onChange={v => setContent(c => ({ ...c, subtitle: v }))}
                        />
                        <StringList
                            title="توضیحات"
                            items={content.descriptions}
                            textarea
                            onChange={descriptions => setContent(c => ({ ...c, descriptions }))}
                        />
                        <StringList
                            title="لیست امکانات / خدمات"
                            items={content.features}
                            onChange={features => setContent(c => ({ ...c, features }))}
                        />
                        <Field
                            label="نکته / راهنما"
                            value={content.hint}
                            onChange={v => setContent(c => ({ ...c, hint: v }))}
                            textarea
                        />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">دکمه اصلی</h3>
                        <Field
                            label="متن دکمه"
                            value={content.primary_button.label}
                            onChange={v => setContent(c => ({
                                ...c,
                                primary_button: { ...c.primary_button, label: v },
                            }))}
                        />
                        <Field
                            label="لینک دکمه"
                            value={content.primary_button.url}
                            onChange={v => setContent(c => ({
                                ...c,
                                primary_button: { ...c.primary_button, url: v },
                            }))}
                            dir="ltr"
                        />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">دکمه فرعی</h3>
                        <Field
                            label="متن دکمه"
                            value={content.secondary_button.label}
                            onChange={v => setContent(c => ({
                                ...c,
                                secondary_button: { ...c.secondary_button, label: v },
                            }))}
                        />
                        <Field
                            label="لینک دکمه (خالی = فقط بستن مودال)"
                            value={content.secondary_button.url ?? ''}
                            onChange={v => setContent(c => ({
                                ...c,
                                secondary_button: { ...c.secondary_button, url: v || null },
                            }))}
                            dir="ltr"
                        />
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
