import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

interface Props {
    users: { id: number; name: string }[];
}

export default function TicketsCreate({ users }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canSelectRecipient = auth.user.roles.includes('admin') || auth.user.roles.includes('cfo');

    const fileRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const [form, setForm] = useState({
        to_user_id:  '' as number | string,
        title:       '',
        department:  'support',
        body:        '',
        attachments: [] as File[],
    });

    const set = (key: string, value: number | string | File[]) => setForm(f => ({ ...f, [key]: value }));

    const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        if (form.to_user_id !== '') fd.append('to_user_id', String(form.to_user_id));
        fd.append('title',      form.title);
        fd.append('department', form.department);
        fd.append('body',       form.body);
        form.attachments.forEach((f) => fd.append('attachments[]', f));
        router.post(route('tickets.store'), fd, {
            onError: (e) => { setErrors(e); setProcessing(false); },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">ثبت تیکت جدید</h2>}>
            <Head title="ثبت تیکت جدید" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

                        {/* To user — admin & cfo only */}
                        {canSelectRecipient && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ارسال به (اختیاری)</label>
                                <SelectInput
                                    options={userOptions}
                                    value={form.to_user_id}
                                    onChange={(v) => set('to_user_id', v)}
                                    placeholder="— انتخاب کاربر —"
                                />
                                {errors.to_user_id && <InputError message={errors.to_user_id} className="mt-1" />}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">موضوع <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => set('title', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="موضوع تیکت"
                                required
                            />
                            {errors.title && <InputError message={errors.title} className="mt-1" />}
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان</label>
                            <div className="relative">
                                <select
                                    value={form.department}
                                    onChange={(e) => set('department', e.target.value)}
                                    className="w-full appearance-none rounded-md border border-gray-300 pr-3 pl-8 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    style={{ background: 'none' }}
                                >
                                    <option value="support">پشتیبانی</option>
                                    <option value="technical">فنی</option>
                                    <option value="financial">مالی</option>
                                </select>
                                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">متن اولیه <span className="text-red-500">*</span></label>
                            <textarea
                                value={form.body}
                                onChange={(e) => set('body', e.target.value)}
                                rows={5}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                placeholder="توضیحات تیکت..."
                                required
                            />
                            {errors.body && <InputError message={errors.body} className="mt-1" />}
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">پیوست‌ها (اختیاری)</label>
                            <input
                                ref={fileRef}
                                type="file"
                                multiple
                                onChange={(e) => set('attachments', Array.from(e.target.files ?? []))}
                                className="block w-full text-sm text-gray-500 file:ml-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {form.attachments.length > 0 && (
                                <p className="mt-1 text-xs text-gray-400">{form.attachments.length} فایل انتخاب شده</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-1">
                            <a
                                href={route('tickets.index')}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                انصراف
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'در حال ذخیره...' : 'ثبت تیکت'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
