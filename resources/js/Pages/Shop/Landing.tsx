import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';

import { Product, ProductCategory, Banking } from '@/types/models';
import React, { useState, useEffect, useRef } from 'react';
import slideBg1 from '../../../images/خرید-تسهیلات-رفاه-بازنشستگان-جی-سان-1.jpg';
import slideBg3 from '../../../images/slider-bg-5.jpg';
import slideBg2 from '../../../images/slider-bg-1-min.webp';
import bannerBg1 from '../../../images/banners/banner-grid-11-min-2048x949.jpg';
import bannerBg2 from '../../../images/banners/banner-grid-12-min-2048x947.jpg';
import bannerBg3 from '../../../images/banners/banner-grid-13-min-2048x950.jpg';
import bannerBg4 from '../../../images/banners/banner-grid-14-min-2048x949.jpg';
import statsBg from '../../../images/1m.jpg';
import daryoonLogo from '../../../images/daryoon-arvand.jpg';
import servicesBg from '../../../images/services-bg.jpg';
import belowcatShape from '../../../images/shapes/belowcat-halfcircle.svg';
import salesPromoActiveBg from '../../../images/shapes/sales-promo-active-bg.svg';

import refrigeratorFill from '../../../images/caticons/refrigerator fill.svg';
import refrigeratorLine from '../../../images/caticons/refrigerator line.svg';
import dishwasherFill   from '../../../images/caticons/dishwasher fill.svg';
import dishwasherLine   from '../../../images/caticons/dishwasher line.svg';
import ovenFill         from '../../../images/caticons/oven fill.svg';
import ovenLine         from '../../../images/caticons/oven line.svg';
import splitFill        from '../../../images/caticons/split fill.svg';
import splitLine        from '../../../images/caticons/split line.svg';
import washingFill      from '../../../images/caticons/washing machine fill.svg';
import washingLine      from '../../../images/caticons/washing machine line.svg';
import tvLine           from '../../../images/caticons/tv line.svg';
import tvFill           from '../../../images/caticons/tv fill.svg';
import ironLine         from '../../../images/caticons/iron line.svg';
import ironFill         from '../../../images/caticons/iron fill.svg';

import gsunLogoFA from '../../../images/gsun-logo-inline.png';
import belowCatHalfCircle from '../../../images/shapes/belowcat-halfcircle.svg';
import bpayment1 from '../../../images/bankings/1.jpg'
import bpayment2 from '../../../images/bankings/2.jpg'
import bpayment3 from '../../../images/bankings/3.jpg'
import bpayment4 from '../../../images/bankings/4.jpg'
import bpayment5 from '../../../images/bankings/5.jpg'
import bpayment6 from '../../../images/bankings/6.jpg'
import bpayment7 from '../../../images/bankings/7.jpg'
import bpayment8 from '../../../images/bankings/8.jpg'


interface Props {
    categories: (ProductCategory & { products_count: number })[];
    categoryProducts: Record<number, Product[]>;
    paymentBanks: Banking[];
    cartCount: number;
    featuredProducts: { on_sale: Product[]; newest: Product[]; bestseller: Product[] };
    saleEndsAt: string;
}

interface SlideGridLink {
    icon: React.ReactNode;
    href: string;
}

interface WhyFeature {
    title: string;
    icon: React.ReactNode;
    items: string[];
}

// ─────────────────────────────────────────────────────────────
// Slide data (static — swap with DB-driven data when ready)
// ─────────────────────────────────────────────────────────────
const SLIDES = [
    {
        title: 'خرید لوازم خانگی اقساطی',
        subtitle: 'ویژه بازنشستگان تامین اجتماعی \n\r تا 3 میلیارد ریال تسهیلات طرح بتا',
        cta: 'مشاهده و خرید',
        from: '#1A152800',
        to: '#B8181E00',
        bg: slideBg1,
        customHTML: '<ul class="flex flex-col gap-0">\n' +
            '\t\t\t\t\t\t\t<li class="flex gap-1 align-center justify-start">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<span class="w-[25px]">\n' +
            '\t\t\t\t\t\t\t<svg style="width: 25px" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 512 512"><defs><style>      .st2 {        fill: none;        stroke: #B8181E;        stroke-miterlimit: 10;        stroke-width: 7px;      }    </style></defs><rect class="st2" x="25.09" y="116.23" width="460.87" height="279.9" rx="10.04" ry="10.04"></rect><g><g><path d="M113.1,262.79c23.19-1.7,48.22-1.42,71.44-.12,21.52,1.43,40.54,16.39,46.59,37.11,4.3,14.71,2.34,31.83,2.15,47.2-.11,3.43-2.85,6.16-6.27,6.27H71.32c-3.29-.1-5.94-2.64-6.25-5.88-1.57-18.34-2.22-32.99,2.23-47.91,6.04-20.25,24.72-35.12,45.8-36.67Z" fill="#B8181E"></path><path d="M145.04,159.29c36.62-3.11,61.58,35.89,43.26,67.92-18.34,32.06-66.24,29.16-80.72-4.83-12.03-28.22,6.88-60.5,37.46-63.1Z" fill="#B8181E"></path></g><g><rect x="277.47" y="158.88" width="169.7" height="15.03" rx="4.09" ry="4.09" fill="#B8181E"></rect><rect x="277.47" y="302.55" width="169.7" height="15.03" rx="4.09" ry="4.09" fill="#B8181E"></rect><rect x="277.47" y="266.63" width="169.7" height="15.03" rx="4.09" ry="4.09" fill="#B8181E"></rect><rect x="277.47" y="230.71" width="169.7" height="15.03" rx="4.09" ry="4.09" fill="#B8181E"></rect><rect x="277.47" y="194.8" width="169.7" height="15.03" rx="4.09" ry="4.09" fill="#B8181E"></rect><rect x="277.47" y="338.46" width="87.35" height="15.03" rx="4.09" ry="4.09" fill="#B8181E"></rect></g></g></svg>\t\t\t\t\t\t</span>\n' +
            '\t\t\t\t\t\t\t\t\t\t<span class="text-sm font-medium text-[#1F0001] leading-7">فقط با کارت ملی</span>\n' +
            '\t\t\t\t\t\t\t\t\t</li>\n' +
            '\t\t\t\t\t\t\t\t<li class="flex gap-1 align-center justify-start">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<span class="w-[25px]">\n' +
            '\t\t\t\t\t\t\t<svg style="width: 25px" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 512 512"><defs><style>      .st0 {        fill: #B8181E;      }      .st1 {        stroke: #B8181E;        stroke-miterlimit: 10;        stroke-width: 7px;      }    </style></defs><g><path fill="#B8181E" d="M164.59,235.66c42.31-3.11,87.96-2.59,130.31-.21,39.25,2.61,73.94,29.9,84.98,67.69,7.84,26.83,4.26,58.06,3.93,86.11-.2,6.25-5.2,11.24-11.43,11.43H88.38c-6.01-.18-10.83-4.81-11.4-10.72-2.86-33.45-4.06-60.18,4.06-87.39,11.01-36.93,45.1-64.07,83.55-66.9Z"></path><path d="M222.85,46.86c66.8-5.67,112.33,65.46,78.91,123.9-33.45,58.49-120.82,53.19-147.25-8.81-21.94-51.47,12.55-110.36,68.34-115.09Z" fill="#fefefe" class="st1"></path></g><circle class="st1" cx="369.81" cy="391.86" r="74.78" fill="#fefefe"></circle><g><path class="st0" d="M392.02,373.57c6.34-.98,13.15,2.35,13.04,9.07-.18,10.3-.49,21.69-.23,32.09.12,4.81-2.82,9.28-7.42,10.69-.2.06-.4.12-.61.17l-50.63.11c-4.66-.65-8.54-4.33-9.08-9.08-.89-7.91-.65-24.94-.02-33.07.57-7.41,5.94-10.84,13.06-10.45.14-5.58-.57-11.08.95-16.5,5.42-19.24,33.67-19.63,39.76-.7.02.06.04.13.06.19.34,1.05.54,2.13.58,3.23l.54,14.25ZM386.9,373.11v-11.87c0-7.81-8.62-14.24-16.06-14.24-7.32,0-15.6,6.67-15.6,14.24v11.87h31.66ZM398.38,419.04c.85-.85,1.42-2.6,1.55-3.8.81-7.1.66-23.49.02-30.74-.33-3.7-1.54-5.72-5.35-5.82-16.16-.42-30.97-.44-47.52,0-2.71-.13-4.54,2.43-4.88,4.9-.3,10.48-.07,22.43,0,31.22.03,3.83,1.99,5.71,5.82,5.82,15.62.43,29.11.08,46.12,0,1.34-.01,3.3-.63,4.25-1.57Z"></path><path class="st0" d="M370.5,389.02c4.12-.46,6.93,4.02,5.34,7.71-.45,1.04-1.73,1.45-1.97,2.69-.53,2.77,1.55,10.26-2.57,10.51-4.73.28-2.48-7.62-3.03-10.51-.24-1.24-1.52-1.65-1.97-2.69-1.38-3.22.58-7.3,4.2-7.71Z"></path></g><path class="st0" d="M234.37,356.69v-7.46c7.63-.4,13.43-2.47,17.91-6.23,4.48-3.76,6.72-8.75,6.72-14.53,0-6.23-1.81-10.82-5.82-13.74-4.05-3.31-9.85-5.83-18.38-7.46h-.43v-19.14c5.82.84,10.76,2.47,15.67,5.83l7.18-9.14c-7.18-4.6-14.81-7.07-22.87-7.46v-5.01h-6.72v4.99c-6.72.4-12.57,2.47-17.05,6.23-4.48,3.76-6.72,8.75-6.72,14.53s1.81,10.38,5.82,13.29c3.57,2.92,9.85,5.39,17.91,7.07v19.52c-6.29-.84-12.57-3.76-18.81-8.75l-8.06,8.75c8.06,6.67,17.05,10.38,26.9,11.22v7.5h6.75,0ZM234.8,320.52c4.48,1.24,7.18,2.47,8.96,3.76,1.33,1.68,2.24,3.31,2.24,5.83s-.91,4.15-3.15,5.83-4.96,2.47-8.06,2.92v-18.34ZM219.14,302.66c-1.33-1.24-2.24-3.31-2.24-5.39,0-2.47.91-4.15,2.67-5.83,2.24-1.68,4.48-2.47,8.06-2.92v17.89c-4.48-1.28-7.15-2.52-8.48-3.76Z"></path></svg>\t\t\t\t\t\t</span>\n' +
            '\t\t\t\t\t\t\t\t\t\t<span class="text-sm font-medium text-[#1F0001]  leading-7">بدون مراجعه به بانک، پیش‌قسط و ضامن</span>\n' +
            '\t\t\t\t\t\t\t\t\t</li>\n' +
            '\t\t\t\t\t\t</ul>',
    },
    {
        title: 'طرح‌های خرید اقساطی',
        subtitle: '',
        cta: 'مشاهده و خرید',
        from: '#1F000100',
        to: '#E31F2500',
        bg: slideBg2,
        customHTML: `<img loading="lazy" width="140" src="${gsunLogoFA}" className="inline-block max-w-[40%]" alt="">`,
        grid: [
            { icon: <img src={bpayment1} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment2} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment3} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment4} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment5} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment6} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment7} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
            { icon: <img src={bpayment8} className="w-fit object-cover object-center rounded-full" alt="" aria-hidden="true" />, href: '/shop' },
        ] as SlideGridLink[],
    },
    {
        title: 'تازگی هر روز و هر آن',
        subtitle: 'با یخچال فریزرهای \r\n دوقلوی جی‌سان',
        cta: 'مشاهده و خرید',
        from: '#1A152800',
        to: '#61616100',
        bg: slideBg3,
        customHTML: '',
    },
];

