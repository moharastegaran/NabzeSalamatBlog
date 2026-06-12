import {Head, Link} from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';
import React from "react";
import gsunLogoFA from "../../../images/gsun-logo-inline.png";
import gsunFlagImg from "../../../images/about-us-flag.jpg";
import gsunProductsImg from "../../../images/about-us-products.jpg";

interface Props {
    cartCount: number;
}

const SHOP_FEATURES = [
    {
        title: 'خرید اقساطی',
        subtitle: 'خرید آسان با پرداخت اقساطی جی‌سان\n\r،  ۸ طرح برای همه سبک‌های زندگی',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none"><path d="M40.5421 29.3926C37.795 29.3926 31.4062 29.722 31.4062 32.7829V46.6083C31.4062 49.6692 37.7953 49.9986 40.5421 49.9986C43.2888 49.9986 49.6779 49.6692 49.6779 46.6083V32.7829C49.6779 29.7219 43.2888 29.3926 40.5421 29.3926ZM46.695 39.8863C46.1915 40.3494 44.0039 41.1356 40.5421 41.1356C37.0802 41.1356 34.8926 40.3462 34.3891 39.8863V36.9715C36.092 37.5992 38.317 37.9037 40.5421 37.9037C42.7671 37.9037 44.9921 37.5992 46.695 36.9715V39.8863ZM40.5421 47.0181C37.2947 47.0181 35.1287 46.5022 34.3891 46.1417V43.1896C36.092 43.8173 38.317 44.1219 40.5421 44.1219C42.7671 44.1219 44.9921 43.8173 46.695 43.1896V46.1417C45.9554 46.5022 43.7895 47.0181 40.5421 47.0181Z" fill="currentColor"></path><path d="M27.3589 46.0634C26.4577 46.1784 25.5316 46.2374 24.6087 46.2374C12.6822 46.2374 2.9832 36.536 2.9832 24.6087C2.9832 12.6822 12.6846 2.98314 24.6087 2.98314C36.5321 2.98314 46.2343 12.6846 46.2343 24.6087C46.2343 25.2644 46.2063 25.9076 46.1504 26.5509C46.0789 27.3712 46.6818 28.0953 47.5021 28.1667C48.3288 28.2693 49.0497 27.6354 49.1212 26.8119C49.1864 26.0878 49.2175 25.3514 49.2175 24.6056C49.2175 11.0379 38.1764 0 24.6088 0C11.0411 0 0 11.0379 0 24.6056C0 38.1764 11.0411 49.2143 24.6088 49.2143C25.6591 49.2143 26.7094 49.1491 27.738 49.0154C28.5553 48.9098 29.1333 48.164 29.0277 47.3467C28.9251 46.5356 28.1793 45.936 27.3589 46.0634Z" fill="currentColor"></path><path d="M23.4623 13.5915V23.9954L17.6233 29.8344C17.0422 30.4124 17.0422 31.3602 17.6233 31.9412C17.9154 32.2334 18.2977 32.3794 18.6768 32.3794C19.0559 32.3794 19.4412 32.2334 19.7302 31.9412L26.0043 25.6672C26.2839 25.3875 26.4424 25.0084 26.4424 24.6138V13.5941C26.4424 12.7706 25.7743 12.1025 24.9508 12.1025C24.1273 12.1025 23.4623 12.768 23.4623 13.5915Z" fill="currentColor"></path></svg>
        ),
    },
    {
        title: 'خدمات گسترده',
        subtitle: 'از مشاوره تا نصب و گارانتی جی‌سان همواره در خدمت شماست',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none"><path d="M0.39565 21.2263C2.48957 9.19892 12.6704 0 25 0C37.3296 0 47.5104 9.19892 49.6043 21.2263C49.8644 22.7203 50 24.2577 50 25.8264C50 26.4457 49.9788 27.0592 49.9373 27.6662C49.5224 33.7172 47.0747 39.0886 43.2962 43.2304C42.4175 44.1936 41.3189 44.7377 40.1722 44.9252C38.9037 47.9082 35.9461 50 32.5 50C30.1389 50 27.7778 50 25.4167 50C23.3456 50 21.6667 48.3211 21.6667 46.25C21.6667 44.1789 23.3456 42.5 25.4167 42.5H27.0833C29.1544 42.5 30.8333 44.1789 30.8333 46.25C30.8333 46.3908 30.8256 46.5298 30.8104 46.6667H32.5C34.2368 46.6667 35.7668 45.7811 36.6631 44.4368C36.093 44.1787 35.56 43.8366 35.0905 43.42C32.8199 41.4048 32.3763 38.0751 34.0851 35.5608L38.5033 29.06C39.6642 27.3518 41.5777 26.2937 43.6491 26.1664L46.6662 25.9812L46.6665 25.9143L46.6667 25.8264C46.6667 24.4501 46.5477 23.1039 46.3204 21.7981C44.4852 11.2562 35.5993 3.33333 25 3.33333C14.4007 3.33333 5.51487 11.2562 3.67958 21.7981C3.45225 23.1039 3.33333 24.4501 3.33333 25.8264C3.33333 25.8781 3.3335 25.9296 3.33383 25.9812L6.35091 26.1664C8.42233 26.2937 10.3357 27.3518 11.4967 29.06L15.9149 35.5608C17.6237 38.0751 17.1801 41.4048 14.9095 43.42C12.6622 45.4143 8.95867 45.7021 6.70383 43.2304C2.92527 39.0886 0.477608 33.7172 0.0627416 27.6662C0.021125 27.0592 0 26.4457 0 25.8264C0 24.2577 0.135558 22.7203 0.39565 21.2263Z" fill="currentColor"></path></svg>
        ),
    },
    {
        title: 'تنوع محصول',
        subtitle: 'تنوعی کامل از محصولات و برندها برای نیازها و سلایق متنوع',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none"><path d="M11.8 20.6C16.6601 20.6 20.6 16.6601 20.6 11.8C20.6 6.93989 16.6601 3 11.8 3C6.93989 3 3 6.93989 3 11.8C3 16.6601 6.93989 20.6 11.8 20.6Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M34.6716 2.82843C36.2337 1.26633 38.7663 1.26633 40.3284 2.82843L46.1716 8.67157C47.7337 10.2337 47.7337 12.7663 46.1716 14.3284L40.3284 20.1716C38.7663 21.7337 36.2337 21.7337 34.6716 20.1716L28.8284 14.3284C27.2663 12.7663 27.2663 10.2337 28.8284 8.67157L34.6716 2.82843Z" stroke="currentColor" stroke-width="3"></path><path d="M8.0359 32C9.5755 29.3333 13.4245 29.3333 14.9641 32L19.7272 40.25C21.2668 42.9167 19.3423 46.25 16.2631 46.25H6.73686C3.65766 46.25 1.73316 42.9167 3.27276 40.25L8.0359 32Z" stroke="currentColor" stroke-width="3"></path><path d="M30.1317 34.1319C30.1317 31.9228 31.9226 30.1319 34.1317 30.1319H42.3952C44.6043 30.1319 46.3952 31.9228 46.3952 34.1319V42.3954C46.3952 44.6045 44.6043 46.3954 42.3952 46.3954H34.1317C31.9226 46.3954 30.1317 44.6045 30.1317 42.3954V34.1319Z" stroke="currentColor" stroke-width="3"></path></svg>
        ),
    }
];
const STATS = [
    { label: 'مشتری راضی',   number: '22',   prefix: 'هزار'     },
    { label: 'سال تجربه',  number: '50',   prefix: '+'  },
];

