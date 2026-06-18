import { Head, Link } from '@inertiajs/react';

interface Props {
    status: 403 | 404 | 500 | 503;
}

const config: Record<number, { title: string; description: string; icon: JSX.Element }> = {
    403: {
        title: 'دسترسی ممنوع',
        description: 'شما مجاز به مشاهده این صفحه نیستید.',
        icon: (
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
    404: {
        title: 'صفحه پیدا نشد',
        description: 'صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابجا شده است.',
        icon: (
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    500: {
        title: 'خطای سرور',
        description: 'مشکلی در سمت سرور رخ داده است. لطفاً کمی بعد دوباره تلاش کنید.',
        icon: (
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    503: {
        title: 'سرویس در دسترس نیست',
        description: 'سرور موقتاً در دسترس نیست. لطفاً بعداً مراجعه کنید.',
        icon: (
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 6.343a9 9 0 000 12.728m2.829-9.9a5 5 0 000 7.072" />
            </svg>
        ),
    },
};

export default function Error({ status }: Props) {
    const { title, description, icon } = config[status] ?? config[404];

    const accentColor = status === 403
        ? 'from-amber-500 to-orange-500'
        : status === 404
            ? 'from-[#F24F00] to-rose-400'
            : status === 503
                ? 'from-blue-500 to-indigo-500'
                : 'from-gray-600 to-gray-800';

    const iconBg = status === 403
        ? 'bg-amber-50 text-amber-500'
        : status === 404
            ? 'bg-rose-50 text-[#F24F00]'
            : status === 503
                ? 'bg-blue-50 text-blue-500'
                : 'bg-gray-100 text-gray-500';

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-16" dir="rtl">
            <Head title={`${status} — ${title}`} />

            {/* Card */}
            <div className="w-full max-w-md">

                {/* Gradient top bar */}
                <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-l ${accentColor}`} />

                <div className="bg-white rounded-b-2xl shadow-xl px-8 py-10 text-center">

                    {/* Icon */}
                    <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${iconBg}`}>
                        {icon}
                    </div>

                    {/* Status code */}
                    <p className={`mb-1 bg-gradient-to-l ${accentColor} bg-clip-text text-7xl font-black tracking-tight text-transparent`}>
                        {status}
                    </p>

                    {/* Title */}
                    <h1 className="mt-3 text-2xl font-bold text-gray-900">{title}</h1>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-7 text-gray-500">{description}</p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={route('front.landing')}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#F24F00] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C24000] transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            بازگشت به خانه
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            صفحه قبلی
                        </button>
                    </div>
                </div>

                {/* Footer note */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    سایت خبری نبض سلامت &mdash; کد خطا {status}
                </p>
            </div>

            {/* Decorative blobs */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className={`absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br ${accentColor} opacity-5 blur-3xl`} />
                <div className={`absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr ${accentColor} opacity-5 blur-3xl`} />
            </div>
        </div>
    );
}
