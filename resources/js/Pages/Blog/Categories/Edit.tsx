import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { BlogCategory } from '@/types/models';
import { PageProps } from '@/types';
import { useState } from 'react';
import AssetPicker from '@/Components/AssetPicker';
import MultiSelect from '@/Components/MultiSelect';
import type { Asset, CategoryMediaRequirement } from '@/types/models';

interface ParentOption {
    id: number;
    name: string;
    parent_id?: number;
}

interface Props {
    category: BlogCategory;
    parents: ParentOption[];
    requirements: CategoryMediaRequirement[];
    knownCollections: string[];
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

const COLLECTION_LABELS: Record<string, string> = {
    audio:      'صوتی',
    video:      'ویدیو',
    transcript: 'متنی / PDF',
    attachment: 'پیوست',
};

function RequirementRow({
    req,
    categoryId,
    knownCollections,
}: {
    req: CategoryMediaRequirement;
    categoryId: number;
    knownCollections: string[];
}) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        label:       req.label,
        is_required: req.is_required,
        sort_order:  req.sort_order,
    });
    const [saving, setSaving] = useState(false);

    const save = () => {
        setSaving(true);
        router.put(route('blog.categories.requirements.update', [categoryId, req.id]), form, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditing(false); },
            onError:   () => setSaving(false),
        });
    };

    const remove = () => {
        if (!confirm('این نیازمندی حذف شود؟')) return;
        router.delete(route('blog.categories.requirements.destroy', [categoryId, req.id]), { preserveScroll: true });
    };

    return (
        <div className="px-6 py-3">
            {editing ? (
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-xs font-medium text-gray-600 mb-1">برچسب</label>
                        <input
                            value={form.label}
                            onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 pb-1">
                        <input
                            type="checkbox"
                            id={`req-required-${req.id}`}
                            checked={form.is_required}
                            onChange={e => setForm(p => ({ ...p, is_required: e.target.checked }))}
                            className="rounded border-gray-300 text-indigo-600"
                        />
                        <label htmlFor={`req-required-${req.id}`} className="text-sm text-gray-700">الزامی</label>
                    </div>
                    <div className="flex gap-2 pb-1">
                        <button
                            type="button"
                            onClick={save}
                            disabled={saving}
                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                        >
                            ذخیره
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                            {COLLECTION_LABELS[req.collection_name] ?? req.collection_name}
                        </span>
                        <span className="text-sm text-gray-700">{req.label}</span>
                        {req.is_required && (
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">الزامی</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            title="ویرایش"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={remove}
                            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="حذف"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function AddRequirementForm({
    categoryId,
    knownCollections,
    usedCollections,
}: {
    categoryId: number;
    knownCollections: string[];
    usedCollections: string[];
}) {
    const [open, setOpen]         = useState(false);
    const [saving, setSaving]     = useState(false);
    const available = knownCollections.filter(c => !usedCollections.includes(c));

    const [form, setForm] = useState({
        collection_name: available[0] ?? '',
        label:           '',
        is_required:     false,
        sort_order:      0,
    });

    if (!open) {
        return (
            <div className="px-6 py-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => { setForm(p => ({ ...p, collection_name: available[0] ?? '' })); setOpen(true); }}
                    disabled={available.length === 0}
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {available.length === 0 ? 'همه مجموعه‌ها تعریف شده‌اند' : 'افزودن نیازمندی'}
                </button>
            </div>
        );
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post(route('blog.categories.requirements.store', categoryId), form, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setOpen(false); setForm({ collection_name: available[0] ?? '', label: '', is_required: false, sort_order: 0 }); },
            onError:   () => setSaving(false),
        });
    };

    return (
        <form onSubmit={submit} className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <p className="text-xs font-semibold text-gray-600 mb-3">نیازمندی جدید</p>
            <div className="flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">مجموعه</label>
                    <select
                        value={form.collection_name}
                        onChange={e => setForm(p => ({ ...p, collection_name: e.target.value }))}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        style={{ background: 'none' }}
                    >
                        {available.map(c => (
                            <option key={c} value={c}>{COLLECTION_LABELS[c] ?? c}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs font-medium text-gray-600 mb-1">برچسب <span className="text-red-500">*</span></label>
                    <input
                        value={form.label}
                        onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                        placeholder="مثال: فایل صوتی پادکست"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2 pb-1.5">
                    <input
                        type="checkbox"
                        id="new-req-required"
                        checked={form.is_required}
                        onChange={e => setForm(p => ({ ...p, is_required: e.target.checked }))}
                        className="rounded border-gray-300 text-indigo-600"
                    />
                    <label htmlFor="new-req-required" className="text-sm text-gray-700">الزامی</label>
                </div>
                <div className="flex gap-2 pb-1">
                    <button
                        type="submit"
                        disabled={saving || !form.label.trim()}
                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                    >
                        {saving ? '...' : 'افزودن'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function BlogCategoryEdit({ category, parents, requirements, knownCollections }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canUpload = auth.user?.roles?.includes('admin') ?? false;

    const [form, setForm] = useState({
        name:        category.name,
        slug:        category.slug,
        description: category.description ?? '',
        parent_id:   category.parent_id ?? null,
        icon:        category.icon ?? '',
        thumbnail:   category.thumbnail ?? '',
    });
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState<'icon' | 'thumbnail' | null>(null);

    const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('blog.categories.update', category.id), {
            name:        form.name,
            slug:        form.slug,
            description: form.description,
            parent_id:   form.parent_id,
            icon:        form.icon || null,
            thumbnail:   form.thumbnail || null,
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
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ویرایش دسته‌بندی</h2>}>
            <Head title="ویرایش دسته‌بندی" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-5 bg-white rounded-xl shadow-sm p-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
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
                                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
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
                                {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                            </button>
                        </div>

                    </form>

                    {/* ── Media Requirements ─────────────────────────────────── */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">نیازمندی‌های رسانه</h3>
                                <p className="text-xs text-gray-400 mt-0.5">تعریف کنید این دسته‌بندی چه فایل‌هایی نیاز دارد.</p>
                            </div>
                        </div>

                        {/* Existing requirements */}
                        {requirements.length > 0 && (
                            <div className="divide-y divide-gray-100">
                                {requirements.map(req => (
                                    <RequirementRow
                                        key={req.id}
                                        req={req}
                                        categoryId={category.id}
                                        knownCollections={knownCollections}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Add new */}
                        <AddRequirementForm categoryId={category.id} knownCollections={knownCollections} usedCollections={requirements.map(r => r.collection_name)} />
                    </div>
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
