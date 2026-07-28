import SeoHead from '@/Components/SeoHead';
import ApplicationLogo from '@/Components/ApplicationLogo';

const css = `
@keyframes hb-draw {
    0%   { stroke-dashoffset: 320; opacity: 1; }
    60%  { stroke-dashoffset: 0;   opacity: 1; }
    85%  { stroke-dashoffset: 0;   opacity: 0; }
    100% { stroke-dashoffset: 320; opacity: 0; }
}
.hb-path {
    stroke-dasharray: 320;
    animation: hb-draw 2.4s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:.2} 50%{opacity:1} }
.d1{animation:blink 1.2s 0.0s infinite}
.d2{animation:blink 1.2s 0.2s infinite}
.d3{animation:blink 1.2s 0.4s infinite}
`;

export default function Maintenance() {
    return (
        <>
            <SeoHead
                title="بروزرسانی سایت"
                description="سایت نبض سلامت در حال بروزرسانی است. لطفاً کمی بعد مراجعه کنید."
                url="/maintenance"
                noindex
            />
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className="min-h-screen bg-[#041906] flex flex-col items-center justify-center px-4 py-12" dir="rtl">

                {/* ── Card ─────────────────────────────────────── */}
                <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden">

                    {/* Orange top bar */}
                    <div className="h-1.5 bg-[#F24F00]" />

                    <div className="flex flex-col items-center text-center px-8 pt-10 pb-8">

                        {/* Logo */}
                        <ApplicationLogo className="h-20 w-auto mb-8" />

                        {/* Animated heartbeat line */}
                        <div className="w-full mb-7 select-none" aria-hidden="true">
                            <svg viewBox="0 0 280 64" fill="none" className="w-full overflow-visible">
                                <line x1="0" y1="32" x2="280" y2="32" stroke="#e5e7eb" strokeWidth="1.5" />
                                <path
                                    className="hb-path"
                                    d="M0,32 L54,32 L64,32 L72,6 L82,56 L92,18 L100,44 L108,32 L226,32 L280,32"
                                    stroke="#F24F00"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                            </svg>
                        </div>

                        {/* Animated working dots */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
                            <span>در حال به‌روزرسانی</span>
                            <span className="d1 inline-block w-1.5 h-1.5 rounded-full bg-[#F24F00]" />
                            <span className="d2 inline-block w-1.5 h-1.5 rounded-full bg-[#F24F00]" />
                            <span className="d3 inline-block w-1.5 h-1.5 rounded-full bg-[#F24F00]" />
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-3">
                            سایت موقتاً در دسترس نیست
                        </h1>

                        {/* Body text */}
                        <p className="text-sm text-gray-500 leading-7 max-w-xs mb-7">
                            تیم نبض سلامت در حال ارتقاء و بهبود خدمات است.
                            <br />
                            به زودی با تجربه‌ای بهتر برمی‌گردیم.
                        </p>

                        {/* Contact buttons */}
                        <div className="w-full border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
                            <a
                                href="tel:989129591578"
                                className="flex flex-1 items-center justify-center gap-2 border border-gray-200 hover:border-[#F24F00] hover:text-[#F24F00] text-gray-600 text-sm font-semibold py-2.5 transition-colors"
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span dir="ltr">0912-959-1578</span>
                            </a>

                            <a
                                href="https://wa.me/989129591578"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-2.5 transition-colors"
                            >
                                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                واتساپ
                            </a>
                        </div>

                    </div>

                    {/* Dark footer strip */}
                    <div className="bg-[#f2f2f2] px-8 py-3 text-center text-[11px] text-gray-900">
                        © {new Date().getFullYear()} نبض سلامت — تمامی حقوق محفوظ است
                    </div>

                </div>
            </div>
        </>
    );
}
