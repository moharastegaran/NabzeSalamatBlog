import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import AssetPicker from '@/Components/AssetPicker';
import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import TagMultiSelect from '@/Components/TagMultiSelect';
import type { Asset, BlogCategory, BlogTag } from '@/types/models';
import type { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import PersianDateTimePicker from '@/Components/PersianDateTimePicker';
import { localDateTimeStr } from '@/utils/date';
import { hasRole } from '@/utils/roles';

const EXCERPT_MAX = 500;

interface Props {
    categories: Pick<BlogCategory, 'id' | 'name' | 'parent_id' | 'broadcast_to_bale'>[];
    tags: Pick<BlogTag, 'id' | 'name'>[];
}

interface FormData {
    title: string;
    subtitle: string;
    excerpt: string;
    meta_title: string;
    meta_description: string;
    body: string;
    status: 'draft' | 'scheduled' | 'published';
    publish_at: string;
    category_ids: number[];
    tag_ids: number[];
    featured_image: string | null;
}

const META_TITLE_MAX = 255;
const META_DESC_MAX = 320;

interface BalePreviewState {
    postId: number;
    title: string;
    message: string;
}

export default function BlogCreate({ categories, tags }: Props) {
    const { auth, flash } = usePage<PageProps>().props;
    const canUpload = hasRole(auth.user?.roles, 'admin');
    const canCreateTags = auth.user?.permissions?.includes('tags.create') ?? false;

    const [form, setForm] = useState<FormData>({
        title: '',
        subtitle: '',
        excerpt: '',
        meta_title: '',
        meta_description: '',
        body: '',
        status: 'draft',
        publish_at: '',
        category_ids: [],
        tag_ids: [],
        featured_image: null,
    });
    const [errors, setErrors]       = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [balePreview, setBalePreview] = useState<BalePreviewState | null>(null);
    const [baleMessage, setBaleMessage] = useState('');
    const [baleSending, setBaleSending] = useState(false);
    const [baleError, setBaleError] = useState('');

    useEffect(() => {
        const preview = flash.bale_preview;
        if (!preview) return;

        setBalePreview({
            postId: preview.post_id,
            title: preview.title,
            message: preview.message,
        });
        setBaleMessage(preview.message);
        setBaleError('');
    }, [flash.bale_preview]);

    const willDeferBale =
        form.status === 'published'
        && form.category_ids.some(id => categories.find(c => c.id === id)?.broadcast_to_bale);

    const handleAssetSelect = (asset: Asset) => {
        setForm(p => ({ ...p, featured_image: asset.path }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const data = new FormData();
        data.append('title', form.title);
        data.append('subtitle', form.subtitle);
        data.append('excerpt', form.excerpt);
        data.append('meta_title', form.meta_title);
        data.append('meta_description', form.meta_description);
        data.append('body', form.body);
        data.append('status', form.status);
        if (form.status === 'scheduled' && form.publish_at) data.append('publish_at', form.publish_at);
        form.category_ids.forEach(id => data.append('category_ids[]', String(id)));
        form.tag_ids.forEach(id => data.append('tag_ids[]', String(id)));
        if (form.featured_image) data.append('featured_image', form.featured_image);

        router.post(route('blog.store'), data, {
            forceFormData: true,
            onError:   (errs) => { setErrors(errs); setProcessing(false); },
            onFinish:  () => setProcessing(false),
        });
    };

    const closeBalePreview = () => {
        setBalePreview(null);
        setBaleMessage('');
        setBaleError('');
        router.visit(route('blog.index'));
    };

    const sendBalePreview = () => {
        if (!balePreview) return;

        const message = baleMessage.trim();
        if (!message) {
            setBaleError('متن پیام نمی‌تواند خالی باشد.');
            return;
        }

        setBaleSending(true);
        setBaleError('');

        router.post(route('blog.broadcast-bale', balePreview.postId), { message }, {
            onError: (errs) => {
                setBaleError(errs.message || 'ارسال ناموفق بود.');
                setBaleSending(false);
            },
            onFinish: () => setBaleSending(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">مقاله جدید</h2>}>
            <Head title="مقاله جدید" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">

                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">روتیتر</label>
                            <textarea
                                value={form.subtitle}
                                onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                                rows={2}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.subtitle && <p className="mt-1 text-xs text-red-600">{errors.subtitle}</p>}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <div className="mb-1 flex items-center justify-between gap-3">
                                <label className="block text-sm font-medium text-gray-700">خلاصه</label>
                                <span
                                    className={`text-xs tabular-nums ${
                                        form.excerpt.length >= EXCERPT_MAX
                                            ? 'font-medium text-red-600'
                                            : form.excerpt.length >= EXCERPT_MAX * 0.9
                                              ? 'text-amber-600'
                                              : 'text-gray-400'
                                    }`}
                                >
                                    {form.excerpt.length.toLocaleString('fa-IR')} / {EXCERPT_MAX.toLocaleString('fa-IR')}
                                </span>
                            </div>
                            <textarea
                                value={form.excerpt}
                                onChange={e => setForm(p => ({ ...p, excerpt: e.target.value.slice(0, EXCERPT_MAX) }))}
                                rows={2}
                                maxLength={EXCERPT_MAX}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
                        </div>

                        {/* SEO */}
                        <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">سئو (اختیاری)</h3>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    در صورت خالی بودن، از عنوان و خلاصه مقاله استفاده می‌شود.
                                </p>
                            </div>
                            <div>
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <label className="block text-sm font-medium text-gray-700">عنوان متا</label>
                                    <span className={`text-xs tabular-nums ${form.meta_title.length >= META_TITLE_MAX ? 'text-red-600' : 'text-gray-400'}`}>
                                        {form.meta_title.length.toLocaleString('fa-IR')} / {META_TITLE_MAX.toLocaleString('fa-IR')}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={form.meta_title}
                                    onChange={e => setForm(p => ({ ...p, meta_title: e.target.value.slice(0, META_TITLE_MAX) }))}
                                    maxLength={META_TITLE_MAX}
                                    placeholder={form.title || 'عنوان نمایش‌داده‌شده در نتایج جستجو'}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                {errors.meta_title && <p className="mt-1 text-xs text-red-600">{errors.meta_title}</p>}
                            </div>
                            <div>
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <label className="block text-sm font-medium text-gray-700">توضیحات متا</label>
                                    <span className={`text-xs tabular-nums ${form.meta_description.length >= META_DESC_MAX ? 'text-red-600' : 'text-gray-400'}`}>
                                        {form.meta_description.length.toLocaleString('fa-IR')} / {META_DESC_MAX.toLocaleString('fa-IR')}
                                    </span>
                                </div>
                                <textarea
                                    value={form.meta_description}
                                    onChange={e => setForm(p => ({ ...p, meta_description: e.target.value.slice(0, META_DESC_MAX) }))}
                                    rows={2}
                                    maxLength={META_DESC_MAX}
                                    placeholder={form.excerpt || 'توضیح کوتاه برای موتورهای جستجو'}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                {errors.meta_description && <p className="mt-1 text-xs text-red-600">{errors.meta_description}</p>}
                            </div>
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">محتوا <span className="text-red-500">*</span></label>
                            <RichTextEditor
                                value={form.body}
                                onChange={html => setForm(p => ({ ...p, body: html }))}
                                placeholder="متن مقاله را بنویسید…"
                                minHeight={360}
                                dir="rtl"
                                imageResize
                                showStats
                                showFullscreen
                                assetPicker={{ canUpload, forVideo: true }}
                            />
                            {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی‌ها</label>
                            <CategoryMultiSelect
                                categories={categories}
                                selected={form.category_ids}
                                onChange={ids => setForm(p => ({ ...p, category_ids: ids }))}
                                error={errors.category_ids}
                            />
                            {willDeferBale && (
                                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                                    پس از انتشار، پیش‌نمایش پیام بله نمایش داده می‌شود تا قبل از ارسال آن را ویرایش کنید.
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <div className="relative">
                                <select
                                    value={form.status}
                                    onChange={e => {
                                        const status = e.target.value as 'draft' | 'scheduled' | 'published';
                                        setForm(p => ({ ...p, status, publish_at: status !== 'scheduled' ? '' : (p.publish_at || localDateTimeStr()) }));
                                    }}
                                    className="w-full appearance-none rounded-md border border-gray-300 pr-3 pl-8 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    style={{ background: 'none' }}
                                >
                                    <option value="draft">پیش‌نویس</option>
                                    <option value="scheduled">زمان‌بندی شده</option>
                                    <option value="published">منتشر شده</option>
                                </select>
                                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {form.status === 'scheduled' && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">زمان انتشار <span className="text-red-500">*</span></label>
                                    <PersianDateTimePicker
                                        value={form.publish_at}
                                        onChange={v => setForm(p => ({ ...p, publish_at: v }))}
                                        minDateTime={localDateTimeStr()}
                                        error={errors.publish_at}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Featured image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">تصویر شاخص</label>

                            {form.featured_image ? (
                                <div className="mb-3 flex items-start gap-3">
                                    <img
                                        src={`/storage/${form.featured_image}`}
                                        alt=""
                                        className="h-24 w-36 rounded-lg object-cover ring-1 ring-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, featured_image: null }))}
                                        className="mt-1 text-xs text-red-600 hover:text-red-700"
                                    >
                                        حذف تصویر
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-3 flex h-24 w-36 items-center justify-center rounded-lg bg-gray-50 ring-1 ring-dashed ring-gray-200">
                                    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setPickerOpen(true)}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {form.featured_image ? 'تغییر تصویر' : 'انتخاب از کتابخانه'}
                            </button>

                            {errors.featured_image && <p className="mt-1 text-xs text-red-600">{errors.featured_image}</p>}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">برچسب‌ها</label>
                            <TagMultiSelect
                                tags={tags}
                                selected={form.tag_ids}
                                onChange={ids => setForm(p => ({ ...p, tag_ids: ids }))}
                                canCreate={canCreateTags}
                                error={errors.tag_ids}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <a href={route('blog.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                انصراف
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                            >
                                {processing ? 'در حال ذخیره...' : 'ذخیره مقاله'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <AssetPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleAssetSelect}
                accept="image"
                canUpload={canUpload}
            />

            {balePreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={closeBalePreview} />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="bale-preview-title"
                        className="relative w-full max-w-xl rounded-xl bg-white shadow-xl"
                    >
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h3 id="bale-preview-title" className="text-base font-bold text-gray-900">
                                پیش‌نمایش پیام بله
                            </h3>
                            <p className="mt-1 text-xs text-gray-500 line-clamp-1">{balePreview.title}</p>
                        </div>

                        <div className="px-5 py-4 space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                متن پیام (قابل ویرایش)
                            </label>
                            <textarea
                                value={baleMessage}
                                onChange={e => setBaleMessage(e.target.value)}
                                rows={14}
                                dir="rtl"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono leading-6 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-gray-500">
                                همین متن ویرایش‌شده به کانال بله ارسال می‌شود (نه نسخهٔ اولیهٔ تولیدشده).
                            </p>
                            {baleError && <p className="text-xs text-red-600">{baleError}</p>}
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                            <button
                                type="button"
                                onClick={closeBalePreview}
                                disabled={baleSending}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                                رد کردن / بعداً
                            </button>
                            <button
                                type="button"
                                onClick={sendBalePreview}
                                disabled={baleSending}
                                className="rounded-md bg-[#00A693] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f7e] disabled:opacity-60"
                            >
                                {baleSending ? 'در حال ارسال...' : 'تأیید و ارسال به بله'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
