import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Banking } from '@/types/models';
import { useState } from 'react';

interface Props {
    banks: Banking[];
    can: { manage: boolean };
}

function ActiveBadge({ active }: { active: boolean }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            active ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-500'
        }`}>
            {active ? 'فعال' : 'غیرفعال'}
        </span>
    );
}

function AddModal({ parentId, onClose }: { parentId?: number; onClose: () => void }) {
    const isBank = parentId == null;

    const { data, setData, post, processing, errors } = useForm({
        parent_id:       parentId?.toString() ?? '',
        name:            '',
        description:     '',
        img_file:        null as File | null,
        period:          '',
        ship_after_days: '',
        impact_factor:   '',
        is_active:       true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('banking.store'), { forceFormData: true, onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        افزودن {isBank ? 'بانک جدید' : 'طرح اعتباری جدید'}
                    </h3>
                    <button type="button" onClick={onClose} className="rounded-md p-1 text-gray-500 hover:text-gray-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">نام</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {isBank && (
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">توضیحات</label>
                            <textarea
                                rows={2}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">تصویر</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('img_file', e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-gray-600 file:ml-2 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {errors.img_file && <p className="mt-1 text-xs text-red-600">{errors.img_file}</p>}
                    </div>

                    {!isBank && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">بازپرداخت (به ماه)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.period}
                                    onChange={e => setData('period', e.target.value)}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.period && <p className="mt-1 text-xs text-red-600">{errors.period}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">مجاز به ارسال پس از (روز)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.ship_after_days}
                                    onChange={e => setData('ship_after_days', e.target.value)}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.ship_after_days && <p className="mt-1 text-xs text-red-600">{errors.ship_after_days}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">ضریب تغییر</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={data.impact_factor}
                                    onChange={e => setData('impact_factor', e.target.value)}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.impact_factor && <p className="mt-1 text-xs text-red-600">{errors.impact_factor}</p>}
                            </div>
                        </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-200 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-800">فعال</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-700">
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'در حال ذخیره سازی…' : 'افزودن'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Mounts fresh for each item via key={item.id}, so useForm initialises correctly
function EditModal({ item, onClose }: { item: Banking; onClose: () => void }) {
    const isBank = item.parent_id == null;

    const { data, setData, post, processing, errors } = useForm({
        _method:         'put',
        name:            item.name,
        description:     item.description ?? '',
        img:             item.img ?? '',
        img_file:        null as File | null,
        period:          item.period?.toString() ?? '',
        ship_after_days: item.ship_after_days?.toString() ?? '',
        impact_factor:   item.impact_factor?.toString() ?? '',
        is_active:       item.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('banking.update', item.id), { forceFormData: true, onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        ویرایش {isBank ? 'بانک' : 'طرح اعتباری'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-500 hover:text-gray-500"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    {/* Name — always */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">نام</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {/* Bank-only fields */}
                    {isBank && (
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">توضیحات</label>
                            <textarea
                                rows={2}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    )}

                    {/* Image — always */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">تصویر</label>
                        {data.img && (
                            <img
                                src={`/storage/${data.img}`}
                                alt={item.name}
                                className="mb-2 h-12 w-12 rounded-lg border border-gray-200 object-contain p-1"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('img_file', e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-gray-600 file:ml-2 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {(errors.img || errors.img_file) && (
                            <p className="mt-1 text-xs text-red-600">{errors.img || errors.img_file}</p>
                        )}
                    </div>

                    {/* Plan-only fields */}
                    {!isBank && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">بازپرداخت (به ماه)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.period}
                                    onChange={e => setData('period', e.target.value)}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.period && <p className="mt-1 text-xs text-red-600">{errors.period}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">مجاز به ارسال پس از (روز)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.ship_after_days}
                                    onChange={e => setData('ship_after_days', e.target.value)}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.ship_after_days && <p className="mt-1 text-xs text-red-600">{errors.ship_after_days}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-1">ضریب تغییر</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={data.impact_factor}
                                    onChange={e => setData('impact_factor', e.target.value)}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.impact_factor && <p className="mt-1 text-xs text-red-600">{errors.impact_factor}</p>}
                            </div>
                        </div>
                    )}

                    {/* Active toggle — always */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-200 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-800">برای غیر فعال کردن طرح، تیک را بردارید</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-700"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'در حال ذخیره سازی…' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function BankingIndex({ banks, can }: Props) {

    const [editingItem, setEditingItem] = useState<Banking | null>(null);
    const [addTarget, setAddTarget] = useState<{ parentId?: number } | null>(null);

    const toggle = (item: Banking) => {
        const action = item.is_active ? 'غیرفعالسازی' : 'فعالسازی';
        if (confirm(`${action} "${item.name}"?`)) {
            router.post(route('banking.toggle', item.id));
        }
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex lg:flex-row flex-col gap-2 items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">بانک‌ها و طرح‌های اعتباری</h2>
                {can.manage && (
                    <button
                        onClick={() => setAddTarget({})}
                        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        افزودن بانک
                    </button>
                )}
            </div>
        }>
            <Head title="بانک‌ها و طرح‌های اعتباری" />

            {addTarget !== null && (
                <AddModal
                    key={addTarget.parentId ?? 'bank'}
                    parentId={addTarget.parentId}
                    onClose={() => setAddTarget(null)}
                />
            )}

            {editingItem && (
                <EditModal
                    key={editingItem.id}
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                />
            )}

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">

                    {banks.length === 0 && (
                        <div className="rounded-lg bg-white px-6 py-12 text-center shadow-sm">
                            <p className="text-sm text-gray-500">بانکی یافت نشد.</p>
                        </div>
                    )}

                    {banks.map((bank) => (
                        <div key={bank.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">

                            {/* Bank header */}
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center gap-4">
                                    {bank.img ? (
                                        <img
                                            src={`/storage/${bank.img}`}
                                            alt={bank.name}
                                            className="h-12 w-12 rounded-lg object-contain border border-gray-200 p-1"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 text-indigo-600 font-bold text-lg">
                                            {bank.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-800">{bank.name}</h3>
                                        {bank.description && (
                                            <p className="text-sm text-gray-500 mt-0.5">{bank.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <ActiveBadge active={bank.is_active} />
                                    {can.manage && (
                                        <>
                                            <button
                                                onClick={() => setAddTarget({ parentId: bank.id })}
                                                title="افزودن طرح"
                                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                افزودن طرح
                                            </button>
                                            <button
                                                onClick={() => setEditingItem(bank)}
                                                title="ویرایش"
                                                className="rounded p-1 text-indigo-600 hover:bg-gray-50 hover:text-gray-700"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L18 8.625" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => toggle(bank)}
                                                title={bank.is_active ? 'غیرفعالسازی' : 'فعالسازی'}
                                                className={`rounded p-1 ${bank.is_active ? 'text-red-500 hover:bg-red-50 hover:text-red-700' : 'text-green-600 hover:bg-green-50 hover:text-green-800'}`}
                                            >
                                                {bank.is_active ? (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Payment plans */}
                            {bank.payment_plans && bank.payment_plans.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['نام طرح', 'بازپرداخت', 'درصد تغییر', 'مدت پیش فاکتور (روز)', 'وضعیت', ...(can.manage ? ['عملیات'] : [])].map((h) => (
                                                <th
                                                    key={h}
                                                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {bank.payment_plans.map((plan) => (
                                            <tr key={plan.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 text-sm font-medium text-gray-800">
                                                    {plan.name}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">
                                                    {plan.period != null ? `${plan.period} ماهه` : '—'}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">
                                                    {plan.impact_factor != null ? `${plan.impact_factor}×` : '—'}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">
                                                    {plan.ship_after_days != null ? `${plan.ship_after_days} روز` : '—'}
                                                </td>
                                                {/*<td className="px-6 py-3 text-sm text-gray-500">*/}
                                                {/*    {plan.cost_per_month != null*/}
                                                {/*        ? formatPrice(plan.cost_per_month)*/}
                                                {/*        : '—'}*/}
                                                {/*</td>*/}
                                                <td className="px-6 py-3">
                                                    <ActiveBadge active={plan.is_active} />
                                                </td>
                                                {can.manage && (
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setEditingItem(plan)}
                                                                title="ویرایش"
                                                                className="rounded p-1 text-indigo-600 hover:bg-gray-50 hover:text-gray-700"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L18 8.625" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => toggle(plan)}
                                                                title={plan.is_active ? 'غیرفعالسازی' : 'فعالسازی'}
                                                                className={`rounded p-1 ${plan.is_active ? 'text-red-500 hover:bg-red-50 hover:text-red-700' : 'text-green-600 hover:bg-green-50 hover:text-green-800'}`}
                                                            >
                                                                {plan.is_active ? (
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="px-6 py-4 text-sm text-gray-500">طرح اعتباری افزوده نشده است.</p>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
