import { Head, Link, router } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';
import { Product, ProductVariation } from '@/types/models';
import { formatPrice } from '@/utils/currency';
import { useState, useRef } from 'react';
import axios from 'axios';
import num2persian from 'num2persian';

interface Props {
    product: Product;
    cartCount: number;
}

const Sep = () => (
    <svg className="w-3.5 h-3.5 text-[#D5D5D5] flex-shrink-0 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


const NAME_YOUR_PRICE_ID   = 149;
const NAME_YOUR_PRICE_UNIT = 10000;

export default function Show({ product, cartCount: initialCartCount }: Props) {
    const images = (product.images ?? []).map(img => `/storage/${img}`);
    const [activeImage, setActiveImage] = useState(0);
    const [cartCount] = useState(initialCartCount);

    // ── Name-your-price mode ──────────────────────────────────────────────────
    const isNameYourPrice = product.id === NAME_YOUR_PRICE_ID;
    const [customPrice, setCustomPrice] = useState(''); // raw digits, no commas
    const nypVariation   = isNameYourPrice ? (product.variations[0] ?? null) : null;
    const nypAmount      = Number(customPrice);

    const formatWithCommas = (raw: string) =>
        raw ? Number(raw).toLocaleString('en-US') : '';

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '').replace(/\D/g, '');
        setCustomPrice(raw);
    };
    const nypQty         = nypAmount > 0 && nypAmount % NAME_YOUR_PRICE_UNIT === 0
        ? nypAmount / NAME_YOUR_PRICE_UNIT
        : null;
    const nypValid       = nypQty !== null;

    // ── Normal variation selection ────────────────────────────────────────────
    const attributeTypes = (() => {
        const map: Record<string, { typeId: number; isVariant: boolean; key: string; name: string; values: { id: number; label: string; value: string }[] }> = {};
        for (const v of product.variations) {
            for (const a of v.attributes) {
                const k = String(a.type.id);
                if (!map[k]) map[k] = { typeId: a.type.id, isVariant: a.type.is_variant, key: k, name: a.type.name, values: [] };
                if (!map[k].values.find(x => x.id === a.id)) {
                    map[k].values.push({ id: a.id, label: a.label, value: a.value });
                }
            }
        }
        return Object.values(map);
    })();

    // Only is_variant types drive the selector and price resolution
    const variantAttributeTypes = attributeTypes.filter(t => t.isVariant);
    const productAttributeTypes = attributeTypes.filter(t => !t.isVariant);

    const [selected, setSelected] = useState<Record<string, number>>(() => {
        if (product.product_type !== 'simple' && product.variations.length !== 1) return {};
        const init: Record<string, number> = {};
        for (const a of product.variations[0]?.attributes ?? []) {
            if (a.type?.is_variant) init[String(a.type.id)] = a.id;
        }
        return init;
    });

    const matchedVariation = ((): ProductVariation | null => {
        if (isNameYourPrice) return null;
        if (!variantAttributeTypes.length) return product.variations[0] ?? null;
        if (Object.keys(selected).length < variantAttributeTypes.length) return null;
        return product.variations.find(v =>
            v.attributes
                .filter(a => a.type.is_variant)
                .every(a => selected[String(a.type.id)] === a.id)
        ) ?? null;
    })();

    const detailsRef = useRef<HTMLDivElement>(null);
    const scrollToDetails = () => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const [adding, setAdding] = useState(false);
    const [feedback, setFeedback] = useState<{ msg: string } | null>(null);

    const addToCart = async () => {
        setAdding(true);
        setFeedback(null);
        try {
            if (isNameYourPrice) {
                if (!nypVariation || !nypValid || nypQty === null) { setAdding(false); return; }
                await axios.post(route('cart.add'), {
                    variation_id: nypVariation.id,
                    quantity: nypQty,
                });
            } else {
                if (!matchedVariation) { setAdding(false); return; }
                await axios.post(route('cart.add'), {
                    variation_id: matchedVariation.id,
                    quantity: 1,
                });
            }
            router.visit(route('checkout.index'));
        } catch {
            setFeedback({ msg: 'خطا در افزودن به سبد خرید' });
            setAdding(false);
        }
    };

    const primaryCategory = product.categories?.[0];
    const parentCategory  = primaryCategory?.parent;

    const minPrice = product.variations.length
        ? Math.min(...product.variations.map(v => Number(v.price)))
        : null;

    return (
        <ShopLayout cartCount={cartCount}>
            <Head title={product.title} />

            {/* Breadcrumb */}
            <div className="max-w-shop mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4">
                <nav className="flex items-center gap-1.5 text-sm text-[#898A89]" aria-label="breadcrumb">
                    <Link href={route('shop.landing')} className="hover:text-[#B8181E] transition-colors whitespace-nowrap">خانه</Link>
                    <Sep />
                    <Link href={route('shop.index')} className="hover:text-[#B8181E] transition-colors whitespace-nowrap">فروشگاه</Link>
                    {parentCategory && (
                        <>
                            <Sep />
                            <Link href={route('shop.index', { category_id: parentCategory.id })} className="hover:text-[#B8181E] transition-colors whitespace-nowrap">
                                {parentCategory.name}
                            </Link>
                        </>
                    )}
                    {primaryCategory && (
                        <>
                            <Sep />
                            <Link href={route('shop.index', { category_id: primaryCategory.id })} className="hover:text-[#B8181E] transition-colors whitespace-nowrap">
                                {primaryCategory.name}
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Product section */}
            <div className="bg-[#F2F2F2] border-t border-gray-100">
                <div className="max-w-shop mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">

                        {/* ── Col 1: Title + description ── */}
                        <div className="col-span-1 flex flex-col gap-1">
                            <h1 className="grow text-2xl font-semibold text-[#1F0001] leading-snug mb-3">
                                {product.title}
                            </h1>

                            {product.shortdesc && (
                                <>
                                    <div
                                        className="text-xs leading-8 text-[#555] leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.shortdesc }}
                                    />
                                    {(productAttributeTypes.length > 0 || product.description) && (
                                        <button
                                            onClick={scrollToDetails}
                                            className="flex items-center gap-1 text-sm font-medium text-[#E31F25] hover:text-[#B8181E] group transition-colors w-fit my-1"
                                        >
                                            <span>مشاهده بیشتر</span>
                                            <svg
                                                className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            )}

                            <div className="mt-5">
                                <h6 className="text-sm font-bold text-[#404040] uppercase tracking-wide border-b-2 border-[#40404022] mb-3 w-fit pb-1">ضمانت و شرایط خرید</h6>
                                <ul className="space-y-2.5">
                                    <li className="flex items-center gap-2 text-sm text-[#767676]">
                                        <svg className="w-5 h-5 text-[#767676] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                        ارسال توسط فروشگاه
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#767676]">
                                        <svg className="w-5 h-5 text-[#767676] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        گارانتی اصالت و سلامت فیزیکی کالا
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#767676]">
                                        <svg className="w-5 h-5 text-[#767676] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        ضمانت تعویض کالا
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#767676]">
                                        <svg className="w-5 h-5 text-[#767676] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        هزینه حمل به عهده خریدار
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* ── Col 2: Image gallery ── */}
                        <div className="col-span-1 flex flex-col gap-2" style={{height : 'stretch'}}>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm aspect-square flex items-center justify-center h-full">
                                {images.length > 0 ? (
                                    <img
                                        src={images[activeImage]}
                                        alt={product.title}
                                        className="w-full h-full object-contain p-5 transition-opacity duration-200"
                                    />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#D5D5D5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-xl bg-white overflow-hidden border-2 transition-all ${
                                                activeImage === i
                                                    ? 'border-[#B8181E] shadow-sm'
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Col 3: Purchase panel ── */}
                        <div className="col-span-1 bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-5">

                            {isNameYourPrice ? (
                                /* ── Name-your-price UI ── */
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#404040] mb-2">
                                            مبلغ مورد نظر را وارد کنید
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={formatWithCommas(customPrice)}
                                                onChange={handlePriceChange}
                                                placeholder="مثلاً ۵۰٬۰۰۰"
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#B8181E] tabular-nums ltr text-right"
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#898A89] pointer-events-none">ریال</span>
                                        </div>
                                        <p className="text-xs text-[#898A89] mt-1.5">
                                            مبلغ باید مضرب ۱۰٬۰۰۰ ریال باشد
                                        </p>
                                        {nypAmount > 0 && (
                                            <p className="mt-2 text-sm text-[#404040] leading-relaxed">
                                                {num2persian(nypAmount)} ریال
                                            </p>
                                        )}
                                    </div>

                                    {customPrice !== '' && !nypValid && (
                                        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                                            مبلغ وارد شده باید مضربی از ۱۰٬۰۰۰ ریال باشد.
                                        </p>
                                    )}

                                    <button
                                        onClick={addToCart}
                                        disabled={adding || !nypValid}
                                        className="w-full bg-[#B8181E] hover:bg-[#B8181E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm tracking-wide"
                                    >
                                        {adding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                                    </button>
                                </div>
                            ) : (
                                /* ── Normal variation UI ── */
                                <>
                                    {variantAttributeTypes.map(attrType => {
                                        const allColors = attrType.isVariant;
                                        const selectedLabel = attrType.values.find(v => v.id === selected[attrType.key])?.label;

                                        return (
                                            <div key={attrType.key}>
                                                <div className="flex items-baseline gap-2 mb-3">
                                                    <span className="text-sm font-semibold text-[#404040]">{attrType.name}:</span>
                                                    {selectedLabel && (
                                                        <span className="text-sm text-[#B8181E] font-medium">{selectedLabel}</span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-5">
                                                    {allColors ? (
                                                        attrType.values.map(val => (
                                                            <button
                                                                key={val.id}
                                                                onClick={() => setSelected(s => ({ ...s, [attrType.key]: val.id }))}
                                                                className="flex flex-col items-center gap-2.5 group"
                                                            >
                                                                <span
                                                                    className={`w-7 h-7 rounded-full transition-all duration-150 ${
                                                                        selected[attrType.key] === val.id
                                                                            ? 'ring-2 ring-offset-2 ring-[#B8181E] scale-110'
                                                                            : 'ring-1 ring-gray-200 group-hover:scale-110'
                                                                    }`}
                                                                    style={{ backgroundColor: `#${val.value}` }}
                                                                />
                                                                <span className="text-xs leading-none transition-colors text-[#1F0001] font-semibold group-hover:text-[#404040]">
                                                                    {val.label}
                                                                </span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        attrType.values.map(val => (
                                                            <button
                                                                key={val.id}
                                                                onClick={() => setSelected(s => ({ ...s, [attrType.key]: val.id }))}
                                                                className={`px-4 py-1.5 rounded-lg text-sm border-2 transition ${
                                                                    selected[attrType.key] === val.id
                                                                        ? 'border-[#B8181E] bg-[#FEF2F2] text-[#B8181E] font-semibold'
                                                                        : 'border-gray-200 text-[#616161] hover:border-gray-300 bg-white'
                                                                }`}
                                                            >
                                                                {val.label}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="border-t border-gray-100 pt-4 grow">
                                        {matchedVariation ? (
                                            <p className="text-2xl font-bold text-[#1F0001] tabular-nums">
                                                {formatPrice(matchedVariation.price)}
                                            </p>
                                        ) : minPrice !== null ? (
                                            <p className="text-xl font-bold text-[#898A89]">
                                                از&nbsp;<span className="text-[#1F0001]">{formatPrice(minPrice)}</span>
                                            </p>
                                        ) : null}

                                        {matchedVariation && (
                                            <p className={`text-xs mt-1.5 font-medium ${matchedVariation.stock > 0 ? 'text-gray-600' : 'text-red-500'}`}>
                                                {matchedVariation.stock > 0 ? 'موجود در انبار' : 'ناموجود'}
                                            </p>
                                        )}
                                    </div>

                                    {!matchedVariation && variantAttributeTypes.length > 0 && (
                                        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                                            لطفاً ویژگی‌های محصول را انتخاب کنید.
                                        </p>
                                    )}

                                    {matchedVariation && (
                                        <button
                                            onClick={addToCart}
                                            disabled={adding || matchedVariation.stock === 0}
                                            className="w-full bg-[#B8181E] hover:bg-[#B8181E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm tracking-wide"
                                        >
                                            {adding ? 'در حال افزودن...' : matchedVariation.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
                                        </button>
                                    )}
                                </>
                            )}

                            {feedback && (
                                <div className="rounded-xl px-4 py-2.5 text-sm bg-red-50 text-red-700 border border-red-200">
                                    {feedback.msg}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <div className="bg-white" ref={detailsRef}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* ── Product-level attributes table ── */}
                    {productAttributeTypes.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold text-[#B8181E] mb-4 rounded-lg border-b-2 border-[#B8181E] max-w-min px-16 py-2">مشخصات</h2>
                            <div className="overflow-hidden rounded-xl border border-gray-100 p-2 mt-8">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <tbody className="divide-y divide-gray-200">
                                    {productAttributeTypes.map((attrType, i) => (
                                        <tr key={attrType.key} className="bg-white">
                                            <td className="px-5 py-4 text-base font-semibold text-[#616161] w-1/3 whitespace-nowrap">{attrType.name}</td>
                                            <td className="px-5 py-4 text-base text-[#1F0001] font-bold">{attrType.values[0]?.label ?? '—'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* ── Product description ── */}
                    {product.description && (
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-[#B8181E] mb-4 rounded-lg border-b-2 border-[#B8181E] max-w-min px-16 py-2">توضیحات</h2>
                            <div
                                className="prose prose-sm max-w-none text-[#1F0001] text-medium leading-relaxed mt-8"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}
