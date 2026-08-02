import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import AssetPicker from '@/Components/AssetPicker';
import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import TagMultiSelect from '@/Components/TagMultiSelect';
import type { Asset, BlogCategory, BlogTag } from '@/types/models';
import type { PageProps } from '@/types';
import { useState } from 'react';
import PersianDateTimePicker from '@/Components/PersianDateTimePicker';
import { localDateTimeStr } from '@/utils/date';

interface Props {
    categories: Pick<BlogCategory, 'id' | 'name' | 'parent_id'>[];
    tags: Pick<BlogTag, 'id' | 'name'>[];
}

interface FormData {
    title: string;
    subtitle: string;
    excerpt: string;
    body: string;
    status: 'draft' | 'scheduled' | 'published';
    publish_at: string;
    category_ids: number[];
    tag_ids: number[];
    featured_image: string | null;
}

export default function BlogCreate({ categories, tags }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canUpload = auth.user?.roles?.includes('admin') ?? false;
    const canCreateTags = auth.user?.permissions?.includes('tags.create') ?? false;

    const [form, setForm] = useState<FormData>({
        title: '',
        subtitle: '',
        excerpt: '',
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
        data.append('body', form.body);
        data.append('status', form.status);
        if (form.status === 'scheduled' && form.publish_at) data.append('publish_at', form.publish_at);
        form.category_ids.forEach(id => data.append('category_ids[]', String(id)));
        form.tag_ids.forEach(id => data.append('tag_ids[]', String(id)));
        if (form.featured_image) data.append('featured_image', form.featured_image);

        router.post(route('blog.store'), data, {
            forceFormData: true,
            onError:   (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
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
                            <RichTextEditor value={form.body} onChange={html => setForm(p => ({ ...p, body: html }))} minHeight={360} />
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
        </AuthenticatedLayout>
    );
}
