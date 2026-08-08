import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import type { PageProps } from '@/types';

type StatItem = { value: string; label: string };
type ValueItem = { title: string; desc: string; icon: string };
type EditorialItem = { step: string; title: string; desc: string };

type AboutContent = {
    seo: { title: string; description: string };
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        cta_primary: string;
        cta_secondary: string;
    };
    stats: StatItem[];
    mission: { title: string; paragraphs: string[] };
    vision: { title: string; paragraphs: string[]; quote: string };
    policy: {
        section_title: string;
        intro_title: string;
        paragraphs: string[];
        duties_title: string;
        duties: string[];
    };
    values: { section_title: string; items: ValueItem[] };
    editorial: { section_title: string; items: EditorialItem[] };
    cta: {
        title: string;
        subtitle: string;
        cta_primary: string;
        cta_secondary: string;
    };
};

interface Props {
    page: {
        title: string;
        content: AboutContent;
    };
}

const VALUE_ICONS = [
    { value: 'integrity', label: 'صداقت علمی' },
    { value: 'accessibility', label: 'دسترس‌پذیری' },
    { value: 'independence', label: 'استقلال' },
    { value: 'freshness', label: 'به‌روز بودن' },
];

const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const sectionClass = 'space-y-4 bg-white rounded-xl shadow-sm p-6';

function Field({
    label,
    value,
    onChange,
    error,
    textarea = false,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    textarea?: boolean;
    rows?: number;
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    rows={rows}
                    className={inputClass}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={inputClass}
                />
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function ListEditor({
    title,
    items,
    onChange,
    blank,
    textarea = false,
}: {
    title: string;
    items: string[];
    onChange: (items: string[]) => void;
    blank: string;
    textarea?: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
                <button
                    type="button"
                    onClick={() => onChange([...items, blank])}
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
                        className="rounded-md border border-gray-300 px-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 self-start"
                    >
                        حذف
                    </button>
                </div>
            ))}
        </div>
    );
}

