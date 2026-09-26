import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type ContactInfoType = 'email' | 'whatsapp' | 'phone' | 'address' | 'telegram';
type ContactIcon = 'building' | 'phone' | 'whatsapp' | 'email' | 'telegram';

type ContactInfo = {
    type: ContactInfoType;
    label: string;
    value: string;
    description: string | null;
    icon: ContactIcon;
};

type ContactContent = {
    seo: { title: string; description: string };
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        cta_primary: string;
        cta_secondary: string;
    };
    contact_infos: ContactInfo[];
    editorial: { title: string; paragraphs: string[]; quote: string };
    form: { title: string };
};

interface Props {
    page: { title: string; content: ContactContent };
}

const TYPES: { value: ContactInfoType; label: string }[] = [
    { value: 'address', label: 'آدرس' },
    { value: 'phone', label: 'تلفن' },
    { value: 'whatsapp', label: 'واتساپ' },
    { value: 'telegram', label: 'تلگرام' },
    { value: 'email', label: 'ایمیل' },
];

const ICONS: { value: ContactIcon; label: string }[] = [
    { value: 'building', label: 'ساختمان' },
    { value: 'phone', label: 'تلفن' },
    { value: 'whatsapp', label: 'واتساپ' },
    { value: 'telegram', label: 'تلگرام' },
    { value: 'email', label: 'ایمیل' },
];

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
                <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} dir={dir} className={inputClass} />
            ) : (
                <input type="text" value={value} onChange={e => onChange(e.target.value)} dir={dir} className={inputClass} />
            )}
        </div>
    );
}

function blankInfo(): ContactInfo {
    return { type: 'phone', label: '', value: '', description: null, icon: 'phone' };
}

export default function ContactPageEdit({ page }: Props) {
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState<ContactContent>(page.content);
    const [processing, setProcessing] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('contact-page.update'), { title, content }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const updateInfo = (index: number, patch: Partial<ContactInfo>) => {
        setContent(c => {
            const contact_infos = [...c.contact_infos];
            contact_infos[index] = { ...contact_infos[index], ...patch };
            if (patch.type && !patch.icon) {
                contact_infos[index].icon = matchIcon(patch.type);
            }
            return { ...c, contact_infos };
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش صفحه تماس</h2>}>
            <Head title="ویرایش تماس با ما" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <form onSubmit={submit} className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <div className={sectionClass}>
                        <Field label="عنوان صفحه (ادمین)" value={title} onChange={setTitle} />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">سئو</h3>
                        <Field label="عنوان سئو" value={content.seo.title} onChange={v => setContent(c => ({ ...c, seo: { ...c.seo, title: v } }))} />
                        <Field label="توضیحات سئو" value={content.seo.description} onChange={v => setContent(c => ({ ...c, seo: { ...c.seo, description: v } }))} textarea />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">هیرو</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="برچسب" value={content.hero.badge} onChange={v => setContent(c => ({ ...c, hero: { ...c.hero, badge: v } }))} />
                            <Field label="عنوان" value={content.hero.title} onChange={v => setContent(c => ({ ...c, hero: { ...c.hero, title: v } }))} />
                        </div>
                        <Field label="زیرعنوان" value={content.hero.subtitle} onChange={v => setContent(c => ({ ...c, hero: { ...c.hero, subtitle: v } }))} textarea />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="دکمه اصلی" value={content.hero.cta_primary} onChange={v => setContent(c => ({ ...c, hero: { ...c.hero, cta_primary: v } }))} />
                            <Field label="دکمه فرعی" value={content.hero.cta_secondary} onChange={v => setContent(c => ({ ...c, hero: { ...c.hero, cta_secondary: v } }))} />
                        </div>
                    </div>

                    <div className={sectionClass}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">راه‌های ارتباطی (ContactInfo)</h3>
                            <button
                                type="button"
                                onClick={() => setContent(c => ({ ...c, contact_infos: [...c.contact_infos, blankInfo()] }))}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + افزودن
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            هر مورد شامل نوع، برچسب، مقدار، توضیح اختیاری و آیکون است. چند واتساپ با برچسب یکسان در یک کارت نمایش داده می‌شوند.
                        </p>
                        {content.contact_infos.map((info, i) => (
                            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>نوع *</label>
                                        <select
                                            value={info.type}
                                            onChange={e => updateInfo(i, { type: e.target.value as ContactInfoType })}
                                            className={inputClass}
                                        >
                                            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>آیکون</label>
                                        <select
                                            value={info.icon}
                                            onChange={e => updateInfo(i, { icon: e.target.value as ContactIcon })}
                                            className={inputClass}
                                        >
                                            {ICONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <Field label="برچسب *" value={info.label} onChange={v => updateInfo(i, { label: v })} />
                                <Field
                                    label="مقدار *"
                                    value={info.value}
                                    onChange={v => updateInfo(i, { value: v })}
                                    dir={info.type === 'email' || info.type === 'phone' || info.type === 'whatsapp' || info.type === 'telegram' ? 'ltr' : undefined}
                                />
                                <Field
                                    label="توضیح (اختیاری)"
                                    value={info.description ?? ''}
                                    onChange={v => updateInfo(i, { description: v || null })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setContent(c => ({
                                        ...c,
                                        contact_infos: c.contact_infos.filter((_, idx) => idx !== i),
                                    }))}
                                    disabled={content.contact_infos.length <= 1}
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                                >
                                    حذف
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">بخش تحریریه</h3>
                        <Field label="عنوان" value={content.editorial.title} onChange={v => setContent(c => ({ ...c, editorial: { ...c.editorial, title: v } }))} />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-800">پاراگراف‌ها</h4>
                                <button
                                    type="button"
                                    onClick={() => setContent(c => ({
                                        ...c,
                                        editorial: { ...c.editorial, paragraphs: [...c.editorial.paragraphs, ''] },
                                    }))}
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    + افزودن
                                </button>
                            </div>
                            {content.editorial.paragraphs.map((p, i) => (
                                <div key={i} className="flex gap-2">
                                    <textarea
                                        value={p}
                                        onChange={e => {
                                            const paragraphs = [...content.editorial.paragraphs];
                                            paragraphs[i] = e.target.value;
                                            setContent(c => ({ ...c, editorial: { ...c.editorial, paragraphs } }));
                                        }}
                                        rows={3}
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setContent(c => ({
                                            ...c,
                                            editorial: {
                                                ...c.editorial,
                                                paragraphs: c.editorial.paragraphs.filter((_, idx) => idx !== i),
                                            },
                                        }))}
                                        disabled={content.editorial.paragraphs.length <= 1}
                                        className="self-start rounded-md border border-gray-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Field label="نقل‌قول" value={content.editorial.quote} onChange={v => setContent(c => ({ ...c, editorial: { ...c.editorial, quote: v } }))} textarea />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">فرم تماس</h3>
                        <Field label="عنوان فرم" value={content.form.title} onChange={v => setContent(c => ({ ...c, form: { ...c.form, title: v } }))} />
                    </div>

                    <div className="flex justify-end gap-3 pb-8">
                        <a
                            href={route('front.contact')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            مشاهده صفحه
                        </a>
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

function matchIcon(type: ContactInfoType): ContactIcon {
    switch (type) {
        case 'address': return 'building';
        case 'phone': return 'phone';
        case 'whatsapp': return 'whatsapp';
        case 'telegram': return 'telegram';
        case 'email': return 'email';
    }
}
