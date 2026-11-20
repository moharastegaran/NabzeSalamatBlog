import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import AssetPicker from '@/Components/AssetPicker';
import MultiSelect from '@/Components/MultiSelect';
import type { Asset } from '@/types/models';
import { hasRole } from '@/utils/roles';

interface ParentOption {
    id: number;
    name: string;
    parent_id?: number;
}

interface Props {
    parents: ParentOption[];
}


function ImagePreview({ path, onClear, label }: { path: string; onClear: () => void; label: string }) {
    return (
        <div className="relative inline-block">
            <img
                src={`/storage/${path}`}
                alt={label}
                className="h-20 w-20 rounded-lg object-cover ring-1 ring-gray-200"
            />
            <button
                type="button"
                onClick={onClear}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default function BlogCategoryCreate({ parents }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canUpload = hasRole(auth.user?.roles, 'admin');

    const [form, setForm] = useState({ name: '', slug: '', description: '', parent_id: null as number | null, icon: '', thumbnail: '', broadcast_to_bale: false });
    const [errors, setErrors]           = useState<Record<string, string>>({});
    const [processing, setProcessing]   = useState(false);
    const [pickerOpen, setPickerOpen]   = useState<'icon' | 'thumbnail' | null>(null);
    const [slugEdited, setSlugEdited]   = useState(false);

    const toSlug = (s: string) =>
        s.toLowerCase()
         .replace(/[^a-z0-9\s-]/g, '')
         .trim()
         .replace(/\s+/g, '-')
         .replace(/-+/g, '-')
         .replace(/^-+|-+$/g, '');

    const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

    const handleNameChange = (name: string) => {
        setForm(p => ({
            ...p,
            name,
            slug: slugEdited ? p.slug : toSlug(name),
        }));
    };

    const handleSlugChange = (slug: string) => {
        setSlugEdited(true);
        setForm(p => ({ ...p, slug }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('blog.categories.store'), {
            name:              form.name,
            slug:              form.slug,
            description:       form.description,
            parent_id:         form.parent_id,
            icon:              form.icon || null,
            thumbnail:         form.thumbnail || null,
            broadcast_to_bale: form.broadcast_to_bale,
        }, {
            onError:   errs => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        });
    };

    const handleAssetSelect = (field: 'icon' | 'thumbnail') => (asset: Asset) => {
        setForm(p => ({ ...p, [field]: asset.path }));
        setPickerOpen(null);
    };

    const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">دسته‌بندی جدید</h2>}>
            <Head title="دسته‌بندی جدید" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-5 bg-white rounded-xl shadow-sm p-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => handleNameChange(e.target.value)}
                                className={inputClass}
                                autoFocus
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                اسلاگ (Slug) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                dir="ltr"
                                value={form.slug}
                                onChange={e => handleSlugChange(e.target.value)}
                                placeholder="example-slug"
                                className={`${inputClass} font-mono ${
                                    form.slug && !isValidSlug(form.slug) ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                            />
                            {form.slug && !isValidSlug(form.slug) && !errors.slug && (
                                <p className="mt-1 text-xs text-amber-600">فقط حروف لاتین کوچک، اعداد و خط تیره مجاز است (مثال: salamat-omumi)</p>
                            )}
                            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی والد</label>
                            <MultiSelect
                                options={parents}
                                selected={form.parent_id !== null ? [form.parent_id] : []}
                                onChange={ids => setForm(p => ({ ...p, parent_id: ids[0] ?? null }))}
                                isMultiSelect={false}
                                placeholder="— بدون والد (دسته اصلی) —"
                                error={errors.parent_id}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                rows={3}
                                className={inputClass}
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                            <input
                                type="checkbox"
                                id="broadcast_to_bale"
                                checked={form.broadcast_to_bale}
                                onChange={e => setForm(p => ({ ...p, broadcast_to_bale: e.target.checked }))}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-indigo-600"
                            />
                            <div>
                                <label htmlFor="broadcast_to_bale" className="block text-sm font-medium text-gray-800">
                                    انتشار در بله
                                </label>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    اگر فعال باشد، اخبار منتشرشده این دسته‌بندی به کانال بله ارسال می‌شوند.
                                </p>
                            </div>
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">آیکون</label>
                            {form.icon ? (
                                <ImagePreview path={form.icon} label="آیکون" onClear={() => setForm(p => ({ ...p, icon: '' }))} />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setPickerOpen('icon')}
                                    className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    انتخاب آیکون
                                </button>
                            )}
                            {errors.icon && <p className="mt-1 text-xs text-red-600">{errors.icon}</p>}
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">تصویر بندانگشتی</label>
                            {form.thumbnail ? (
                                <ImagePreview path={form.thumbnail} label="تصویر بندانگشتی" onClear={() => setForm(p => ({ ...p, thumbnail: '' }))} />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setPickerOpen('thumbnail')}
                                    className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    انتخاب تصویر
                                </button>
                            )}
                            {errors.thumbnail && <p className="mt-1 text-xs text-red-600">{errors.thumbnail}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
                            <a href={route('blog.categories.index')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                انصراف
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                            >
                                {processing ? 'در حال ذخیره...' : 'ذخیره'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            <AssetPicker
                open={pickerOpen !== null}
                onClose={() => setPickerOpen(null)}
                onSelect={pickerOpen ? handleAssetSelect(pickerOpen) : () => {}}
                accept="image"
                canUpload={canUpload}
            />
        </AuthenticatedLayout>
    );
}
