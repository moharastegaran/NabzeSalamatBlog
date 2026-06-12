import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import loginBg from '../../images/login-bg.webp';

interface Props extends PropsWithChildren {
    title: string;
    subtitle: string;
}

export default function LoginLayout({ children, title, subtitle }: Props) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden">

                {/* ── Left panel: decorative image ── */}
                <div
                    className="hidden md:flex md:w-3/5 relative flex-col justify-end bg-cover bg-left"
                    style={{ backgroundImage: `url(${loginBg})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="relative z-10 p-8 text-white">
                        <Link href="/">
                            <ApplicationLogo className="h-14 w-auto mb-5 drop-shadow-lg" />
                        </Link>
                        <h2 className="text-2xl font-bold leading-snug drop-shadow">
                            سیستم مدیریت فروش اعتباری جی‌سان
                        </h2>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">
                            فروشگاه لوازم خانگی با امکان خرید اقساطی
                        </p>
                    </div>
                </div>

                {/* ── Right panel: form ── */}
                <div className="w-full md:w-2/5 bg-white flex flex-col justify-center px-8 py-10">

                    {/* Logo — only visible on mobile (desktop shows it in image panel) */}
                    <div className="flex flex-col items-center mb-6 md:hidden">
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-auto" />
                        </Link>
                    </div>

                    <div className="mb-7">
                        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed">{subtitle}</p>
                    </div>

                    {children}

                    {/* Quick access links */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center mb-3" dir="rtl">دسترسی سریع</p>
                        <div className="flex flex-wrap justify-center gap-2" dir="rtl">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                صفحه اصلی
                            </Link>
                            <Link
                                href="/shop"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                فروشگاه
                            </Link>
                            <Link
                                href="/shop/search"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                جستجوی محصولات
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