export default function AboutPageEdit({ page }: Props) {
    usePage<PageProps>();
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState<AboutContent>(page.content);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const set = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('about-page.update'), { title, content }, {
            preserveScroll: true,
            onError: errs => {
                setErrors(errs);
                setProcessing(false);
            },
            onSuccess: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش صفحه درباره ما</h2>}>
            <Head title="ویرایش درباره ما" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <form onSubmit={submit} className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <div className={sectionClass}>
                        <Field label="عنوان صفحه (ادمین)" value={title} onChange={setTitle} error={errors.title} />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">سئو</h3>
                        <Field
                            label="عنوان سئو"
                            value={content.seo.title}
                            onChange={v => set('seo', { ...content.seo, title: v })}
                            error={errors['content.seo.title']}
                        />
                        <Field
                            label="توضیحات سئو"
                            value={content.seo.description}
                            onChange={v => set('seo', { ...content.seo, description: v })}
                            error={errors['content.seo.description']}
                            textarea
                        />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">هیرو</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="برچسب" value={content.hero.badge} onChange={v => set('hero', { ...content.hero, badge: v })} />
                            <Field label="عنوان" value={content.hero.title} onChange={v => set('hero', { ...content.hero, title: v })} />
                        </div>
                        <Field label="زیرعنوان" value={content.hero.subtitle} onChange={v => set('hero', { ...content.hero, subtitle: v })} textarea />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="دکمه اصلی" value={content.hero.cta_primary} onChange={v => set('hero', { ...content.hero, cta_primary: v })} />
                            <Field label="دکمه فرعی" value={content.hero.cta_secondary} onChange={v => set('hero', { ...content.hero, cta_secondary: v })} />
                        </div>
                    </div>

                    <div className={sectionClass}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">آمارها</h3>
                            <button
                                type="button"
                                onClick={() => set('stats', [...content.stats, { value: '', label: '' }])}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + افزودن آمار
                            </button>
                        </div>
                        {content.stats.map((stat, i) => (
                            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                                <Field
                                    label="مقدار"
                                    value={stat.value}
                                    onChange={v => {
                                        const next = [...content.stats];
                                        next[i] = { ...next[i], value: v };
                                        set('stats', next);
                                    }}
                                />
                                <Field
                                    label="برچسب"
                                    value={stat.label}
                                    onChange={v => {
                                        const next = [...content.stats];
                                        next[i] = { ...next[i], label: v };
                                        set('stats', next);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => set('stats', content.stats.filter((_, idx) => idx !== i))}
                                    disabled={content.stats.length <= 1}
                                    className="self-end rounded-md border border-gray-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                                >
                                    حذف
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">ماموریت</h3>
                        <Field
                            label="عنوان بخش"
                            value={content.mission.title}
                            onChange={v => set('mission', { ...content.mission, title: v })}
                        />
                        <ListEditor
                            title="پاراگراف‌ها"
                            items={content.mission.paragraphs}
                            blank=""
                            textarea
                            onChange={paragraphs => set('mission', { ...content.mission, paragraphs })}
                        />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">چشم‌انداز</h3>
                        <Field
                            label="عنوان بخش"
                            value={content.vision.title}
                            onChange={v => set('vision', { ...content.vision, title: v })}
                        />
                        <ListEditor
                            title="پاراگراف‌ها"
                            items={content.vision.paragraphs}
                            blank=""
                            textarea
                            onChange={paragraphs => set('vision', { ...content.vision, paragraphs })}
                        />
                        <Field
                            label="نقل‌قول"
                            value={content.vision.quote}
                            onChange={v => set('vision', { ...content.vision, quote: v })}
                            textarea
                        />
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">شورای سیاست‌گذاری</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="عنوان بخش"
                                value={content.policy.section_title}
                                onChange={v => set('policy', { ...content.policy, section_title: v })}
                            />
                            <Field
                                label="عنوان معرفی"
                                value={content.policy.intro_title}
                                onChange={v => set('policy', { ...content.policy, intro_title: v })}
                            />
                        </div>
                        <ListEditor
                            title="پاراگراف‌های معرفی"
                            items={content.policy.paragraphs}
                            blank=""
                            textarea
                            onChange={paragraphs => set('policy', { ...content.policy, paragraphs })}
                        />
                        <Field
                            label="عنوان وظایف"
                            value={content.policy.duties_title}
                            onChange={v => set('policy', { ...content.policy, duties_title: v })}
                        />
                        <ListEditor
                            title="وظایف شورا"
                            items={content.policy.duties}
                            blank=""
                            onChange={duties => set('policy', { ...content.policy, duties })}
                        />
                    </div>

                    <div className={sectionClass}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">ارزش‌ها</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    set('values', {
                                        ...content.values,
                                        items: [...content.values.items, { title: '', desc: '', icon: 'integrity' }],
                                    })
                                }
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + افزودن ارزش
                            </button>
                        </div>
                        <Field
                            label="عنوان بخش"
                            value={content.values.section_title}
                            onChange={v => set('values', { ...content.values, section_title: v })}
                        />
                        {content.values.items.map((item, i) => (
                            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="عنوان"
                                        value={item.title}
                                        onChange={v => {
                                            const items = [...content.values.items];
                                            items[i] = { ...items[i], title: v };
                                            set('values', { ...content.values, items });
                                        }}
                                    />
                                    <div>
                                        <label className={labelClass}>آیکون</label>
                                        <select
                                            value={item.icon}
                                            onChange={e => {
                                                const items = [...content.values.items];
                                                items[i] = { ...items[i], icon: e.target.value };
                                                set('values', { ...content.values, items });
                                            }}
                                            className={inputClass}
                                        >
                                            {VALUE_ICONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <Field
                                    label="توضیح"
                                    value={item.desc}
                                    onChange={v => {
                                        const items = [...content.values.items];
                                        items[i] = { ...items[i], desc: v };
                                        set('values', { ...content.values, items });
                                    }}
                                    textarea
                                    rows={2}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        set('values', {
                                            ...content.values,
                                            items: content.values.items.filter((_, idx) => idx !== i),
                                        })
                                    }
                                    disabled={content.values.items.length <= 1}
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                                >
                                    حذف
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={sectionClass}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">اصول تحریریه</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    set('editorial', {
                                        ...content.editorial,
                                        items: [...content.editorial.items, { step: '', title: '', desc: '' }],
                                    })
                                }
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                + افزودن اصل
                            </button>
                        </div>
                        <Field
                            label="عنوان بخش"
                            value={content.editorial.section_title}
                            onChange={v => set('editorial', { ...content.editorial, section_title: v })}
                        />
                        {content.editorial.items.map((item, i) => (
                            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Field
                                        label="شماره"
                                        value={item.step}
                                        onChange={v => {
                                            const items = [...content.editorial.items];
                                            items[i] = { ...items[i], step: v };
                                            set('editorial', { ...content.editorial, items });
                                        }}
                                    />
                                    <div className="sm:col-span-2">
                                        <Field
                                            label="عنوان"
                                            value={item.title}
                                            onChange={v => {
                                                const items = [...content.editorial.items];
                                                items[i] = { ...items[i], title: v };
                                                set('editorial', { ...content.editorial, items });
                                            }}
                                        />
                                    </div>
                                </div>
                                <Field
                                    label="توضیح"
                                    value={item.desc}
                                    onChange={v => {
                                        const items = [...content.editorial.items];
                                        items[i] = { ...items[i], desc: v };
                                        set('editorial', { ...content.editorial, items });
                                    }}
                                    textarea
                                    rows={2}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        set('editorial', {
                                            ...content.editorial,
                                            items: content.editorial.items.filter((_, idx) => idx !== i),
                                        })
                                    }
                                    disabled={content.editorial.items.length <= 1}
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                                >
                                    حذف
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-base font-bold text-gray-900">فراخوان اقدام (CTA)</h3>
                        <Field label="عنوان" value={content.cta.title} onChange={v => set('cta', { ...content.cta, title: v })} />
                        <Field label="زیرعنوان" value={content.cta.subtitle} onChange={v => set('cta', { ...content.cta, subtitle: v })} textarea />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="دکمه اصلی" value={content.cta.cta_primary} onChange={v => set('cta', { ...content.cta, cta_primary: v })} />
                            <Field label="دکمه فرعی" value={content.cta.cta_secondary} onChange={v => set('cta', { ...content.cta, cta_secondary: v })} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-8">
                        <a
                            href={route('front.about-us')}
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
