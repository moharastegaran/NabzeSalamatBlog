import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import loginBg from '../../images/login-bg.jpg';

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
                    className="hidden md:flex md:w-3/5 relative flex-col justify-end bg-cover"
                    style={{ backgroundImage: `url(${loginBg})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="relative z-10 p-8 text-white">
                        <Link href="/">
                            <ApplicationLogo className="w-auto mb-5 drop-shadow-lg" />
                        </Link>
                        <h2 className="text-2xl font-bold leading-snug drop-shadow">
                            پنل مدیریت سایت نبض سلامت
                        </h2>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        با ما همراه باشید تا تازه‌ترین اخبار، تحلیل‌ها و محتوای تخصصی در حوزه سلامت و دارو را دنبال کنید.
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

                </div>
            </div>
        </div>
    );
}
