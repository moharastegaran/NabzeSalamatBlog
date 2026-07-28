import { Link, useForm, usePage } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import SeoHead from '@/Components/SeoHead';
import contactBG from '../../../images/contact-us.jpg';
import type { PageProps } from '@/types';
import { FormEvent, useRef, useEffect } from 'react';

const WHATSAPP_NUMBERS = [
    { display: '0902-589-5095', raw: '989025895095', label: 'خط اول' },
    { display: '0912-959-1578', raw: '989129591578', label: 'خط دوم' },
];

const INFO_CARDS = [
    {
        key: 'office',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
        ),
        title: 'دفتر مرکزی',
        accent: 'bg-[#F24F00]',
        lines: ['تهران، اتوبان همت غرب، بلوار شهید جدی اردبیلی، خیابان آوا، برج A2',''],
    },
    {
        key: 'phone',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
        ),
        title: 'تلفن و پیامک',
        accent: 'bg-[#075F26]',
        lines: ['09334155830', 'پاسخگویی: شنبه تا چهارشنبه ۹–۱۷'],
    },
    {
        key: 'whatsapp',
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
        title: 'واتساپ',
        accent: 'bg-[#075F26]',
        whatsapp: true,
    },
    {
        key: 'email',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
        title: 'ایمیل',
        accent: 'bg-[#F24F00]',
        lines: ['info@nabzesalamat.ir', 'پاسخ‌دهی: حداکثر ۴۸ ساعت کاری'],
    },
];