// Statistics for About section
const STATS = [
    { label: 'سال تجربه',   number: '50',   prefix: '+'     },
    { label: 'مشتری راضی',  number: '20',   prefix: 'هزار'  },
    { label: 'رضایت مشتری', number: '100',  prefix: '%'     },
];

// Banner data (static)
const BANNERS = [
    { title: 'حس کافه تو خونه', subtitle: 'با کافی میکرهای جی‌سان می‌مونه', from: '#1A1528', to: '#B8181E', bg: bannerBg1 },
    { title: 'آشپزی سریع و آسان', subtitle: 'با دستگاه‌های غذاساز جی‌سان', from: '#1F0001', to: '#E31F25', bg: bannerBg2 },
    { title: 'تازگی هر روز و هر آن', subtitle: 'با یخچال فریزرهای دوقلوی جی‌سان‌', from: '#404040', to: '#1A1528', bg: bannerBg3 },
    { title: 'خنک در تابستان\r\n\r گرم در زمستان', subtitle: 'با اسپلیت جی‌سان',  from: '#B8181E', to: '#1F0001', bg: bannerBg4 },
];

const WHY_GSUN_FEATURES: WhyFeature[] = [
    {
        title: 'نصب و راه‌اندازی',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28 27" fill="none"><path d="M13.9375 17.9224C11.35 17.9224 9.25 15.8224 9.25 13.2349C9.25 10.6474 11.35 8.54736 13.9375 8.54736C16.525 8.54736 18.625 10.6474 18.625 13.2349C18.625 15.8224 16.525 17.9224 13.9375 17.9224ZM13.9375 10.4224C12.3875 10.4224 11.125 11.6849 11.125 13.2349C11.125 14.7849 12.3875 16.0474 13.9375 16.0474C15.4875 16.0474 16.75 14.7849 16.75 13.2349C16.75 11.6849 15.4875 10.4224 13.9375 10.4224Z" fill="black" stroke="black"></path><path d="M17.95 25.9727C17.6875 25.9727 17.425 25.9352 17.1625 25.8727C16.3875 25.6602 15.7375 25.1727 15.325 24.4852L15.175 24.2352C14.4375 22.9602 13.425 22.9602 12.6875 24.2352L12.55 24.4727C12.1375 25.1727 11.4875 25.6727 10.7125 25.8727C9.925 26.0852 9.1125 25.9727 8.425 25.5602L6.275 24.3227C5.5125 23.8852 4.9625 23.1727 4.725 22.3102C4.5 21.4477 4.6125 20.5602 5.05 19.7977C5.4125 19.1602 5.5125 18.5852 5.3 18.2227C5.0875 17.8602 4.55 17.6477 3.8125 17.6477C1.9875 17.6477 0.5 16.1602 0.5 14.3352V12.1352C0.5 10.3102 1.9875 8.82272 3.8125 8.82272C4.55 8.82272 5.0875 8.61022 5.3 8.24772C5.5125 7.88522 5.425 7.31022 5.05 6.67272C4.6125 5.91022 4.5 5.01022 4.725 4.16022C4.95 3.29772 5.5 2.58522 6.275 2.14772L8.4375 0.910221C9.85 0.0727214 11.7125 0.560221 12.5625 1.99772L12.7125 2.24772C13.45 3.52272 14.4625 3.52272 15.2 2.24772L15.3375 2.01022C16.1875 0.560221 18.05 0.0727214 19.475 0.922721L21.625 2.16022C22.3875 2.59772 22.9375 3.31022 23.175 4.17272C23.4 5.03522 23.2875 5.92272 22.85 6.68522C22.4875 7.32272 22.3875 7.89772 22.6 8.26022C22.8125 8.62272 23.35 8.83522 24.0875 8.83522C25.9125 8.83522 27.4 10.3227 27.4 12.1477V14.3477C27.4 16.1727 25.9125 17.6602 24.0875 17.6602C23.35 17.6602 22.8125 17.8727 22.6 18.2352C22.3875 18.5977 22.475 19.1727 22.85 19.8102C23.2875 20.5727 23.4125 21.4727 23.175 22.3227C22.95 23.1852 22.4 23.8977 21.625 24.3352L19.4625 25.5727C18.9875 25.8352 18.475 25.9727 17.95 25.9727ZM13.9375 21.3477C15.05 21.3477 16.0875 22.0477 16.8 23.2852L16.9375 23.5227C17.0875 23.7852 17.3375 23.9727 17.6375 24.0477C17.9375 24.1227 18.2375 24.0852 18.4875 23.9352L20.65 22.6852C20.975 22.4977 21.225 22.1852 21.325 21.8102C21.425 21.4352 21.375 21.0477 21.1875 20.7227C20.475 19.4977 20.3875 18.2352 20.9375 17.2727C21.4875 16.3102 22.625 15.7602 24.05 15.7602C24.85 15.7602 25.4875 15.1227 25.4875 14.3227V12.1227C25.4875 11.3352 24.85 10.6852 24.05 10.6852C22.625 10.6852 21.4875 10.1352 20.9375 9.17272C20.3875 8.21022 20.475 6.94772 21.1875 5.72272C21.375 5.39772 21.425 5.01022 21.325 4.63522C21.225 4.26022 20.9875 3.96022 20.6625 3.76022L18.5 2.52272C17.9625 2.19772 17.25 2.38522 16.925 2.93522L16.7875 3.17272C16.075 4.41022 15.0375 5.11022 13.925 5.11022C12.8125 5.11022 11.775 4.41022 11.0625 3.17272L10.925 2.92272C10.6125 2.39772 9.9125 2.21022 9.375 2.52272L7.2125 3.77272C6.8875 3.96022 6.6375 4.27272 6.5375 4.64772C6.4375 5.02272 6.4875 5.41022 6.675 5.73522C7.3875 6.96022 7.475 8.22272 6.925 9.18522C6.375 10.1477 5.2375 10.6977 3.8125 10.6977C3.0125 10.6977 2.375 11.3352 2.375 12.1352V14.3352C2.375 15.1227 3.0125 15.7727 3.8125 15.7727C5.2375 15.7727 6.375 16.3227 6.925 17.2852C7.475 18.2477 7.3875 19.5102 6.675 20.7352C6.4875 21.0602 6.4375 21.4477 6.5375 21.8227C6.6375 22.1977 6.875 22.4977 7.2 22.6977L9.3625 23.9352C9.625 24.0977 9.9375 24.1352 10.225 24.0602C10.525 23.9852 10.775 23.7852 10.9375 23.5227L11.075 23.2852C11.7875 22.0602 12.825 21.3477 13.9375 21.3477Z" fill="currentColor" stroke="currentColor"></path></svg>
        ),
        items: [
            'نصب الزامی یا ترجیحی برای انواع لوازم',
            'نصب رایگان در دوره ضمانت'
        ]
    },
    {
        title: 'تعمیرات تخصصی',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 26 26" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.13027 0.601796C15.342 -0.801375 21.3707 6.15799 18.9551 13.0955L24.3708 18.5112C26.947 21.0874 25.1565 25.5779 21.4404 25.5779V25.5812C20.3792 25.5812 19.3169 25.1773 18.5101 24.3717L13.0955 18.956C6.15715 21.3717 -0.801335 15.3429 0.601807 8.13004C0.765584 7.28901 1.59554 6.80211 2.37569 6.99577V6.99688C2.628 7.05996 2.85927 7.18943 3.04961 7.37977L8.09248 12.4226C8.22196 12.5521 8.37578 12.5931 8.55173 12.5466C8.98329 12.4315 11.4753 11.8328 11.6558 11.6525C11.8306 11.4776 12.4337 8.97558 12.5477 8.5507C12.5941 8.37475 12.5532 8.22092 12.4237 8.09146L7.37972 3.04859L7.38083 3.04748C6.55863 2.22418 6.9902 0.823193 8.12999 0.601886L8.13027 0.601796ZM12.3519 2.13888C11.0671 1.74714 9.70155 1.67853 8.38467 1.93526L8.31274 2.04703H8.31385C8.31717 2.06141 8.32602 2.0758 8.3393 2.08797H8.34151L13.3844 7.13084C13.8547 7.60116 14.0306 8.25848 13.8591 8.90252L13.0856 11.7895C12.9141 12.4314 12.4305 12.915 11.7887 13.0865L8.90248 13.86C8.25845 14.0326 7.6011 13.8556 7.13081 13.3853L2.04601 8.31378L1.93535 8.38571C0.698164 14.7785 7.03233 19.9474 13.0157 17.5374L13.4318 17.3692L19.4727 23.4101C20.0127 23.9501 20.7276 24.2213 21.4414 24.2213V24.2246C23.9335 24.2246 25.1409 21.2047 23.41 19.4738L17.3691 13.4318C18.0707 11.69 18.3485 10.2006 17.9645 8.31383C17.3702 5.40131 15.2046 3.00858 12.3519 2.13888Z" fill="currentColor" stroke="currentColor" stroke-width="0.838759"></path></svg>
        ),
        items: [
            'عیب‌یابی و تعمیر قطعات',
            'تست و تحویل سالم دستگاه'
        ]
    },
    {
        title: 'تعویض کالا',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 29 27" fill="none"><path d="M26.9726 17.979L19.4668 25.4998" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.5 17.979H26.9689" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.5 9.02082L9.00584 1.5" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26.9689 9.01953H1.5" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        ),
        items: [
            'در صورت عیب ذاتی یا تکراری',
            'تعویض یا استرداد وجه'
        ]
    },
    {
        title: 'قطعات یدکی و لوازم جانبی',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 30 22" fill="none"><path d="M24.5086 18.8853L24.5467 14.4546L25.8748 14.4673C27.6912 14.4492 29.2247 13.1105 29.4884 11.3128C29.6744 10.1641 29.3431 8.99167 28.584 8.11106C27.9393 7.3216 26.9766 6.86147 25.9575 6.85486L24.5621 6.87114L24.5711 2.41125C24.5605 1.80123 24.3235 1.21531 23.9044 0.770849C23.4872 0.311832 22.8986 0.0433593 22.2778 0.03031L18.5342 0.0227285C17.245 0.0564924 16.2256 1.1244 16.2503 2.41353L16.2478 3.63532C16.3098 4.45724 15.8055 5.21529 15.0232 5.47552C14.6358 5.55109 14.2342 5.44301 13.9375 5.18151C13.5655 4.82803 13.3555 4.33671 13.3584 3.82398L13.3231 2.40757C13.353 1.11858 12.3379 0.0465314 11.0489 0.00754628L7.30531 -3.49678e-05C6.68169 -0.00313618 6.08661 0.264756 5.67567 0.733909C5.2593 1.18851 5.02901 1.78439 5.03139 2.40074L4.99333 6.83148L3.6652 6.81879C1.84883 6.83692 0.315267 8.1756 0.0515975 9.97324C-0.134371 11.1219 0.196887 12.2944 0.955992 13.175C1.60348 13.9599 2.56435 14.4201 3.58248 14.4312L4.97794 14.4149L4.96891 18.8748C4.96403 19.4912 5.19189 20.088 5.60643 20.5443L5.68354 20.6217C6.09632 21.038 6.65676 21.2728 7.24309 21.2748L10.9867 21.2824C11.6121 21.271 12.2072 21.0104 12.6399 20.5576C13.0727 20.1049 13.3066 19.4981 13.2897 18.8726L13.2925 17.4963L13.2916 17.4954C13.2807 17.0326 13.4525 16.5839 13.7695 16.2463C14.052 15.9306 14.4641 15.7632 14.885 15.7923C15.7236 16.0076 16.2866 16.7933 16.2194 17.6567L16.2169 18.8785C16.187 20.1675 17.2021 21.2396 18.4911 21.2786L22.2347 21.2862C22.8583 21.2893 23.4534 21.0214 23.8643 20.5522C24.2807 20.0976 24.511 19.5017 24.5086 18.8853ZM22.2289 19.2198L18.4853 19.2122C18.4372 19.1639 18.3111 19.0373 18.2633 18.8727L18.2657 17.6509C18.3551 15.7202 16.9739 14.0328 15.0646 13.7372C14.014 13.6296 12.975 14.0312 12.2698 14.817C11.6102 15.5356 11.2473 16.4776 11.2554 17.4531L11.2526 18.8294C11.2431 19.033 11.1255 19.1682 11.0292 19.168L7.28561 19.1604C7.23752 19.1122 7.11142 18.9855 7.0736 18.8109L7.06462 13.3619C7.06517 13.0892 6.95843 12.8272 6.7661 12.6341C6.57012 12.4464 6.31125 12.3377 6.03946 12.3326L3.54678 12.3367C3.14771 12.3258 2.77265 12.1406 2.52054 11.8309C2.16048 11.4111 2.0089 10.8508 2.10635 10.3074C2.21887 9.51492 2.88915 8.9199 3.69008 8.90425L6.04638 8.9181C6.61366 8.91925 7.07457 8.4602 7.07572 7.89292L7.08776 2.40486C7.08816 2.21032 7.20483 2.05601 7.30118 2.05621L11.0448 2.0638C11.0448 2.0638 11.2189 2.23869 11.2668 2.40332L11.264 3.77964C11.2508 4.92324 11.7422 6.01238 12.6061 6.75959C13.3502 7.41563 14.3487 7.70581 15.329 7.55145C17.0999 7.12867 18.3285 5.51673 18.2659 3.69745L18.2584 2.46563C18.2679 2.26202 18.3854 2.12681 18.4818 2.12701L22.2254 2.13459C22.3217 2.13478 22.4095 2.3195 22.4374 2.4841L22.4263 7.97309C22.4251 8.54037 22.8842 9.00128 23.4514 9.00243L25.9933 8.94939C26.3924 8.9602 26.7674 9.1455 27.0195 9.45511C27.3796 9.87493 27.5312 10.4352 27.4337 10.9787C27.3212 11.7711 26.6509 12.3662 25.85 12.3818L23.4937 12.3679C22.9264 12.3668 22.4655 12.8258 22.4644 13.3931L22.4532 18.8821C22.4428 19.0848 22.3353 19.2301 22.2389 19.2299L22.2289 19.2198Z" fill="currentColor"></path></svg>
        ),
        items: [
            'حداقل 10 سال برای لوازم خانگی ثابت',
            'حداقل 5 سال برای لوازم خانگی کوچک'
        ]
    },
    {
        title: 'پشتیبانی و ضمانت',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 25 30" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.17488 19.7946L3.05786 19.4489C2.91026 19.0154 2.62703 18.6404 2.24937 18.3798L1.8438 18.1005C0.270702 17.0181 -0.388854 15.0181 0.232133 13.2125L0.34383 12.888C0.496752 12.4399 0.496752 11.9532 0.34383 11.5037L0.232133 11.1806C-0.390182 9.37349 0.269364 7.37477 1.8438 6.29122L2.24937 6.01198C2.62703 5.75268 2.91025 5.37768 3.05786 4.94287L3.22275 4.4575C3.80918 2.72883 5.43413 1.56662 7.25974 1.56928L8.00839 1.57193C8.4432 1.57193 8.86872 1.44029 9.2251 1.19162L9.84874 0.759464C11.3075 -0.252491 13.2409 -0.253818 14.701 0.759464L15.3247 1.19295C15.6811 1.44028 16.1052 1.57193 16.5401 1.57061L17.29 1.56928C19.1158 1.56662 20.7395 2.7288 21.3257 4.4575L21.4919 4.94287C21.6395 5.37768 21.9227 5.75268 22.3004 6.01198L22.7059 6.29123C24.279 7.37497 24.9386 9.37359 24.3176 11.1806L24.2059 11.5038C24.0517 11.9532 24.0517 12.4399 24.2059 12.888L24.3176 13.2125C24.9386 15.0183 24.279 17.0183 22.7059 18.1005L22.3004 18.3798C21.9227 18.6391 21.6395 19.0154 21.4919 19.4489L21.327 19.9356C21.3217 19.9489 21.3177 19.9622 21.3137 19.9755L24.0291 24.68C24.4227 25.3595 24.408 26.1999 23.9945 26.8661C23.5809 27.5323 22.8336 27.9179 22.0504 27.8674L20.9135 27.7943L20.4095 28.8142C20.0611 29.5176 19.355 29.9737 18.5705 29.9977C17.7859 30.023 17.0519 29.6147 16.6596 28.9352L13.8591 24.0857C12.7993 24.5112 11.6052 24.4939 10.5561 24.0298L7.72502 28.9352C7.33143 29.6147 6.59739 30.0229 5.81283 29.999C5.02828 29.9724 4.32219 29.5176 3.97513 28.8155L3.46982 27.7943L2.3329 27.8674C1.551 27.9179 0.80368 27.5336 0.388815 26.8661C-0.0247224 26.1999 -0.0380325 25.3595 0.354242 24.68L3.17488 19.7946ZM15.6879 22.9966L18.5016 27.8714L19.0069 26.8514C19.3873 26.0815 20.1944 25.6161 21.0521 25.6706L22.1877 25.7437L19.9603 21.8862C19.2197 22.4792 18.2849 22.825 17.2902 22.8223L16.5402 22.821C16.2463 22.8196 15.9551 22.8809 15.6879 22.9966ZM20.0071 17.7123C20.2996 17.2895 20.6666 16.9211 21.0948 16.6273L21.5004 16.348C22.2863 15.8068 22.6174 14.8068 22.3062 13.9039L22.1945 13.5795C21.8874 12.6832 21.886 11.7098 22.1945 10.8123L22.3062 10.4891C22.6161 9.58492 22.2876 8.58491 21.5004 8.04372L21.0935 7.76447C20.3395 7.24455 19.7717 6.49588 19.4778 5.62625L19.313 5.14089C19.0191 4.27654 18.2066 3.69545 17.2944 3.6981H16.5444C15.6748 3.70076 14.8264 3.43481 14.111 2.94013L13.4873 2.50797C12.7586 2.00133 11.7919 2.00133 11.0619 2.50664L10.4382 2.94013C9.72415 3.43479 8.8758 3.70075 8.00481 3.69943L7.25617 3.6981C6.34262 3.69544 5.53148 4.27653 5.2376 5.14221L5.07271 5.62757C4.77884 6.49591 4.21105 7.24588 3.45574 7.76447L3.05016 8.04371C2.26295 8.58627 1.93452 9.58488 2.24433 10.4891L2.35603 10.8123C2.6632 11.7085 2.66453 12.6832 2.35603 13.5795L2.24433 13.9039C1.9345 14.8068 2.26295 15.8068 3.05016 16.348L3.45574 16.6273C3.84003 16.8919 4.17514 17.2163 4.45173 17.5847C4.71768 17.9411 4.92776 18.3386 5.07271 18.7655L5.2376 19.2509C5.31739 19.4849 5.4344 19.6963 5.58067 19.8838C5.97695 20.3865 6.58994 20.6963 7.25617 20.695L8.00613 20.6937C8.24815 20.6923 8.48884 20.7136 8.72554 20.7535C9.33856 20.8572 9.92363 21.0952 10.4382 21.4529L11.0619 21.8851C11.2414 22.0088 11.4329 22.1019 11.6337 22.1657C12.0033 22.2827 12.3983 22.296 12.7746 22.2056C13.0246 22.1444 13.2679 22.038 13.4887 21.8851L14.111 21.4529C14.5552 21.1458 15.0498 20.9264 15.5698 20.8054C15.8876 20.7309 16.2147 20.6923 16.5445 20.6937L17.2945 20.695C17.9075 20.6963 18.4753 20.433 18.8715 19.9995C19.0644 19.7881 19.2159 19.5341 19.313 19.2509L19.4766 18.7655C19.6056 18.3892 19.785 18.0342 20.0071 17.7123ZM12.2759 4.37483C16.5924 4.37616 20.0963 7.87874 20.0963 12.1952C20.0963 16.5117 16.5924 20.017 12.2745 20.017C7.95806 20.017 4.45416 16.5117 4.45416 12.1966C4.45416 7.87874 7.95942 4.37483 12.2759 4.37483ZM12.2759 6.50243C9.13369 6.50243 6.58176 9.05423 6.58176 12.1966C6.58176 15.3389 9.13223 17.8894 12.2745 17.8894C15.4181 17.8894 17.9687 15.3376 17.9687 12.1952C17.9687 9.05433 15.4169 6.5038 12.2759 6.50243ZM9.31322 13.1579C8.897 12.743 8.897 12.0688 9.31322 11.654C9.72812 11.2391 10.4023 11.2391 10.8172 11.654L11.5552 12.392L13.7852 10.1633C14.2001 9.7484 14.8743 9.7484 15.2892 10.1633C15.7041 10.5782 15.7041 11.2537 15.2892 11.6686L12.3079 14.6486C11.893 15.0635 11.2188 15.0648 10.8026 14.6486L9.31322 13.1579ZM4.47829 21.7932L2.19778 25.7438L3.33337 25.6706C4.18972 25.6148 4.99688 26.0815 5.3772 26.8515L5.88251 27.8714L8.72686 22.9445C8.49814 22.8621 8.25613 22.8209 8.01011 22.8209L7.26014 22.8222C6.21496 22.8235 5.23494 22.4435 4.47829 21.7932Z" fill="currentColor"></path></svg>
        ),
        items: [
            'خدمات در محل مشتری در دوره ضمانت',
            'ضمانت 24 تا 60 ماه بسته به نوع کالا',
            'پشتیبانی و پیگیری از طریق سامانه خدمات',
            'راهنمای استفاده و آموزش ایمن محصول'
        ]
    },
];

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

