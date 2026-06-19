import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import WysiwygEditor from '@/Components/WysiwygEditor';
import AssetPicker from '@/Components/AssetPicker';
import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import type { Asset, BlogCategory, BlogPost, BlogTag, PostMedia, CategoryFieldDefinition } from '@/types/models';
import type { PageProps } from '@/types';
import { useState, useRef } from 'react';
import React from 'react';

interface Props {
    post: BlogPost & { tags: BlogTag[] };
    categories: Pick<BlogCategory, 'id' | 'name' | 'parent_id'>[];
    tags: Pick<BlogTag, 'id' | 'name'>[];
    postMedia: Record<string, PostMedia[]>;
    fieldDefinitions: CategoryFieldDefinition[];
    mediaCollections: string[];
}

interface FormData {
    title: string;
    excerpt: string;
    body: string;
    status: 'draft' | 'published';
    category_ids: number[];
    tag_ids: number[];
    featured_image: string | null;
}

const COLLECTION_LABELS: Record<string, string> = {
    audio:      'صوتی',
    video:      'ویدیو',
    transcript: 'متنی / PDF',
    attachment: 'پیوست',
};

const COLLECTION_ICONS: Record<string, React.ReactNode> = {
    audio: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    ),
    video: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    transcript: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    attachment: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
    ),
};

function MediaCollection({
    postId,
    collection,
    label,
    isRequired,
    items,
}: {
    postId: number;
    collection: string;
    label: string;
    isRequired: boolean;
    items: PostMedia[];
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);

    const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('collection_name', collection);
        router.post(route('blog.media.store', postId), fd, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => { setUploading(false); if (fileRef.current) fileRef.current.value = ''; },
            onError: (errs) => { setUploading(false); setUploadError(errs.file ?? 'خطا در بارگذاری'); },
        });
    };

    const remove = (mediaId: number) => {
        if (!confirm('این فایل حذف شود؟')) return;
        router.delete(route('blog.media.destroy', [postId, mediaId]), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className={`rounded-lg border ${isRequired && items.length === 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'} p-4`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`${isRequired && items.length === 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {COLLECTION_ICONS[collection]}
                    </span>
                    <div>
                        <span className="text-sm font-semibold text-gray-800">{label}</span>
                        <span className="mr-2 text-xs text-gray-400">{COLLECTION_LABELS[collection] ?? collection}</span>
                    </div>
                    {isRequired && (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${items.length === 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                            {items.length === 0 ? '⚠ الزامی' : '✓ الزامی'}
                        </span>
                    )}
                </div>
            </div>

            {/* File list */}
            {items.length > 0 && (
                <div className="space-y-2 mb-3">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2 gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-gray-700 truncate">{item.file_name}</span>
                                <span className="flex-shrink-0 text-xs text-gray-400">{item.human_readable_size}</span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="دانلود"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => remove(item.id)}
                                    className="rounded p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="حذف"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload */}
            <div>
                <input ref={fileRef} type="file" className="sr-only" onChange={upload} />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                >
                    {uploading ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            در حال بارگذاری...
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            بارگذاری فایل
                        </>
                    )}
                </button>
                {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
            </div>
        </div>
    );
}

export default function BlogEdit({ post, categories, tags, postMedia, fieldDefinitions, mediaCollections }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canUpload = auth.user?.roles?.includes('admin') ?? false;

    const [form, setForm] = useState<FormData>({
        title: post.title,
        excerpt: post.excerpt ?? '',
        body: post.body,
        status: post.status,
        category_ids: post.categories?.map(c => c.id) ?? [],
        tag_ids: post.tags?.map(t => t.id) ?? [],
        featured_image: post.featured_image ?? null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);

    const toggleTag = (id: number) => {
        setForm(prev => ({
            ...prev,
            tag_ids: prev.tag_ids.includes(id)
                ? prev.tag_ids.filter(x => x !== id)
                : [...prev.tag_ids, id],
        }));
    };

    const handleAssetSelect = (asset: Asset) => {
        setForm(p => ({ ...p, featured_image: asset.path }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('title', form.title);
        data.append('excerpt', form.excerpt);
        data.append('body', form.body);
        data.append('status', form.status);
        form.category_ids.forEach(id => data.append('category_ids[]', String(id)));
        form.tag_ids.forEach(id => data.append('tag_ids[]', String(id)));
        data.append('featured_image', form.featured_image ?? '');

        router.post(route('blog.update', post.id), data, {
            forceFormData: true,
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش مقاله</h2>}>
            <Head title="ویرایش مقاله" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">خلاصه</label>
                            <textarea
                                value={form.excerpt}
                                onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                                rows={2}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">محتوا <span className="text-red-500">*</span></label>
                            <WysiwygEditor value={form.body} onChange={html => setForm(p => ({ ...p, body: html }))} minHeight={200} />
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
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <div className="relative">
                                <select
                                    value={form.status}
                                    onChange={e => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                                    className="w-full appearance-none rounded-md border border-gray-300 pr-3 pl-8 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    style={{ background: 'none' }}
                                >
                                    <option value="draft">پیش‌نویس</option>
                                    <option value="published">منتشر شده</option>
                                </select>
                                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
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
                        {tags.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">برچسب‌ها</label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleTag(tag.id)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                form.tag_ids.includes(tag.id)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Media Attachments ── */}
                        {(() => {
                            const fileDefs = fieldDefinitions.filter(d => d.field_type === 'file');
                            return (fileDefs.length > 0 || mediaCollections.length > 0) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">فایل‌های رسانه‌ای</label>

                                {/* File-type field definitions from category */}
                                {fileDefs.length > 0 && (
                                    <div className="space-y-3 mb-3">
                                        {fileDefs.map(def => (
                                            <MediaCollection
                                                key={def.id}
                                                postId={post.id}
                                                collection={def.field_key}
                                                label={def.label}
                                                isRequired={def.is_required}
                                                items={postMedia[def.field_key] ?? []}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Other known collections not covered by field definitions */}
                                {(() => {
                                    const defKeys = new Set(fileDefs.map(d => d.field_key));
                                    const extras = mediaCollections.filter(c => !defKeys.has(c));
                                    if (!extras.length) return null;
                                    return (
                                        <details className="group">
                                            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 transition-colors mb-2 select-none list-none flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                                سایر مجموعه‌ها
                                            </summary>
                                            <div className="space-y-3 mt-2">
                                                {extras.map(col => (
                                                    <MediaCollection
                                                        key={col}
                                                        postId={post.id}
                                                        collection={col}
                                                        label={COLLECTION_LABELS[col] ?? col}
                                                        isRequired={false}
                                                        items={postMedia[col] ?? []}
                                                    />
                                                ))}
                                            </div>
                                        </details>
                                    );
                                })()}
                            </div>
                        );
                        })()}

                        <div className="flex justify-end gap-3 pt-2">
                            <a href={route('blog.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                انصراف
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
            </div>

            <AssetPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleAssetSelect}
                accept="image"
                canUpload={canUpload}
            />
        </AuthenticatedLayout>
    );
}
