import { Head } from '@inertiajs/react';

export default function Maintenance() {
    return (
        <div className="min-h-screen bg-[#1A1528] flex items-center justify-center px-4" dir="rtl">
            <Head title="در حال بروزرسانی" />

            <div className="text-center max-w-md">
                {/* Animated gears icon */}
                <div className="flex items-center justify-center mb-8">
                    <div className="relative">
                        <svg className="h-24 w-24 text-[#E31F25] animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-3">در حال بروزرسانی</h1>
                <p className="text-white/60 text-base leading-8 mb-8">
                    فروشگاه جی‌سان در حال تعمیر و نگهداری است.<br />
                    به زودی برمی‌گردیم.
                </p>

                <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/50">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31F25] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E31F25]" />
                    </span>
                    به‌روزرسانی در حال انجام است...
                </div>
            </div>
        </div>
    );
}