function InfoCard({ card }: { card: typeof INFO_CARDS[number] }) {
    return (
        <div className="bg-white border border-gray-200 flex flex-col">
            <div className={`${card.accent} p-4 flex items-center gap-3`}>
                <span className="text-white">{card.icon}</span>
                <span className="text-white font-black text-base">{card.title}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-2">
                {card.whatsapp ? (
                    <>
                        <p className="text-xs text-gray-500 mb-1">برای ارتباط مستقیم روی شماره کلیک کنید:</p>
                        {WHATSAPP_NUMBERS.map((n) => (
                            <a
                                key={n.raw}
                                href={`https://wa.me/${n.raw}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                            >
                                <span className="text-xs text-gray-400 w-12 shrink-0">{n.label}</span>
                                <span className="group-hover:underline">{n.display}</span>
                                <svg className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
                                </svg>
                            </a>
                        ))}
                    </>
                ) : (
                    card.lines?.map((line, i) => (
                        <p key={i} className={`text-sm ${i === card.lines!.length - 1 ? 'text-gray-400 text-xs mt-1 pt-1 border-t border-gray-100' : 'text-gray-700'}`}>
                            {line}
                        </p>
                    ))
                )}
            </div>
        </div>
    );
}

function SuccessBanner({ message }: { message: string }) {
    return (
        <div className="flex items-start gap-3 bg-[#075F26]/10 border border-[#075F26]/30 p-4 mb-6">
            <span className="shrink-0 mt-0.5 text-[#075F26]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
            <p className="text-sm text-[#075F26] font-semibold">{message}</p>
        </div>
    );
}

export default function Contact() {
    const { flash } = usePage<PageProps>().props;
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        phone_number: '',
        email:        '',
        subject:      '',
        message:      '',
        attachment:   null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            reset();
            if (fileRef.current) fileRef.current.value = '';
        }
    }, [flash?.success]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(route('front.contact.store'), { forceFormData: true });
    }

    return (
        <BlogLayout>
            <SeoHead
                title="تماس با ما"
                description="راه‌های ارتباط با تحریریه نبض سلامت برای ارسال خبر، گزارش و همکاری رسانه‌ای."
                url="/contact"
            />

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <div
                className="relative bg-gray-900 overflow-hidden"
                style={{
                    background: `linear-gradient(to left, rgb(17 24 39 / 0.92), rgb(17 24 39 / 0.72)), url(${contactBG}) no-repeat center center`,
                    backgroundSize: 'cover',
                }}
            >
                <div className="absolute inset-y-0 right-0 w-1.5 bg-[#F24F00]" />
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#F24F00]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F24F00]/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                    <span className="inline-block bg-[#F24F00] px-3 py-1 text-xs font-black uppercase tracking-widest text-white mb-5">
                        ارتباط با ما
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
                        تماس با نبض سلامت
                    </h1>
                    <p className="text-gray-400 text-lg leading-8 max-w-xl mb-8">
                        سوال، پیشنهاد یا همکاری دارید؟ تیم ما آماده پاسخگویی است. از طریق روش‌های زیر با ما در ارتباط باشید.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="#contact-form"
                            className="inline-flex items-center gap-2 bg-[#F24F00] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                        >
                            ارسال پیام
                            <svg className="h-4 w-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                        <Link
                            href={route('front.blog.index')}
                            className="inline-flex items-center gap-2 border border-gray-600 px-5 py-2.5 text-sm font-bold text-gray-300 hover:border-gray-400 hover:text-white transition-colors"
                        >
                            مشاهده اخبار
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">

                {/* ── 4 Info Cards ─────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
                    {INFO_CARDS.map((card) => (
                        <InfoCard key={card.key} card={card} />
                    ))}
                </div>

                {/* ── How to contact ───────────────────────────────────── */}
                <div className="mb-14 grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-1 h-6 bg-[#F24F00] shrink-0" />
                            <h2 className="text-2xl font-black text-gray-900">ارتباط با تحریریه</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 text-base leading-7">
                            <p>
                                برای ارسال اخبار، گزارش‌های اختصاصی، دعوت‌نامه‌های رسانه‌ای، اطلاعیه‌ها، مقالات، یادداشت‌های تخصصی، درخواست پوشش خبری، پیشنهادهای همکاری و سایر مکاتبات، از طریق راه‌های ارتباطی فوق با تحریریه «نبض سلامت» در ارتباط باشید.
                            </p>
                            <p>
                                نبض سلامت خود را متعهد به رعایت اصول حرفه‌ای روزنامه‌نگاری، حفظ محرمانگی منابع خبری، امانت‌داری در انتشار اطلاعات و بررسی دقیق و مسئولانه محتوای دریافتی می‌داند.
                            </p>
                            {/* decorative quote */}
                            <div className="mt-8 border-r-2 border-[#075F26] pr-4">
                                <p className="text-base text-gray-400 italic leading-6">
                                    نبض سلامت؛ روایتگر تپش سلامت جامعه
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Contact Form ─────────────────────────────────────── */}
                    <div id="contact-form" className="w-full mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-1 h-6 bg-[#F24F00] shrink-0" />
                            <h2 className="text-2xl font-black text-gray-900">ارسال پیام</h2>
                        </div>

                        {flash?.success && <SuccessBanner message={flash.success} />}

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                            <div className="grid sm:grid-cols-2 gap-5">
                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                        شماره موبایل <span className="text-[#F24F00]">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        dir="ltr"
                                        placeholder="09xxxxxxxxx"
                                        value={data.phone_number}
                                        onChange={e => { setData('phone_number', e.target.value); clearErrors('phone_number'); }}
                                        className={`w-full border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F24F00] focus:border-[#F24F00] ${errors.phone_number ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                                    />
                                    {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                        ایمیل <span className="text-gray-400 font-normal text-xs">(اختیاری)</span>
                                    </label>
                                    <input
                                        type="email"
                                        dir="ltr"
                                        placeholder="you@example.com"
                                        value={data.email}
                                        onChange={e => { setData('email', e.target.value); clearErrors('email'); }}
                                        className={`w-full border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F24F00] focus:border-[#F24F00] ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                    موضوع <span className="text-[#F24F00]">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="موضوع پیام خود را بنویسید"
                                    value={data.subject}
                                    onChange={e => { setData('subject', e.target.value); clearErrors('subject'); }}
                                    className={`w-full border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F24F00] focus:border-[#F24F00] ${errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                                />
                                {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                    متن پیام <span className="text-[#F24F00]">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="پیام خود را اینجا بنویسید..."
                                    value={data.message}
                                    onChange={e => { setData('message', e.target.value); clearErrors('message'); }}
                                    className={`w-full border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F24F00] focus:border-[#F24F00] resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.message
                                        ? <p className="text-xs text-red-600">{errors.message}</p>
                                        : <span />}
                                    <span className="text-xs text-gray-400">{data.message.length} / ۲۰۰۰</span>
                                </div>
                            </div>

                            {/* Attachment */}
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                    پیوست <span className="text-gray-400 font-normal text-xs">(اختیاری، حداکثر ۲ مگابایت)</span>
                                </label>
                                <label
                                    className={`flex items-center gap-3 border-2 border-dashed px-4 py-3 cursor-pointer transition-colors ${errors.attachment ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-[#F24F00] hover:bg-[#F24F00]/5'}`}
                                >
                                    <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                    </svg>
                                    <span className="text-sm text-gray-500 truncate">
                                    {data.attachment ? data.attachment.name : 'فایل را انتخاب کنید (jpg، png، pdf، doc)'}
                                </span>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                        onChange={e => {
                                            const file = e.target.files?.[0] ?? null;
                                            setData('attachment', file);
                                            clearErrors('attachment');
                                        }}
                                    />
                                </label>
                                {data.attachment && (
                                    <button
                                        type="button"
                                        onClick={() => { setData('attachment', null); if (fileRef.current) fileRef.current.value = ''; }}
                                        className="mt-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        حذف فایل
                                    </button>
                                )}
                                {errors.attachment && <p className="mt-1 text-xs text-red-600">{errors.attachment}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F24F00] px-8 py-3 text-sm font-black text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        در حال ارسال...
                                    </>
                                ) : (
                                    <>
                                        ارسال پیام
                                        <svg className="h-4 w-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </BlogLayout>
    );
}
