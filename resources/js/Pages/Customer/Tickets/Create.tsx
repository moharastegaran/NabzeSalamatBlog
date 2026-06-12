import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import InputError from '@/Components/InputError';

export default function CustomerTicketsCreate() {
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        department: string;
        body: string;
        attachments: File[];
    }>({
        title:       '',
        department:  'support',
        body:        '',
        attachments: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title',      data.title);
        fd.append('department', data.department);
        fd.append('body',       data.body);
        data.attachments.forEach((f) => fd.append('attachments[]', f));
        post(route('customer.tickets.store'), { forceFormData: true });
    };

    return (
        <CustomerLayout>
            <Head title="ثبت تیکت جدید" />

            <div className="max-w-2xl space-y-5">
                <h1 className="text-xl font-bold text-gray-800">ثبت تیکت جدید</h1>

                <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">موضوع <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="موضوع تیکت خود را بنویسید"
                            required
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان <span className="text-red-500">*</span></label>
                        <select
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="support">پشتیبانی عمومی</option>
                            <option value="technical">فنی</option>
                            <option value="financial">مالی</option>
                        </select>
                        <InputError message={errors.department} className="mt-1" />
                    </div>

                    {/* Body */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات <span className="text-red-500">*</span></label>
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={6}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                            placeholder="مشکل یا سوال خود را به تفصیل شرح دهید..."
                            required
                        />
                        <InputError message={errors.body} className="mt-1" />
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">پیوست‌ها (اختیاری، حداکثر ۵ فایل، هر کدام تا ۵ مگابایت)</label>
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                            className="block w-full text-sm text-gray-500 file:ml-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {data.attachments.length > 0 && (
                            <p className="mt-1 text-xs text-gray-400">{data.attachments.length} فایل انتخاب شده</p>
                        )}
                        <InputError message={errors.attachments} className="mt-1" />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'در حال ارسال...' : 'ثبت تیکت'}
                        </button>
                        <a
                            href={route('customer.tickets.index')}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            انصراف
                        </a>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}