export default function AboutUs({ cartCount }: Props) {
    return (
        <ShopLayout cartCount={cartCount}>
            <Head title="درباره ما" />

            <div className="max-w-shop mx-auto px-4 sm:px-6 lg:px-0 pt-6 pb-12 space-y-12">
                {/* ── Row 1: Company intro ── */}
                <div className="grid grid-cols-1 lg:grid-cols-9 gap-3 lg:gap-8 items-stretch">

                    <div
                        className="lg:col-span-2 overflow-hidden min-h-[280px] lg:min-h-[380px] rounded-3xl"
                        style={{ backgroundImage : `url(${gsunFlagImg})`,backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>
                    </div>

                    <div className="lg:col-span-2 flex flex-col justify-center items-stretch lg:gap-4 gap-3">
                        <div className="flex flex-row justify-between lg:gap-4 gap-3">
                            {STATS.map((stat, i) => (
                                <div key={i} className="flex-1 flex flex-col bg-[#232323] rounded-3xl px-3 py-4">
                                    <div className="flex justify-center items-center lg:gap-2 gap-1">
                                        <span className="text-xl font-bold text-white">{stat.number}</span>
                                        <span className="text-white text-base font-medium">{stat.prefix}</span>
                                    </div>
                                    <p className="text-white/80 lg:text-base text-sm text-center font-normal mb-0">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <img src={gsunProductsImg} alt="محصولات جی سان" className="grow w-full rounded-3xl"/>
                    </div>

                    {/* Left 50%: About text */}
                    <div className="lg:col-span-5 flex flex-col justify-center gap-3 lg:mr-8 lg:mt-0 mt-4">
                        <div className="flex items-center justify-start gap-2 lg:mb-8">
                            <h2 className="text-3xl font-bold text-[#1A1528]">درباره</h2>
                            <img src={gsunLogoFA} alt="جی‌سان" className="h-8 object-contain" />
                        </div>
                        <p className="text-[#1F0001] leading-7 mb-2 text-base lg:text-lg text-right">
                            داریون اروند خلیج فارس از دهه ۳۰ خورشیدی با یک کارگاه خانوادگی وارد دنیای لوازم خانگی شد و امروز به برندی شناخته‌شده با نام GSun تبدیل شده است. در سال ۱۳۸۶، با ثبت General Sun، وارد مرحله‌ای جدید در واردات و مونتاژ محصولات شدیم و ده سال بعد با ثبت جهانی GSun، گامی فراتر برداشتیم.
                            <br />
                            {/*<br />*/}
                            امروز با دفاتر فروش در تهران و خوزستان، انبارهای گسترده و شبکه‌ای شامل حدود ۳۰۰ مرکز خدمات پس از فروش، در کنار مشتری‌هایمان ایستاده‌ایم. تیم متخصص ما متعهد به ارائه تجربه‌ای قابل اعتماد، پایدار و واقعی از لوازم خانگی است… چون کیفیت برای ما فقط یک شعار نیست، بلکه مسیر هر روزه ماست.
                        </p>
                    </div>
                </div>

                {/* ── Row 2: Mission & Values ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-40 items-stretch">

                    <div className="flex flex-col justify-center gap-3 lg:gap-6">
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1528]">کاتالوگ محصولات</h2>
                        <p className="text-[#1F0001] leading-7 mb-2 text-base lg:text-lg text-right">
                            نگاهی جامع به تنوع محصولات، از جزئیات فنی تا معرفی کامل هر دسته. هر کاتالوگ، نمایشی کامل از ویژگی‌ها و مشخصات محصولات ارائه می‌دهد و امکان مقایسه و بررسی دقیق را فراهم می‌کند.
                            <br />
                            این مجموعه به‌روز، مرجعی قابل اعتماد برای آشنایی با محصولات و انتخابی آگاهانه است.
                        </p>
                        <a href="/docs/gsun-catalogue.pdf" target="_blank" rel="noreferrer"
                           className="w-fit rounded-full bg-[#B8181E] text-white hover:bg-[#E31F25] font-semibold lg:px-5 px-4 py-2 transition text-base">
                            مشاهده کاتالوگ محصولات
                        </a>
                    </div>

                    <div
                        className="overflow-hidden min-h-[280px] lg:min-h-[380px] rounded-3xl"
                        style={{ backgroundImage : `url(${gsunFlagImg})`}}>
                    </div>

                </div>
            </div>

            <section className="w-full bg-[#F2F2F2] px-4 sm:px-6 lg:px-0 py-12">
                <div className="max-w-shop mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 lg:x-16">
                    {SHOP_FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl p-6 lg:p-12 flex flex-col gap-4 shadow-[2px_15px_30px_rgba(50,50,50,0.15)] hover:shadow-sm transition"
                        >
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-[#B8181E] mx-auto p-3"
                                style={{ background: 'linear-gradient(180deg, #ffffff 0%, #CDCDCD 100%)' }}
                            >
                                {f.icon}
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-[#616161] mb-2">{f.title}</h3>
                                <p className="text-sm font-medium text-[#1F0001] leading-6">{f.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </ShopLayout>
    );
}
