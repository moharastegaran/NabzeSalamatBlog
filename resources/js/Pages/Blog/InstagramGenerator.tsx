import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import logoWithText from '../../../images/logo.png';
import JSZip from 'jszip';
import {
    IG_POST_SIZE,
    IG_STORY_SIZE,
    canvasToBlob,
    downloadBlob,
    renderInstagramCanvas,
    slugifyFilename,
    type InstagramContent,
} from '@/utils/instagramCanvas';

type PostPayload = {
    id: number;
    title: string;
    subtitle?: string | null;
    excerpt?: string | null;
    /** First plain-text paragraph from post body */
    description?: string | null;
    slug: string;
    short_link?: string | null;
    featured_image?: string | null;
    category?: { id: number; name: string; slug: string } | null;
};

type Props = {
    post: PostPayload;
    defaults: {
        color: string;
        highlight_color: string;
        background_color: string;
        url: string;
        app_url: string;
    };
};

const ACCENT_PRESETS = ['#075F26', '#042F10', '#F24F00', '#1D4ED8', '#BE185D', '#0F766E'];
const HIGHLIGHT_PRESETS = ['#E8A88A', '#F24F00', '#FBBF24', '#86EFAC', '#93C5FD'];
const BG_PRESETS = ['#FFFFFF', '#F8F8F8', '#FFF7ED', '#F0FDF4', '#EFF6FF'];