// ─────────────────────────────────────────────────────────────
// Promo section
// ─────────────────────────────────────────────────────────────
const PROMO_TABS = [
    {
        key: 'on_sale' as const,
        label: 'تخفیفات',
        sectionTitle: 'تخفیفات شگفت انگیز',
        description: 'را از دست ندهید!'
    },
    {
        key: 'newest' as const,
        label: 'جدیدترین‌ها',
        sectionTitle: 'از جدیدترین محصولات',
        description: 'سایت جی سان دیدن کنید.',
    },
    {
        key: 'bestseller' as const,
        label: 'پرفروش‌ترین‌ها',
        sectionTitle: 'محصولات پرفروش',
        description: 'مورد اعتماد مشتریان جی‌سان هستند.',
    },
] as const;

type PromoTabKey = typeof PROMO_TABS[number]['key'];

function calcCountdown(target: string) {
    const ms = Math.max(0, new Date(target).getTime() - Date.now());
    return {
        days:    Math.floor(ms / 86_400_000),
        hours:   Math.floor((ms % 86_400_000) / 3_600_000),
        minutes: Math.floor((ms % 3_600_000) / 60_000),
    };
}

type CategoryIconEntry = { default: string; active: string };

const CATEGORY_ICONS: Record<string, CategoryIconEntry> = {
    'یخچال و فریزر':   { default: refrigeratorLine, active: refrigeratorFill },
    'ماشین ظرفشویی':  { default: dishwasherLine,   active: dishwasherFill   },
    'اجاق گاز':        { default: ovenLine,          active: ovenFill         },
    'کولر گازی':       { default: splitLine,         active: splitFill        },
    'ماشین لباسشویی': { default: washingLine,       active: washingFill      },
    'تلویزیون':        { default: tvLine,            active: tvFill           },
    'اقلام ریز آشپزخانه':   { default: ironLine,          active: ironFill         },
};

