import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import LoginLayout from '@/Layouts/LoginLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [captchaKey, setCaptchaKey] = useState(Date.now());

    const { data, setData, post, processing, errors, reset } = useForm({
        melli_code: '',
        password: '',
        remember: false as boolean,
        captcha: '',
    });

    const refreshCaptcha = () => {
        setCaptchaKey(Date.now());
        setData('captcha', '');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => {
                reset('password', 'captcha');
                refreshCaptcha();
            },
        });
    };

    return (
        <LoginLayout
            title="ورود به پنل نمایندگی"
            subtitle="برای دسترسی به پنل مدیریت، کد ملی و رمز عبور خود را وارد کنید."
        >
            <Head title="ورود به پنل نمایندگی" />

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="melli_code" value="کد ملی" />
                    <div className="relative mt-1">
                        <TextInput
                            id="melli_code"
                            type="text"
                            name="melli_code"
                            value={data.melli_code}
                            className="block w-full pr-10"
                            autoComplete="username"
                            isFocused
                            onChange={(e) => setData('melli_code', e.target.value)}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="8" r="4" />
                                <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                        </span>
                    </div>
                    <InputError message={errors.melli_code} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="رمز عبور" />
                    <div className="relative mt-1">
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="block w-full pl-10 pr-10"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="captcha" value="کد امنیتی" />
                    <div className="mt-1 flex items-center gap-3">
                        <img
                            src={`/captcha/login?${captchaKey}`}
                            alt="کد امنیتی"
                            className="h-9 cursor-pointer rounded border border-gray-300"
                            title="برای تغییر کلیک کنید"
                            onClick={refreshCaptcha}
                        />
                        <TextInput
                            id="captcha"
                            type="text"
                            name="captcha"
                            value={data.captcha}
                            className="block w-full"
                            autoComplete="off"
                            onChange={(e) => setData('captcha', e.target.value)}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">برای تغییر تصویر، روی آن کلیک کنید</p>
                    <InputError message={errors.captcha} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                        />
                        <span className="text-sm text-gray-500">مرا به خاطر بسپار</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            فراموشی رمز عبور
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    {processing ? 'در حال ورود...' : 'ورود به سیستم'}
                </PrimaryButton>
            </form>
        </LoginLayout>
    );
}