export default function InstagramGenerator({ post, defaults }: Props) {
    const postCanvasRef = useRef<HTMLCanvasElement>(null);
    const storyCanvasRef = useRef<HTMLCanvasElement>(null);
    const renderToken = useRef(0);

    const featuredImageUrl = post.featured_image ? `/storage/${post.featured_image}` : null;

    const [title, setTitle] = useState(post.title ?? '');
    const [highlightedTitle, setHighlightedTitle] = useState('');
    const [description, setDescription] = useState(post.description || post.excerpt || '');
    const [highlightedDescription, setHighlightedDescription] = useState('به گزارش نبض سلامت');
    const [category, setCategory] = useState(post.category?.name ?? '');
    const [url, setUrl] = useState(defaults.url);
    const [color, setColor] = useState(defaults.color || '#075F26');
    const [highlightColor, setHighlightColor] = useState(defaults.highlight_color || '#E8A88A');
    const [backgroundColor, setBackgroundColor] = useState(defaults.background_color || '#FFFFFF');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [ready, setReady] = useState(false);

    const validation = useMemo(() => {
        const issues: string[] = [];
        if (!featuredImageUrl) issues.push('تصویر شاخص برای بخش پایین استوری الزامی است.');
        if (!title.trim()) issues.push('عنوان نمی‌تواند خالی باشد.');
        if (!url.trim()) issues.push('آدرس مطلب را وارد کنید.');
        return issues;
    }, [featuredImageUrl, title, url]);

    const content: InstagramContent = useMemo(
        () => ({
            title: title.trim(),
            highlightedTitle: highlightedTitle.trim(),
            description: description.trim(),
            highlightedDescription: highlightedDescription.trim(),
            category: category.trim(),
            url: url.trim(),
            appUrl: defaults.app_url || url.trim(),
            color: color || '#075F26',
            highlightColor: highlightColor || '#E8A88A',
            backgroundColor: backgroundColor || '#FFFFFF',
            featuredImageUrl,
            logoUrl: logoWithText,
        }),
        [
            title,
            highlightedTitle,
            description,
            highlightedDescription,
            category,
            url,
            defaults.app_url,
            color,
            highlightColor,
            backgroundColor,
            featuredImageUrl,
        ],
    );

    const redraw = useCallback(async () => {
        const token = ++renderToken.current;
        setError('');
        try {
            if (postCanvasRef.current) {
                await renderInstagramCanvas(postCanvasRef.current, 'post', content);
            }
            if (storyCanvasRef.current) {
                await renderInstagramCanvas(storyCanvasRef.current, 'story', content);
            }
            if (token === renderToken.current) setReady(true);
        } catch (e) {
            if (token === renderToken.current) {
                setReady(false);
                setError(e instanceof Error ? e.message : 'خطا در ساخت پیش‌نمایش');
            }
        }
    }, [content]);

    useEffect(() => {
        const t = window.setTimeout(() => {
            void redraw();
        }, 180);
        return () => window.clearTimeout(t);
    }, [redraw]);

    const baseName = slugifyFilename(title || post.slug || `post-${post.id}`);

    const downloadOne = async (format: 'post' | 'story') => {
        if (validation.length) {
            setError(validation[0]);
            return;
        }
        setBusy(true);
        setError('');
        try {
            await redraw();
            const canvas = format === 'post' ? postCanvasRef.current : storyCanvasRef.current;
            if (!canvas) throw new Error('Canvas آماده نیست');
            const blob = await canvasToBlob(canvas);
            downloadBlob(blob, `${baseName}-instagram-${format}.png`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'دانلود ناموفق بود');
        } finally {
            setBusy(false);
        }
    };

    const downloadZip = async () => {
        if (validation.length) {
            setError(validation[0]);
            return;
        }
        setBusy(true);
        setError('');
        try {
            await redraw();
            if (!postCanvasRef.current || !storyCanvasRef.current) {
                throw new Error('Canvas آماده نیست');
            }
            const [postBlob, storyBlob] = await Promise.all([
                canvasToBlob(postCanvasRef.current),
                canvasToBlob(storyCanvasRef.current),
            ]);
            const zip = new JSZip();
            zip.file(`${baseName}-instagram-post.png`, postBlob);
            zip.file(`${baseName}-instagram-story.png`, storyBlob);
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            downloadBlob(zipBlob, `${baseName}-instagram.zip`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'ساخت فایل ZIP ناموفق بود');
        } finally {
            setBusy(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-gray-800">
                            تولید محتوای اینستاگرام
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{post.title}</p>
                    </div>
                    <Link
                        href={route('blog.index')}
                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        بازگشت به لیست
                    </Link>
                </div>
            }
        >
            <Head title={`اینستاگرام — ${post.title}`} />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 space-y-5">
                    {(validation.length > 0 || error) && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            {error || validation.join(' ')}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[400px_1fr]">
                        <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
                            <h3 className="text-sm font-bold text-gray-900">محتوا و تنظیمات</h3>

                            <Field label="عنوان">
                                <textarea
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-md border-gray-200 text-sm"
                                    dir="rtl"
                                />
                            </Field>

                            <Field
                                label="عبارت برجسته در عنوان"
                                hint="در استوری: رنگ سبز متن. در پست: جعبه نارنجی. چند بخش را با | جدا کنید"
                            >
                                <input
                                    value={highlightedTitle}
                                    onChange={(e) => setHighlightedTitle(e.target.value)}
                                    className="w-full rounded-md border-gray-200 text-sm"
                                    dir="rtl"
                                    placeholder="مثلاً: ورود|دیوان محاسبات"
                                />
                            </Field>

                            <Field label="توضیحات">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border-gray-200 text-sm"
                                    dir="rtl"
                                />
                            </Field>

                            <Field
                                label="عبارت برجسته در توضیحات"
                                hint="بخشی از توضیحات با رنگ هایلایت (مثلاً «به گزارش نبض سلامت»)"
                            >
                                <input
                                    value={highlightedDescription}
                                    onChange={(e) => setHighlightedDescription(e.target.value)}
                                    className="w-full rounded-md border-gray-200 text-sm"
                                    dir="rtl"
                                />
                            </Field>

                            <Field label="دسته‌بندی (آخرین دسته اختصاص‌یافته)">
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-md border-gray-200 text-sm"
                                    dir="rtl"
                                />
                            </Field>

                            <Field label="آدرس مطلب">
                                <input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full rounded-md border-gray-200 text-sm font-mono"
                                    dir="ltr"
                                />
                            </Field>

                            <ColorField
                                label="رنگ پس‌زمینه استوری"
                                value={backgroundColor}
                                onChange={setBackgroundColor}
                                presets={BG_PRESETS}
                            />

                            <ColorField
                                label="رنگ برند (عنوان برجسته، خط کنار متن، دکمه)"
                                value={color}
                                onChange={setColor}
                                presets={ACCENT_PRESETS}
                            />

                            <ColorField
                                label="رنگ هایلایت توضیحات"
                                value={highlightColor}
                                onChange={setHighlightColor}
                                presets={HIGHLIGHT_PRESETS}
                            />

                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    disabled={busy || validation.length > 0}
                                    onClick={() => void downloadOne('post')}
                                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#F24F00] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#d44400] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    دانلود پست (۱۰۸۰×۱۴۴۰)
                                </button>
                                <button
                                    type="button"
                                    disabled={busy || validation.length > 0}
                                    onClick={() => void downloadOne('story')}
                                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#075F26] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#054a1d] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    دانلود استوری (۱۰۸۰×۱۹۲۰)
                                </button>
                                <button
                                    type="button"
                                    disabled={busy || validation.length > 0}
                                    onClick={() => void downloadZip()}
                                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    دانلود هر دو (ZIP)
                                </button>
                                <p className="text-[11px] text-gray-400">
                                    استوری با قالب ادیتوریال سفید — دکمه «مشاهده کامل خبر» روی تصویر.
                                    {ready ? ' پیش‌نمایش آماده است.' : ''}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <PreviewCard title="پست اینستاگرام" subtitle="۱۰۸۰ × ۱۴۴۰">
                                    <canvas
                                        ref={postCanvasRef}
                                        width={IG_POST_SIZE.width}
                                        height={IG_POST_SIZE.height}
                                        className="mx-auto h-auto w-full max-w-[320px] rounded-lg bg-white shadow-md ring-1 ring-black/5"
                                    />
                                </PreviewCard>

                                <PreviewCard title="استوری اینستاگرام" subtitle="۱۰۸۰ × ۱۹۲۰">
                                    <canvas
                                        ref={storyCanvasRef}
                                        width={IG_STORY_SIZE.width}
                                        height={IG_STORY_SIZE.height}
                                        className="mx-auto h-auto w-full max-w-[280px] rounded-lg bg-white shadow-md ring-1 ring-black/5"
                                    />
                                </PreviewCard>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-gray-700">{label}</span>
            {hint && <span className="block text-[11px] text-gray-400">{hint}</span>}
            {children}
        </label>
    );
}

function ColorField({
    label,
    value,
    onChange,
    presets,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    presets: string[];
}) {
    return (
        <Field label={label}>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-200 bg-white p-1"
                />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-md border-gray-200 text-sm font-mono uppercase"
                    dir="ltr"
                />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        title={preset}
                        onClick={() => onChange(preset)}
                        className={`h-7 w-7 rounded-full border-2 ${
                            value.toLowerCase() === preset.toLowerCase()
                                ? 'border-gray-900'
                                : 'border-white ring-1 ring-gray-200'
                        }`}
                        style={{ backgroundColor: preset }}
                    />
                ))}
            </div>
        </Field>
    );
}

function PreviewCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="mb-3 flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <span className="text-[11px] font-medium text-gray-400">{subtitle}</span>
            </div>
            <div className="flex justify-center overflow-hidden rounded-lg bg-gray-50 p-3">
                {children}
            </div>
        </div>
    );
}
