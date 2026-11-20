import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { BlogCategory } from '@/types/models';
import { PageProps } from '@/types';
import { useState } from 'react';
import AssetPicker from '@/Components/AssetPicker';
import MultiSelect from '@/Components/MultiSelect';
import type { Asset, CategoryFieldDefinition, CategoryFieldType } from '@/types/models';
import { hasRole } from '@/utils/roles';

interface ParentOption {
    id: number;
    name: string;
    parent_id?: number;
}

interface Props {
    category: BlogCategory;
    parents: ParentOption[];
    fieldDefinitions: CategoryFieldDefinition[];
    mediaCollections: string[];
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

const FIELD_TYPE_LABELS: Record<CategoryFieldType, string> = {
    file:   'فایل',
    text:   'متن',
    number: 'عدد',
    select: 'انتخابی',
    date:   'تاریخ',
};

const COLLECTION_LABELS: Record<string, string> = {
    audio:      'صوتی',
    video:      'ویدیو',
    transcript: 'متنی / PDF',
    attachment: 'پیوست',
};

const FIELD_TYPE_COLORS: Record<CategoryFieldType, string> = {
    file:   'bg-blue-50 text-blue-700',
    text:   'bg-gray-50 text-gray-700',
    number: 'bg-amber-50 text-amber-700',
    select: 'bg-purple-50 text-purple-700',
    date:   'bg-green-50 text-green-700',
};

function FieldDefinitionRow({
    def,
    categoryId,
}: {
    def: CategoryFieldDefinition;
    categoryId: number;
}) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        label:       def.label,
        is_required: def.is_required,
        sort_order:  def.sort_order,
    });
    const [saving, setSaving] = useState(false);

    const save = () => {
        setSaving(true);
        router.put(route('blog.categories.fields.update', [categoryId, def.id]), form, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditing(false); },
            onError:   () => setSaving(false),
        });
    };

    const remove = () => {
        if (!confirm('این فیلد حذف شود؟')) return;
        router.delete(route('blog.categories.fields.destroy', [categoryId, def.id]), { preserveScroll: true });
    };

    const keyDisplay = def.field_type === 'file'
        ? (COLLECTION_LABELS[def.field_key] ?? def.field_key)
        : def.field_key;

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
                            id={`req-required-${def.id}`}
                            checked={form.is_required}
                            onChange={e => setForm(p => ({ ...p, is_required: e.target.checked }))}
                            className="rounded border-gray-300 text-indigo-600"
                        />
                        <label htmlFor={`req-required-${def.id}`} className="text-sm text-gray-700">الزامی</label>
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
                    <div className="flex items-center gap-3 min-w-0">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${FIELD_TYPE_COLORS[def.field_type]}`}>
                            {FIELD_TYPE_LABELS[def.field_type]}
                        </span>
                        <span className="text-xs text-gray-400 font-mono shrink-0">{keyDisplay}</span>
                        <span className="text-sm text-gray-700 truncate">{def.label}</span>
                        {def.is_required && (
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 shrink-0">الزامی</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
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

function AddFieldDefinitionForm({
    categoryId,
    fieldDefinitions,
    mediaCollections,
}: {
    categoryId: number;
    fieldDefinitions: CategoryFieldDefinition[];
    mediaCollections: string[];
}) {
    const [open, setOpen]     = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const usedFileKeys = fieldDefinitions.filter(d => d.field_type === 'file').map(d => d.field_key);
    const availableCollections = mediaCollections.filter(c => !usedFileKeys.includes(c));

    const [form, setForm] = useState<{
        field_type: CategoryFieldType;
        field_key: string;
        label: string;
        is_required: boolean;
        sort_order: number;
        options: Record<string, unknown>;
    }>({
        field_type:  'file',
        field_key:   availableCollections[0] ?? '',
        label:       '',
        is_required: false,
        sort_order:  0,
        options:     {},
    });

    const setFieldType = (type: CategoryFieldType) => {
        setForm(p => ({
            ...p,
            field_type: type,
            field_key:  type === 'file' ? (availableCollections[0] ?? '') : '',
            options:    {},
        }));
    };

    if (!open) {
        return (
            <div className="px-6 py-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    افزودن فیلد
                </button>
            </div>
        );
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);

        const payload = {
            field_type:  form.field_type,
            field_key:   form.field_key,
            label:       form.label,
            is_required: form.is_required,
            sort_order:  form.sort_order,
            options:     Object.keys(form.options).length > 0 ? form.options as Record<string, string | number | boolean | null> : null,
        };

        router.post(route('blog.categories.fields.store', categoryId), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setOpen(false);
                setForm({ field_type: 'file', field_key: availableCollections[0] ?? '', label: '', is_required: false, sort_order: 0, options: {} });
            },
            onError: errs => { setErrors(errs); setSaving(false); },
        });
    };

    const inputClass = 'rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

    return (
        <form onSubmit={submit} className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl space-y-4">
            <p className="text-xs font-semibold text-gray-600">فیلد جدید</p>

            {/* Row 1: type + key + label */}
            <div className="flex flex-wrap gap-3 items-end">
                {/* Field type */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">نوع</label>
                    <select
                        value={form.field_type}
                        onChange={e => setFieldType(e.target.value as CategoryFieldType)}
                        className={inputClass}
                        style={{ background: 'none' }}
                    >
                        {(['file', 'text', 'number', 'select', 'date'] as CategoryFieldType[]).map(t => (
                            <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
                        ))}
                    </select>
                </div>

                {/* field_key — collection picker for file, text input for scalars */}
                {form.field_type === 'file' ? (
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">مجموعه</label>
                        <select
                            value={form.field_key}
                            onChange={e => setForm(p => ({ ...p, field_key: e.target.value }))}
                            disabled={availableCollections.length === 0}
                            className={inputClass}
                            style={{ background: 'none' }}
                        >
                            {availableCollections.length === 0
                                ? <option value="">همه مجموعه‌ها استفاده شده‌اند</option>
                                : availableCollections.map(c => (
                                    <option key={c} value={c}>{COLLECTION_LABELS[c] ?? c}</option>
                                ))
                            }
                        </select>
                        {errors.field_key && <p className="mt-1 text-xs text-red-600">{errors.field_key}</p>}
                    </div>
                ) : (
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            کلید (slug) <span className="text-red-500">*</span>
                        </label>
                        <input
                            dir="ltr"
                            value={form.field_key}
                            onChange={e => setForm(p => ({ ...p, field_key: e.target.value }))}
                            placeholder="مثال: episode_number"
                            required
                            className={`${inputClass} font-mono w-40`}
                        />
                        {errors.field_key && <p className="mt-1 text-xs text-red-600">{errors.field_key}</p>}
                    </div>
                )}

                {/* Label */}
                <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        برچسب <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.label}
                        onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                        placeholder="مثال: شماره اپیزود"
                        required
                        className={`${inputClass} w-full`}
                    />
                    {errors.label && <p className="mt-1 text-xs text-red-600">{errors.label}</p>}
                </div>

                {/* is_required */}
                <div className="flex items-center gap-2 pb-1.5">
                    <input
                        type="checkbox"
                        id="new-field-required"
                        checked={form.is_required}
                        onChange={e => setForm(p => ({ ...p, is_required: e.target.checked }))}
                        className="rounded border-gray-300 text-indigo-600"
                    />
                    <label htmlFor="new-field-required" className="text-sm text-gray-700">الزامی</label>
                </div>
            </div>

            {/* Row 2: type-specific options */}
            {form.field_type === 'number' && (
                <div className="flex gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">حداقل</label>
                        <input
                            type="number"
                            dir="ltr"
                            value={(form.options.min as number | undefined) ?? ''}
                            onChange={e => setForm(p => ({ ...p, options: { ...p.options, min: e.target.value === '' ? undefined : Number(e.target.value) } }))}
                            className={`${inputClass} w-24`}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">حداکثر</label>
                        <input
                            type="number"
                            dir="ltr"
                            value={(form.options.max as number | undefined) ?? ''}
                            onChange={e => setForm(p => ({ ...p, options: { ...p.options, max: e.target.value === '' ? undefined : Number(e.target.value) } }))}
                            className={`${inputClass} w-24`}
                        />
                    </div>
                </div>
            )}

            {form.field_type === 'select' && (
                <SelectChoicesEditor
                    choices={(form.options.choices as { value: string; label: string }[]) ?? []}
                    onChange={choices => setForm(p => ({ ...p, options: { ...p.options, choices } }))}
                />
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={saving || !form.label.trim() || !form.field_key.trim() || (form.field_type === 'file' && availableCollections.length === 0)}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                    {saving ? '...' : 'افزودن'}
                </button>
                <button
                    type="button"
                    onClick={() => { setOpen(false); setErrors({}); }}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                    انصراف
                </button>
            </div>
        </form>
    );
}

function SelectChoicesEditor({
    choices,
    onChange,
}: {
    choices: { value: string; label: string }[];
    onChange: (choices: { value: string; label: string }[]) => void;
}) {
    const add = () => onChange([...choices, { value: '', label: '' }]);
    const update = (i: number, field: 'value' | 'label', v: string) => {
        const next = choices.map((c, idx) => idx === i ? { ...c, [field]: v } : c);
        onChange(next);
    };
    const remove = (i: number) => onChange(choices.filter((_, idx) => idx !== i));

    return (
        <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600">گزینه‌ها</label>
            {choices.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <input
                        dir="ltr"
                        value={c.value}
                        onChange={e => update(i, 'value', e.target.value)}
                        placeholder="مقدار"
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs font-mono w-28 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                        value={c.label}
                        onChange={e => update(i, 'label', e.target.value)}
                        placeholder="برچسب"
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs flex-1 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
            >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                افزودن گزینه
            </button>
        </div>
    );
}

export default function BlogCategoryEdit({ category, parents, fieldDefinitions, mediaCollections }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canUpload = hasRole(auth.user?.roles, 'admin');

    const [form, setForm] = useState({
        name:              category.name,
        slug:              category.slug,
        description:       category.description ?? '',
        parent_id:         category.parent_id ?? null,
        icon:              category.icon ?? '',
        thumbnail:         category.thumbnail ?? '',
        broadcast_to_bale: category.broadcast_to_bale ?? false,
    });
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState<'icon' | 'thumbnail' | null>(null);

    const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('blog.categories.update', category.id), {
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
                                {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                            </button>
                        </div>

                    </form>

                    {/* ── Field Definitions ─────────────────────────────────── */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-800">فیلدهای دسته‌بندی</h3>
                            <p className="text-xs text-gray-400 mt-0.5">فیلدهایی که پست‌های این دسته باید تکمیل کنند (فایل، عدد، متن، …).</p>
                        </div>

                        {fieldDefinitions.length > 0 && (
                            <div className="divide-y divide-gray-100">
                                {fieldDefinitions.map(def => (
                                    <FieldDefinitionRow
                                        key={def.id}
                                        def={def}
                                        categoryId={category.id}
                                    />
                                ))}
                            </div>
                        )}

                        <AddFieldDefinitionForm
                            categoryId={category.id}
                            fieldDefinitions={fieldDefinitions}
                            mediaCollections={mediaCollections}
                        />
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