// ─────────────────────────────────────────────────────────────
// Hero Slider
// ─────────────────────────────────────────────────────────────
function HeroSlider() {
    const [active, setActive] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const go = (idx: number) => setActive(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 4500);
    };

    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    return (
        <div className="relative overflow-hidden min-h-[60vh] lg:min-h-[85vh] rounded-2xl lg:rounded-[40px] sm:mt-2">
            {/* Slides */}
            {SLIDES.map((slide, i) => (
                <div
                    key={i}
                    aria-hidden={i !== active}
                    className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-700 ${i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    style={{
                        backgroundImage: `url(${slide.bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: '13%'
                            // ? `linear-gradient(135deg, ${slide.from}CC 0%, ${slide.to}CC 100%), url(${slide.bg}) center/cover no-repeat`
                            // : `linear-gradient(135deg, ${slide.from} 0%, ${slide.to} 100%)`,
                    }}
                >
                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }} />

                    {/* Category shortcut grid (slide 2 only) */}
                    {slide.grid && (
                        <div className="w-fit lg:w-[350px] inset-x-4 sm:inset-x-8 z-10 mb-3 lg:mb-8 mx-8 md:mr-24">
                            <div className="grid grid-cols-4 gap-1.5 lg:gap-2.5">
                                {slide.grid.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className="flex items-center justify-center aspect-square overflow-hidden bg-white/85 rounded-full hover:bg-white hover:shadow-md transition"
                                    >
                                        {item.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="relative flex flex-col gap-0 z-10 text-right text-dark w-[250px] lg:w-[350px] min-h-[220px] lg:min-h-[275px] mx-8 mb-12 md:mb-16 md:mr-24 px-4 py-4 md:px-7 md:pt-7 md:pb-5 border border-white/30 bg-white/60 backdrop-blur-2xl shadow-xl lg:rounded-[40px] rounded-[25px]">
                        <h3 className="text-2xl md:text-3xl font-extrabold mb-2 text-[#404040]">{slide.title}</h3>
                        {slide.subtitle && (
                            <p className={`grow text-[#404040] text-base font-medium md:text-xl whitespace-pre-line mb-3`}>{slide.subtitle}</p>
                        )}
                        {slide.customHTML && (
                            <div className="grow mt-1 mb-4" dangerouslySetInnerHTML={{ __html: slide.customHTML }} />
                        )}
                        <Link
                            href={route('shop.index')}
                            className="inline-flex items-center justify-between bg-white text-[#B8181E] font-bold lg:font-semibold px-2.5 py-2.5 rounded-full hover:bg-[#F2F2F2] transition lg:text-2xl text-lg shadow-xl w-full"
                        >
                            <span className="grow text-center">{slide.cta}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 flex-shrink-0 bg-[#B8181E] p-2 rounded-full" style={{ transform: 'scaleX(-1)' }} fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                            </svg>
                        </Link>
                    </div>
                </div>
            ))}

            {/* Dot navigation */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 items-center">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { go(i); resetTimer(); }}
                        aria-label={`اسلاید ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${i === active ? 'bg-[#E31F25] w-10 h-4' : 'bg-[#404040]/40 w-4 h-4 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────────────────────
export default function Landing({ categories, categoryProducts, paymentBanks, cartCount, featuredProducts, saleEndsAt }: Props) {
    const firstCatId = categories[3]?.id ?? categories[0]?.id ?? null;
    const [activeTab, setActiveTab] = useState<number | null>(firstCatId);

    const activeProducts: Product[] = activeTab != null
        ? (categoryProducts as Record<string, Product[]>)[String(activeTab)] ?? []
        : [];

    const enrichedCategories = categories.map(cat => ({
        ...cat,
        icon:       CATEGORY_ICONS[cat.name]?.default ?? null,
        activeIcon: CATEGORY_ICONS[cat.name]?.active  ?? null,
    }));

    const [mobilePage, setMobilePage] = useState(0);

    useEffect(() => { setMobilePage(0); }, [activeTab]);

    const [whySlide, setWhySlide] = useState(0);
    const WHY_SLIDE_GROUPS = [[0, 1], [2, 3], [4]];

    const bankingScrollRef  = useRef<HTMLDivElement>(null);
    const productScrollRef  = useRef<HTMLDivElement>(null);

    // ── Promo section ──
    const [promoTab, setPromoTab] = useState<PromoTabKey>(
        () => featuredProducts.on_sale.length > 0 ? 'on_sale' : 'newest'
    );
    const [carouselIdx, setCarouselIdx] = useState(0);
    const promoTrackRef = useRef<HTMLDivElement>(null);
    const promoTouchStartX = useRef<number | null>(null);
    const [countdown, setCountdown] = useState(() => calcCountdown(saleEndsAt));

    // Sync scroll position when carouselIdx changes
    useEffect(() => {
        const el = promoTrackRef.current;
        if (!el) return;
        const item = el.children[carouselIdx] as HTMLElement | undefined;
        if (item) el.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
    }, [carouselIdx]);

    // Auto-advance carousel
    useEffect(() => {
        const products = featuredProducts[promoTab] ?? [];
        if (!products.length) return;
        const timer = setInterval(() => {
            setCarouselIdx(i => (i + 1 >= products.length ? 0 : i + 1));
        }, 3500);
        return () => clearInterval(timer);
    }, [promoTab, featuredProducts]);

    // Reset index on tab switch
    useEffect(() => { setCarouselIdx(0); }, [promoTab]);

    // Countdown tick (every minute)
    useEffect(() => {
        const timer = setInterval(() => setCountdown(calcCountdown(saleEndsAt)), 60_000);
        return () => clearInterval(timer);
    }, [saleEndsAt]);

    const scrollBanks = (direction: 'prev' | 'next') => {
        const el = bankingScrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction === 'next' ? -220 : 220, behavior: 'smooth' });
    };

    const scrollProducts = (direction: 'prev' | 'next') => {
        const el = productScrollRef.current;
        if (!el) return;
        // Scroll by half the visible strip width so user always sees full cards.
        el.scrollBy({ left: direction === 'next' ? -(el.clientWidth / 2) : (el.clientWidth / 2), behavior: 'smooth' });
    };

    return (
        <ShopLayout cartCount={cartCount} floatingHeader>
            <Head title="فروشگاه جی‌سان" />

            {/* ───────────────────────────────────────────────────
                Section 1 · Hero Slider  (full viewport width)
            ─────────────────────────────────────────────────── */}
            <section className="relative pb-12 max-w-shop mx-auto px-4 sm:px-6 lg:px-0 pb-16 mt-4 sm:mt-0 rounded-3xl">
                <HeroSlider />
                <svg width="172" height="128" viewBox="0 0 172 128" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="block lg:hidden"
                     style={{
                         position: 'absolute',
                         top: '-6px',
                         left: 'unset',
                         right: '0px',
                         zIndex: 10,
                         overflowX: 'hidden',
                         maxWidth : '100%'
                     }}>
                    <path d="M0 0H170.5V127.812C175 127.812 160 127.812 170.5 127.812H155V81.5C155 70.5 148 61.5 136.5 61.5H46.5C29.4612 61.5 24.339 47.5 24.25 38.5C24.2326 36.738 24.25 30.9035 24.25 29C24.25 21.5 16.5655 6 0 6V0Z" fill="white"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="1390" height="183" viewBox="0 0 1390 183" fill="none"
                     className="hidden lg:block"
                     style={{
                         position: 'absolute',
                         top: '-31px',
                         left: '-70px',
                         right: '-1px',
                         zIndex: 10,
                         overflowX: 'hidden',
                         maxWidth : 'calc(100% + 2px)'
                     }}>
                    <path d="M0 0H1390V183C1390 144 1356.5 119 1326.5 119H675.5C648.538 119 629 96.5 629 70.5C629 48 614.315 25.8853 582.5 24C582.5 24 110.773 24 108.5 24H44.8859C22.2965 24 3.15448 40.6319 0 63V24V0Z" fill="white"/>
                </svg>
                <svg style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '47px',
                    maxWidth: '100%',
                    transform: 'translateX(-50%)',
                    // overflowX: 'hidden',
                    zIndex: 10,
                    display: 'block'
                }} width="358" height="42" viewBox="0 0 358 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M86.825 26.5465H0V42H179.276H358V26.5465H272.631C248.962 26.5465 242.05 0 219.847 0H179.276H140.446C118.244 0 112.169 26.5465 86.825 26.5465Z" fill="white"></path>
                </svg>
            </section>
            {/* ───────────────────────────────────────────────────
                Section 2 · Category Tabs + Product Carousel
            ─────────────────────────────────────────────────── */}
            {categories.length > 0 && (
                <section id="products-sections-landing" className="max-w-shop mx-auto px-4 sm:px-0 lg:px-0 pb-16 overflow-hidden">
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1528] mb-6 text-center">دسته بندی محصولات</h2>

                    {/* ── < lg: vertical sidebar + products row ── */}
                    {/* ── lg+: horizontal tabs row above products  ── */}
                    <div className="flex flex-row lg:flex-col gap-0 lg:gap-0 items-stretch">

                        {/* Category tabs */}
                        <div className="shrink lg:flex-shrink-0 flex flex-col justify-between lg:flex-row gap-1.5 lg:gap-3 lg:justify-around lg:px-6 lg:pb-0 lg:mb-0 lg:relative lg:z-10">
                            {enrichedCategories.map(cat => {
                                const isActive = activeTab === cat.id;
                                const icon = isActive ? (cat.activeIcon ?? cat.icon) : cat.icon;
                                return (
                                    <div key={cat.id} className={`transition-all${isActive ? ' translate-y-[20px]' : ''}`}>
                                        <button
                                            onClick={() => setActiveTab(cat.id)}
                                            className={`relative flex flex-col items-center justify-center gap-2 rounded-r-xl lg:rounded-full text-xs font-semibold transition-all
                                                px-0 py-4 w-[52px] sm:w-[72px]
                                                lg:w-[110px] lg:h-[110px]
                                                ${isActive
                                                    ? 'bg-[#E31F25] text-white shadow lg:bg-[#F2F2F2] lg:text-[#404040] lg:shadow-none'
                                                    : 'z-20 text-[#404040] hover:bg-[#F2F2F233]'
                                                }`}
                                        >
                                            {isActive && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute top-0 -z-[1] bg-no-repeat bg-bottom bg-contain pointer-events-none"
                                                    style={{ left: '-50%', right: '-50%', bottom: '-22%', backgroundImage: `url(${belowcatShape})` }}
                                                />
                                            )}
                                            {icon && (
                                                <img src={icon} alt="" aria-hidden="true" className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex-shrink-0" />
                                            )}
                                            <span className="text-center leading-tight">{cat.name}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Products panel */}
                        <div className="flex-1 min-w-0 bg-[#F2F2F2] rounded-l-2xl lg:rounded-3xl px-3 sm:px-0 pt-7 pb-0 lg:pt-20 flex flex-col gap-4">
                            {activeProducts.length > 0 ? (
                                <>
                                    {/* ── Mobile (< lg): 2 stacked cards + bottom arrows ── */}
                                    <div className="lg:hidden flex flex-col gap-8">
                                        {activeProducts.slice(mobilePage * 2, mobilePage * 2 + 2).map(p => (
                                            <div key={p.id} />
                                        ))}
                                        <div className="flex items-center justify-center gap-4 pt-1">
                                            <button
                                                onClick={() => setMobilePage(pg => Math.max(0, pg - 1))}
                                                disabled={mobilePage === 0}
                                                aria-label="قبلی"
                                                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#616161] hover:text-[#E31F25] disabled:opacity-30 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setMobilePage(pg => Math.min(Math.ceil(activeProducts.length / 2) - 1, pg + 1))}
                                                disabled={mobilePage >= Math.ceil(activeProducts.length / 2) - 1}
                                                aria-label="بعدی"
                                                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#616161] hover:text-[#E31F25] disabled:opacity-30 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Desktop (lg+): horizontal scroll carousel + side arrows ── */}
                                    <div className="hidden lg:flex items-center gap-5 mx-3 sm:mx-5 mx-7">
                                        <button
                                            onClick={() => scrollProducts('prev')}
                                            aria-label="قبلی"
                                            className="flex-shrink-0 w-7 h-10 sm:-mr-6 mr-0 rounded-full bg-white shadow flex items-center justify-center text-[#616161] hover:text-[#E31F25] hover:shadow-md transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <div
                                            ref={productScrollRef}
                                            className="flex flex-1 min-w-0 gap-4 overflow-x-auto"
                                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                                        >
                                            {activeProducts.map(p => (
                                                <div key={p.id} className="flex-shrink-0 w-[calc(25%_-_12px)]" />
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => scrollProducts('next')}
                                            aria-label="بعدی"
                                            className="flex-shrink-0 w-7 h-10 sm:-ml-6 ml-0 rounded-full bg-white shadow flex items-center justify-center text-[#616161] hover:text-[#E31F25] hover:shadow-md transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="relative flex justify-center lg:justify-end mt-7">
                                        <svg viewBox="0 0 135 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block absolute left-0 bottom-0 w-[160px] z-10">
                                            <path d="M1.17338e-08 0C0 15 12.5 22.5 22 22.5H89C103 22.5 114 34.5 114 48.5C114 61 125.5 70 135 70H1.17338e-08V0Z" fill="white"></path>
                                        </svg>
                                        <svg viewBox="0 0 186 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="block lg:hidden absolute left-1/2 -bottom-7 -translate-x-1/2 w-full z-10">
                                            <path d="M0 27V46L92.4512 46L185.806 45.9999V27.0001C162.137 27.0001 158.377 0 136.175 0H92.4512H52.175C26.2288 0 27.675 27.0001 0 27Z" fill="white"></path>
                                        </svg>
                                        <Link
                                            href={route('shop.index', { category_id: activeTab ?? undefined })}
                                            className="rounded-full bg-[#B8181E] text-white hover:bg-[#E31F25] font-semibold px-5 py-2 transition text-base z-20 lg:mb-1 -mb-3"
                                        >
                                            مشاهده همه
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-[#898A89] py-8">محصولی یافت نشد</div>
                            )}
                        </div>

                    </div>
                </section>
            )}

            {/* ───────────────────────────────────────────────────
                Section 3 · Payment Plans Slider
            ─────────────────────────────────────────────────── */}
            {paymentBanks.length > 0 && (
                <section className="bg-[#FFFFFF] lg:py-14 py-6 lg:px-0">
                    <div className="max-w-shop mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1528]">طرح‌های خرید اقساطی</h2>
                            {/* Arrows */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scrollBanks('prev')}
                                    className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#616161] hover:border-[#E31F25] hover:text-[#E31F25] transition"
                                    aria-label="قبلی"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => scrollBanks('next')}
                                    className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#616161] hover:border-[#E31F25] hover:text-[#E31F25] transition"
                                    aria-label="بعدی"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Horizontal scroll container */}
                        <div
                            ref={bankingScrollRef}
                            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {paymentBanks.map(bank => (
                                <Link
                                    key={bank.id}
                                    href={route('shop.banking.plan', { banking: bank.id })}
                                    className="flex-shrink-0 snap-start w-28 sm:w-36 bg-white rounded-2xl p-2 sm:p-5 flex flex-col items-center gap-0 sm:gap-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#E31F25]/30 transition"
                                    style={{
                                        background : "linear-gradient(to bottom, #ffffff 0%, #f2f2f299 95%)"
                                    }}
                                >
                                    {bank.img ? (
                                        <img
                                            src={`/storage/${bank.img}`}
                                            alt={bank.name}
                                            className="h-16 w-16 object-contain"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-[#EEEEEE] flex items-center justify-center text-[#B3B3B4]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                    )}
                                    <p className="text-sm font-semibold text-[#404040] text-center leading-snug">{bank.name}</p>
                                    {bank.parent && (
                                        <span className="text-xs text-[#898A89] bg-[#F2F2F2] px-2 py-0.5 rounded-full">
                                            {bank.parent?.name}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ───────────────────────────────────────────────────
                Section 3.5 · Promo Tabs + Product Carousel
            ─────────────────────────────────────────────────── */}
            <section id="sales-products-section" className="max-w-shop mx-auto px-4 sm:px-6 lg:px-0 py-8 lg:py-14">
                <div className="bg-[#B8181E] lg:rounded-[40px] rounded-3xl p-5 lg:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-12 items-stretch">

                        {/* ── Right column: sale info + countdown ── */}
                        <div className="col-span-1 flex flex-col gap-2 sm:gap-6 py-2 sm:py-5">
                            <div className="grow">
                                <h2 className="text-2xl lg:text-3xl font-bold text-white text-right sm:text-center mb-0 sm:mb-3">
                                    {PROMO_TABS.find(t => t.key === promoTab)?.sectionTitle}
                                </h2>
                                <p className="hidden sm:block text-white text-lg lg:text-2xl text-center font-semibold">
                                    {PROMO_TABS.find(t => t.key === promoTab)?.description}
                                </p>
                            </div>

                            {/* Countdown — only for on_sale */}
                            {promoTab === 'on_sale' && (
                                <div className="grow flex items-end justify-between sm:block">
                                    <div className="flex gap-2 items-start sm:justify-center sm:my-5">
                                        {([
                                            { v: countdown.days,    l: 'روز'   },
                                            { v: countdown.hours,   l: 'ساعت'  },
                                            { v: countdown.minutes, l: 'دقیقه' },
                                        ] as const).map(({ v, l }, i, arr) => (
                                            <React.Fragment key={l}>
                                                <div className="flex flex-col justify-center gap-1">
                                                    <span className="flex align-center justify-center text-base sm:text-xl text-white font-semibold bg-[#000000]/10 backdrop-blur-sm rounded-xl w-[40px] sm:w-[52px] h-[40px] sm:h-[52px] shadow-sm ring-1 ring-gray-100"
                                                    style={{ lineHeight : "2.75"}}>
                                                        {String(v).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-white text-center">{l}</span>
                                                </div>
                                                {(i === 0 || i === 1) && (
                                                    <span className="text-xl font-bold text-white text-3xl h-[40px] sm:h-[52px]" style={{ lineHeight : "2.75"}}>:</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <Link
                                        href={route('shop.index')}
                                        className="block sm:hidden rounded-full text-white font-semibold px-0 py-2 text-sm hover:bg-[#F2F2F2] hover:text transition"
                                    >
                                        مشاهده همه
                                    </Link>
                                </div>
                            )}

                            <Link
                                href={route('shop.index')}
                                className="hidden sm:block rounded-full bg-white text-[#B8181E] font-semibold px-8 py-3 text-sm lg:text-base hover:bg-[#F8F8F8] transition mx-auto"
                            >
                                مشاهده همه
                            </Link>
                        </div>

                        {/* ── Left column: tabs + carousel ── */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {/* Tabs — below carousel on mobile, above on desktop */}
                            <div className="order-last lg:order-first flex gap-0 bg-white rounded-full sm:p-2 p-1.5">
                                {PROMO_TABS.map(t => (
                                    <button
                                        key={t.key}
                                        onClick={() => setPromoTab(t.key)}
                                        className={`relative grow px-2 sm:px-5 py-1 sm:py-2.5 text-sm sm:text-base font-medium sm:font-semibold transition rounded-full p-1 lg:p-3 ${
                                            promoTab === t.key
                                                ? 'text-white bg-[#B8181E]'
                                                : 'hover:text-[#B8181E] bg-white text-[#1F0001]'
                                        }`}
                                    >
                                        {promoTab === t.key && (
                                            <img
                                                src={salesPromoActiveBg}
                                                alt=""
                                                aria-hidden="true"
                                                className="absolute left-1/2 -translate-x-1/2 pointer-events-none -bottom-[18px] -scale-y-100 lg:scale-y-100 translate-y-full lg:bottom-auto lg:-top-[22px] lg:-translate-y-full"
                                            />
                                        )}
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Carousel — above tabs on mobile, below on desktop */}
                            <div className="order-first lg:order-last">
                                {(featuredProducts[promoTab] ?? []).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                                        <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                        </svg>
                                        <p className="text-base text-gray-300">محصولی در این بخش موجود نیست.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden">
                                        <div
                                            ref={promoTrackRef}
                                            className="flex gap-4 sm:gap-5 overflow-x-scroll scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                            onTouchStart={e => { promoTouchStartX.current = e.touches[0].clientX; }}
                                            onTouchEnd={e => {
                                                if (promoTouchStartX.current === null) return;
                                                const dx = promoTouchStartX.current - e.changedTouches[0].clientX;
                                                const products = featuredProducts[promoTab] ?? [];
                                                if (Math.abs(dx) > 50) {
                                                    setCarouselIdx(i => dx > 0
                                                        ? Math.min(i + 1, products.length - 1)
                                                        : Math.max(i - 1, 0));
                                                }
                                                promoTouchStartX.current = null;
                                            }}
                                        >
                                            {(featuredProducts[promoTab] ?? []).map(product => (
                                                <div key={product.id} className="shrink-0" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────
                Section 4 · About Gsun + Statistics
            ─────────────────────────────────────────────────── */}
            <section className="max-w-shop mx-auto px-4 sm:px-6 lg:px-0 lg:py-16 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">

                    {/* Left 40%: About text */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                        <div className="flex items-center justify-start gap-3 mb-4">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1528]">داستان</h2>
                            <img src={gsunLogoFA} alt="جی‌سان" className="h-7 lg:h-9 object-contain" />
                        </div>
                        <p className="text-[#616161] leading-6 mb-2 text-base text-justify">
                            شرکت داریون اروند خلیج فارس با بیش از نیم قرن تجربه، فعالیت خود را در دهه ۳۰ خورشیدی در زمینه لوازم خانگی آغاز نمود. با گذشت زمان و کسب اعتبار فراوان توانست با ثبت برند (General Sun) در سال ۱۳۸۶ واردات و مونتاژ محصولات خود را به صورت رسمی آغاز کند. با گذشت ده سال با گسترش فعالیت های این شرکت موفق به ثبت جهانی برند gsun کرده است.
                        </p>
                        <p className="text-[#616161] leading-6 text-base text-justify">
                            با بهره‌گیری از سیستم پرداخت اقساطی کالانو، خرید اعتباری لوازم خانگی را برای همه اقشار جامعه ممکن ساخته‌ایم. کیفیت، اصالت و رضایت مشتری اصلی‌ترین اولویت‌های ما هستند.
                        </p>
                    </div>

                    {/* Right 60%: Background with 3 stat cards stacked vertically */}
                    <div
                        className="lg:col-span-3 rounded-3xl overflow-hidden min-h-[320px] lg:min-h-[380px] flex justify-between items-stretch"
                        style={{
                            backgroundImage : `url(${statsBg})`, backgroundSize: 'cover', backgroundPosition: 'center'
                        }}
                    >
                        <div className="relative flex justify-end items-end">
                            <svg viewBox="0 0 135 70" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="absolute -right-1 bottom-0 lg:w-[150px] w-[140px] z-10 -scale-x-100">
                                <path d="M1.17338e-08 0C0 15 12.5 22.5 22 22.5H89C103 22.5 114 34.5 114 48.5C114 61 125.5 70 135 70H1.17338e-08V0Z" fill="white"></path>
                            </svg>
                            <Link
                                href={route('shop.index', { category_id: activeTab ?? undefined })}
                                className="rounded-full bg-[#B8181E] text-white hover:bg-[#E31F25] font-semibold lg:px-5 px-4 py-2 transition text-base z-20 lg:mb-1 mb-0"
                            >
                                بیشتر بدانید
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="relative flex flex-col justify-end items-end gap-4 lg:pt-3 pt-5 pb-7 pl-2">

                            <svg viewBox="0 0 313 357" fill="none" xmlns="http://www.w3.org/2000/svg"
                                 className="absolute top-1/2 -translate-y-1/2 bottom-0 lg:-left-[25%] z-10 -left-[55%]" style={{ height: 'calc(100% + 2px)'}}>
                                <path d="M0 0.5L312.5 0C293.495 0 270.5 13.5 269.5 43C272 71 252.5 92.5 225.5 92.5H205C180.5 92.5 163 115.5 163 133.5V190.919V314C163 338.5 184 357 206 357H0V0.5Z" fill="white"></path>
                            </svg>
                            <div className="z-20 sm:mb-5 mb-0 grow">
                                <img src={daryoonLogo} alt="داریون اروند خلیج فارس" className="lg:w-52 sm:w-44 w-36"/>
                            </div>

                            {STATS.map((stat, i) => (
                                <div key={i} className={`z-20 lg:max-w-28 lg:min-w-24 max-w-12 min-w-12 lg:gap-2 gap-0.5 ${i === STATS.length-1 ? 'mb-0' : 'mb-2'}`}>
                                    <div className="flex items-baseline lg:gap-2 gap-1">
                                        <span className="text-lg sm:text-xl font-bold text-[#1F0001]">{stat.number}</span>
                                        <span className="text-[#E31F25] text-sm sm:text-base font-medium">{stat.prefix}</span>
                                    </div>
                                    <p className="text-[#5C5C5C] sm:text-base text-xs font-medium mb-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────
                Section 5 · Banner Grid (2 rows × 2 columns)
            ─────────────────────────────────────────────────── */}
            <section className="max-w-shop mx-auto px-4 sm:px-6 lg:px-0 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    {BANNERS.map((banner, i) => (
                        <Link
                            key={i}
                            href={route('shop.index')}
                            className="group relative rounded-3xl overflow-hidden h-44 md:h-56 flex items-center justify-end p-6"
                            // style={{ background: `linear-gradient(135deg, ${banner.from} 0%, ${banner.to} 100%)` }}
                            style={{ background: `url(${banner.bg})`, backgroundSize: 'cover', }}
                        >
                            {/* Decorative circle */}
                            <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-white/5" />

                            <div className="relative z-10 pr-12 w-[60%] text-right">
                                <h3 className="text-white font-bold text-base md:text-2xl mb-2 group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[4px] transition-transform">
                                    {banner.title}
                                </h3>
                                <p className="text-white/65 text-medium group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[4px] transition-transform">{banner.subtitle}</p>
                            </div>

                            {/* Arrow icon */}
                            <div className="absolute left-5 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-white/70">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>


            {/* ───────────────────────────────────────────────────
                Section 6 · Why Gsun
            ─────────────────────────────────────────────────── */}
            <section
                className="relative lg:pb-32 pb-12 overflow-hidden mt-8 lg:mt-20 mb-4"
                style={{ backgroundImage: `url(${servicesBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >

                <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="67" viewBox="0 0 1440 67" fill="none"
                     className="absolute top-0 left-1/2 -translate-x-1/2 top-[-10px]">
                    <path d="M455.5 10.5H0V0H719.999H1440V10.5H982.5C926 10.5 909.5 66.5 856.5 66.5H719.999H583.5C530.5 66.5 516 10.5 455.5 10.5Z" fill="white"/>
                </svg>

                <div className="relative z-10 max-w-shop mx-auto px-4 sm:px-6 lg:px-0">
                    {/* Title: text + logo image, centered */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-black">چرا</h2>
                        <img src={gsunLogoFA} alt="جی‌سان" className="h-9 lg:h-12 object-contain" />
                        <h2 className="text-4xl md:text-5xl font-bold text-black">؟!</h2>
                    </div>

                    {/* ── Mobile: full-width slider, 3 slides ── */}
                    <div className="lg:hidden w-full">
                        <div className="flex flex-col gap-6">
                            {WHY_SLIDE_GROUPS[whySlide].map(idx => {
                                const f = WHY_GSUN_FEATURES[idx];
                                return (
                                    <div key={idx} className="rounded-[40px] p-8 bg-white/40 hover:bg-white/70 backdrop-blur-sm border-2 border-white/60">
                                        <div className="flex flex-row justify-start align-center gap-3 mb-1 sm:mb-2">
                                            <div className="text-black mb-2 max-w-[30px]" style={{
                                                textShadow : "0 4px 4px rgba(0,0,0,0.15)"
                                            }}>{f.icon}</div>
                                            <h3 className="text-xl font-bold text-black mb-3"
                                            style={{ textShadow : "0 4px 4px rgba(0,0,0,0.15)"}}>
                                                {f.title}
                                            </h3>
                                        </div>
                                        <ul className="flex flex-col gap-1">
                                            {f.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-1.5 mr-[10px]">
                                                    <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full bg-black" />
                                                    <span className="text-sm font-medium text-black">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Slide navigation */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <button
                                onClick={() => setWhySlide(s => Math.max(0, s - 1))}
                                disabled={whySlide === 0}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition"
                                aria-label="قبلی"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setWhySlide(s => Math.min(WHY_SLIDE_GROUPS.length - 1, s + 1))}
                                disabled={whySlide === WHY_SLIDE_GROUPS.length - 1}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition"
                                aria-label="بعدی"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* ── Desktop: right-aligned grid, max 50% ── */}
                    <div className="hidden lg:block w-full max-w-[55%] ml-auto pt-14">
                        <div className="grid grid-cols-2 gap-6">
                            {WHY_GSUN_FEATURES.map((f, i) => (
                                <div
                                    key={i}
                                    className={`${i === 4 ? 'col-span-2' : ''} rounded-[40px] p-8 bg-white/40 hover:bg-white/70 backdrop-blur-sm border border-white/60 transition`}
                                >
                                    <div className="flex flex-row justify-start align-center gap-3 mb-2">
                                        <div className="text-black mb-2 max-w-[30px]">{f.icon}</div>
                                        <h3 className="text-lg font-bold text-black mb-3"
                                            style={{ textShadow : "0 4px 4px rgba(0,0,0,0.15)"}}>
                                            {f.title}
                                        </h3>
                                    </div>
                                    <ul className={`${i === 4 ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1.5'}`}>
                                        {f.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-1.5 mr-[10px]">
                                                <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full bg-black" />
                                                <span className="text-sm font-medium text-black">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────────────────────────────────
                Section 7 · Shop Features
            ─────────────────────────────────────────────────── */}
            <section className="max-w-shop mx-auto px-4 sm:px-6 lg:px-0 lg:pt-12 pt-4 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 lg:pt-0 pt-4">
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
