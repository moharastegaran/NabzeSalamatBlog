import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PersianDateTimePicker from '@/Components/PersianDateTimePicker';
import { toJalali } from '@/utils/date';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { PageProps } from '@/types';
import { BreakingNews } from '@/types/models';

interface Props {
    items: BreakingNews[];
}

type FormData = {
    title: string;
    url: string;
    is_active: boolean;
    active_from: string;
    active_until: string;
};

function nowString(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function validateForm(data: FormData, requireFuture: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!data.title.trim()) errs.title = 'عنوان الزامی است.';
    const now = nowString();
    if (!data.active_from) {
        errs.active_from = 'تاریخ شروع الزامی است.';
    } else if (requireFuture && data.active_from < now) {
        errs.active_from = 'تاریخ شروع باید برابر یا بزرگ‌تر از زمان جاری باشد.';
    }
    if (data.active_until) {
        if (requireFuture && data.active_until <= now) {
            errs.active_until = 'تاریخ پایان باید بزرگ‌تر از زمان جاری باشد.';
        } else if (data.active_from && data.active_until <= data.active_from) {
            errs.active_until = 'تاریخ پایان باید بزرگ‌تر از تاریخ شروع باشد.';
        }
    }
    return errs;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-block h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                checked ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
        >
            <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${
                    checked ? 'right-0.5' : 'left-0.5'
                }`}
            />
        </button>
    );
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

export default function BreakingNewsIndex({ items }: Props) {
    const { flash } = usePage<PageProps>().props;

    const addForm = useForm<FormData>({
        title: '',
        url: '',
        is_active: true,
        active_from: '',
        active_until: '',
    });
    const [addClientErrors, setAddClientErrors] = useState<Record<string, string>>({});

    const editForm = useForm<FormData>({
        title: '',
        url: '',
        is_active: true,
        active_from: '',
        active_until: '',
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [editClientErrors, setEditClientErrors] = useState<Record<string, string>>({});

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        const clientErrs = validateForm(addForm.data, true);
        if (Object.keys(clientErrs).length > 0) {
            setAddClientErrors(clientErrs);
            return;
        }
        setAddClientErrors({});
        addForm.post(route('breaking-news.store'), {
            preserveScroll: true,
            onSuccess: () => { addForm.reset(); setAddClientErrors({}); },
        });
    };

    const startEdit = (item: BreakingNews) => {
        setEditId(item.id);
        editForm.setData({
            title: item.title,
            url: item.url ?? '',
            is_active: item.is_active,
            active_from: item.active_from,
            active_until: item.active_until ?? '',
        });
        editForm.clearErrors();
        setEditClientErrors({});
    };

    const cancelEdit = () => {
        setEditId(null);
        editForm.reset();
        setEditClientErrors({});
    };

    const handleEditSave = () => {
        const clientErrs = validateForm(editForm.data, false);
        if (Object.keys(clientErrs).length > 0) {
            setEditClientErrors(clientErrs);
            return;
        }
        setEditClientErrors({});
        editForm.put(route('breaking-news.update', editId!), {
            preserveScroll: true,
            onSuccess: () => { setEditId(null); editForm.reset(); },
        });
    };

    const handleDelete = (item: BreakingNews) => {
        if (!confirm(`آیا از حذف خبر فوری «${item.title}» اطمینان دارید؟`)) return;
        router.delete(route('breaking-news.destroy', item.id), { preserveScroll: true });
    };

    const addErr = (field: keyof FormData) =>
        addClientErrors[field] || addForm.errors[field];

    const editErr = (field: keyof FormData) =>
        editClientErrors[field] || editForm.errors[field];

    const nowMin = nowString();

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">اخبار فوری</h2>}>
            <Head title="اخبار فوری" />

            <div className="px-4 py-5 lg:px-0 lg:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {flash?.success && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}

                    {/* ── Add form ── */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h3 className="text-sm font-semibold text-gray-700">افزودن خبر فوری جدید</h3>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4 px-5 py-4">
                            {/* Title */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                    عنوان <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={addForm.data.title}
                                    onChange={e => { addForm.setData('title', e.target.value); setAddClientErrors(p => ({ ...p, title: '' })); }}
                                    placeholder="عنوان خبر فوری..."
                                    maxLength={255}
                                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                        addErr('title')
                                            ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                                    }`}
                                />
                                <FieldError msg={addErr('title')} />
                            </div>

                            {/* URL */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">آدرس (اختیاری)</label>
                                <input
                                    type="text"
                                    value={addForm.data.url}
                                    onChange={e => { addForm.setData('url', e.target.value); setAddClientErrors(p => ({ ...p, url: '' })); }}
                                    placeholder="https://..."
                                    maxLength={500}
                                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                        addErr('url')
                                            ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                                    }`}
                                    dir="ltr"
                                />
                                <FieldError msg={addErr('url')} />
                            </div>

                            {/* Datetimes + toggle */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                        از تاریخ <span className="text-red-500">*</span>
                                    </label>
                                    <PersianDateTimePicker
                                        value={addForm.data.active_from}
                                        onChange={v => { addForm.setData('active_from', v); setAddClientErrors(p => ({ ...p, active_from: '' })); }}
                                        minDateTime={nowMin}
                                        placeholder="انتخاب تاریخ شروع..."
                                        error={addErr('active_from')}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">تا تاریخ (اختیاری)</label>
                                    <PersianDateTimePicker
                                        value={addForm.data.active_until}
                                        onChange={v => { addForm.setData('active_until', v); setAddClientErrors(p => ({ ...p, active_until: '' })); }}
                                        minDateTime={addForm.data.active_from || nowMin}
                                        placeholder="انتخاب تاریخ پایان..."
                                        error={addErr('active_until')}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex flex-col justify-between">
                                    <label className="mb-1 block text-xs font-medium text-gray-600">وضعیت</label>
                                    <div className="flex items-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2">
                                        <Toggle
                                            checked={addForm.data.is_active}
                                            onChange={v => addForm.setData('is_active', v)}
                                        />
                                        <span className={`text-sm font-medium ${addForm.data.is_active ? 'text-indigo-700' : 'text-gray-400'}`}>
                                            {addForm.data.is_active ? 'فعال' : 'غیرفعال'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {addForm.processing ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            در حال ثبت...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            ثبت خبر فوری
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── Table ── */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <span className="text-sm font-semibold text-gray-700">
                                {items.length > 0 ? `${items.length} خبر فوری` : 'لیست اخبار فوری'}
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <p className="text-sm text-gray-400">هنوز خبری ثبت نشده است.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['عنوان', 'آدرس', 'وضعیت', 'از تاریخ', 'تا تاریخ', 'عملیات'].map(h => (
                                                <th key={h} className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-gray-500">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {items.map(item => (
                                            editId === item.id ? (
                                                /* ── Edit row ── */
                                                <tr key={item.id} className="bg-indigo-50/40">
                                                    {/* Title */}
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={editForm.data.title}
                                                            onChange={e => { editForm.setData('title', e.target.value); setEditClientErrors(p => ({ ...p, title: '' })); }}
                                                            maxLength={255}
                                                            className={`w-full min-w-[160px] rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                                                                editErr('title')
                                                                    ? 'border-red-400 focus:ring-red-300'
                                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                                                            }`}
                                                            placeholder="عنوان..."
                                                        />
                                                        <FieldError msg={editErr('title')} />
                                                    </td>
                                                    {/* URL */}
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={editForm.data.url}
                                                            onChange={e => { editForm.setData('url', e.target.value); setEditClientErrors(p => ({ ...p, url: '' })); }}
                                                            maxLength={500}
                                                            className={`w-full min-w-[160px] rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                                                                editErr('url')
                                                                    ? 'border-red-400 focus:ring-red-300'
                                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                                                            }`}
                                                            placeholder="https://..."
                                                            dir="ltr"
                                                        />
                                                        <FieldError msg={editErr('url')} />
                                                    </td>
                                                    {/* is_active */}
                                                    <td className="px-4 py-3">
                                                        <Toggle
                                                            checked={editForm.data.is_active}
                                                            onChange={v => editForm.setData('is_active', v)}
                                                        />
                                                    </td>
                                                    {/* active_from */}
                                                    <td className="px-4 py-3">
                                                        <PersianDateTimePicker
                                                            value={editForm.data.active_from}
                                                            onChange={v => { editForm.setData('active_from', v); setEditClientErrors(p => ({ ...p, active_from: '' })); }}
                                                            placeholder="تاریخ شروع..."
                                                            error={editErr('active_from')}
                                                            className="min-w-[170px]"
                                                        />
                                                    </td>
                                                    {/* active_until */}
                                                    <td className="px-4 py-3">
                                                        <PersianDateTimePicker
                                                            value={editForm.data.active_until}
                                                            onChange={v => { editForm.setData('active_until', v); setEditClientErrors(p => ({ ...p, active_until: '' })); }}
                                                            minDateTime={editForm.data.active_from || undefined}
                                                            placeholder="تاریخ پایان..."
                                                            error={editErr('active_until')}
                                                            className="min-w-[170px]"
                                                        />
                                                    </td>
                                                    {/* Actions */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={handleEditSave}
                                                                disabled={editForm.processing}
                                                                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                                                            >
                                                                {editForm.processing ? '...' : 'ذخیره'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={cancelEdit}
                                                                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                                                            >
                                                                انصراف
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                /* ── View row ── */
                                                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                                    {/* Title */}
                                                    <td className="px-4 py-3">
                                                        <span className="text-sm font-medium text-gray-800">{item.title}</span>
                                                    </td>
                                                    {/* URL */}
                                                    <td className="px-4 py-3">
                                                        {item.url ? (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="max-w-[200px] block truncate text-xs text-indigo-600 hover:underline"
                                                                dir="ltr"
                                                            >
                                                                {item.url}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                    {/* is_active */}
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            item.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                                : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                                                        }`}>
                                                            {item.is_active ? 'فعال' : 'غیرفعال'}
                                                        </span>
                                                    </td>
                                                    {/* active_from */}
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                        {toJalali(item.active_from, true)}
                                                    </td>
                                                    {/* active_until */}
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                        {item.active_until ? toJalali(item.active_until, true) : <span className="text-gray-400">—</span>}
                                                    </td>
                                                    {/* Actions */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => startEdit(item)}
                                                                className="rounded p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                                                title="ویرایش"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item)}
                                                                className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                                title="حذف"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
