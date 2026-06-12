import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import LoginLayout from '@/Layouts/LoginLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

type Step = 'mobile' | 'otp';

const RESEND_SECONDS = 120;

export default function CustomerLogin() {
    const [step, setStep]           = useState<Step>('mobile');
    const [mobile, setMobile]       = useState('');
    const [code, setCode]           = useState('');
    const [sending, setSending]     = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [mobileError, setMobileError] = useState('');
    const [codeError, setCodeError]     = useState('');
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const startCountdown = () => {
        setCountdown(RESEND_SECONDS);
        timerRef.current = setInterval(() => {
            setCountdown((s) => {
                if (s <= 1) { clearInterval(timerRef.current!); return 0; }
                return s - 1;
            });
        }, 1000);
    };

    const sendOtp: FormEventHandler = async (e) => {
        e.preventDefault();
        setMobileError('');
        setSending(true);

        try {
            await axios.post(route('customer.login.send-otp'), { mobile });
            setStep('otp');
            startCountdown();
        } catch (err: any) {
            const msg = err.response?.data?.errors?.mobile?.[0]
                ?? err.response?.data?.message
                ?? 'خطا در ارسال کد.';
            setMobileError(msg);
        } finally {
            setSending(false);
        }
    };

    const verifyOtp: FormEventHandler = (e) => {
        e.preventDefault();
        setCodeError('');
        setVerifying(true);

        router.post(
            route('customer.login.verify'),
            { mobile, code },
            {
                onError: (errors) => setCodeError(errors.code ?? errors.mobile ?? 'کد نامعتبر است.'),
                onFinish: () => setVerifying(false),
            },
        );
    };

    const resend = async () => {
        if (countdown > 0) return;
        setCodeError('');
        setSending(true);

        try {
            await axios.post(route('customer.login.send-otp'), { mobile });
            startCountdown();
        } catch (err: any) {
            setCodeError(err.response?.data?.message ?? 'خطا در ارسال مجدد کد.');
        } finally {
            setSending(false);
        }
    };

    return (
        <LoginLayout
            title={step === 'mobile' ? 'ورود/ثبت نام مشتریان' : 'تایید شماره موبایل'}
            subtitle={
                step === 'mobile'
                    ? 'شماره موبایل خود را وارد کنید تا کد تایید برای شما ارسال شود.'
                    : `کد ۵ رقمی ارسال شده به ${mobile} را وارد کنید.`
            }
        >
            <Head title="ورود/ثبت نام مشتریان" />

            {step === 'mobile' ? (
                <form onSubmit={sendOtp} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="mobile" value="شماره موبایل" />
                        <div className="relative mt-1">
                            <TextInput
                                id="mobile"
                                type="tel"
                                name="mobile"
                                value={mobile}
                                className="block w-full pr-10"
                                placeholder="09*********"
                                isFocused
                                onChange={(e) => setMobile(e.target.value)}
                                dir="ltr"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                        </div>
                        <InputError message={mobileError} className="mt-2" />
                    </div>

                    <PrimaryButton className="w-full justify-center" disabled={sending}>
                        {sending ? 'در حال ارسال...' : 'دریافت کد تایید'}
                    </PrimaryButton>
                </form>
            ) : (
                <form onSubmit={verifyOtp} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="code" value="کد تایید" />
                        <TextInput
                            id="code"
                            type="text"
                            inputMode="numeric"
                            name="code"
                            value={code}
                            className="mt-1 block w-full text-center tracking-[0.6em] text-xl font-bold"
                            placeholder="- - - - -"
                            maxLength={5}
                            isFocused
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            dir="ltr"
                        />
                        <InputError message={codeError} className="mt-2" />
                    </div>

                    <PrimaryButton className="w-full justify-center" disabled={verifying}>
                        {verifying ? 'در حال تایید...' : 'ورود'}
                    </PrimaryButton>

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-1">
                        {countdown > 0 ? (
                            <span>
                                ارسال مجدد تا{' '}
                                <span className="font-semibold text-gray-700 tabular-nums">{countdown}</span>
                                {' '}ثانیه دیگر
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={resend}
                                disabled={sending}
                                className="text-indigo-600 hover:underline disabled:opacity-50"
                            >
                                ارسال مجدد کد
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => { setStep('mobile'); setCode(''); setCodeError(''); }}
                            className="text-gray-400 hover:text-gray-600 hover:underline"
                        >
                            ویرایش شماره
                        </button>
                    </div>
                </form>
            )}
        </LoginLayout>
    );
}
