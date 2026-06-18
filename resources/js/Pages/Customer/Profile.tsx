import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/types';
import { validateMelliCode } from '@/utils/melli';
import { validateIranPhone } from '@/utils/phone';

interface UserInfo {
    name: string | null;
    email: string | null;
    mobile: string | null;
    melli_code: string | null;
}

interface Props {
    user: UserInfo;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-sm font-medium text-[#0B1A10] mb-1.5">{children}</label>;
}

function FieldError({ msg }: { msg?: string }) {
    return msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;
}

export default function Profile({ user }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [melliError, setMelliError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const { data, setData, patch, processing, errors } = useForm({
        name:       user.name       ?? '',
        email:      user.email      ?? '',
        mobile:     user.mobile     ?? '',
        melli_code: user.melli_code ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('customer.profile.update'));
    };

    const inputClass = (err?: string) =>
        `w-full border rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075F26] transition-colors ${err ? 'border-red-400' : 'border-gray-200'}`;

    return (
        <CustomerLayout>
            <Head title="جزئیات حساب" />

            <div className="bg-[#F2F2F2] rounded-3xl lg:p-6 p-4">
                <h3 className="text-lg font-bold text-right mb-5">جزئیات حساب</h3>

                {flash.success && (
                    <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel>نام و نام خانوادگی</FieldLabel>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={inputClass(errors.name)}
                                />
                                <FieldError msg={errors.name} />
                            </div>

                            <div>
                                <FieldLabel>شماره موبایل</FieldLabel>
                                <input
                                    type="text"
                                    value={data.mobile}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setData('mobile', val);
                                        setPhoneError(
                                            val.length === 11
                                                ? (validateIranPhone(val) ? null : 'شماره موبایل باید ۱۱ رقم و با ۰ شروع شود.')
                                                : null
                                        );
                                    }}
                                    dir="ltr"
                                    inputMode="numeric"
                                    maxLength={11}
                                    placeholder="09xxxxxxxxx"
                                    className={inputClass(phoneError ?? errors.mobile)}
                                />
                                <FieldError msg={phoneError ?? errors.mobile} />
                            </div>
                        </div>

                        <div>
                            <FieldLabel>کد ملی</FieldLabel>
                            <input
                                type="text"
                                value={data.melli_code}
                                onChange={e => {
                                    const val = e.target.value;
                                    setData('melli_code', val);
                                    setMelliError(
                                        val.length === 10
                                            ? (validateMelliCode(val) ? null : 'کد ملی وارد شده معتبر نیست.')
                                            : null
                                    );
                                }}
                                dir="ltr"
                                inputMode="numeric"
                                placeholder="۱۰ رقم"
                                maxLength={10}
                                className={inputClass(melliError ?? errors.melli_code)}
                            />
                            <FieldError msg={melliError ?? errors.melli_code} />
                        </div>

                        <div>
                            <FieldLabel>آدرس ایمیل <span className="text-gray-400 font-normal text-xs">(اختیاری)</span></FieldLabel>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={inputClass(errors.email)}
                            />
                            <FieldError msg={errors.email} />
                        </div>

                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link
                            href={route('customer.activities')}
                            className="rounded-xl border border-[#075F26] px-8 py-2.5 text-sm font-semibold text-[#075F26] hover:bg-gray-50 transition-colors"
                        >
                            انصراف
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#075F26] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#054E1F] disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}
