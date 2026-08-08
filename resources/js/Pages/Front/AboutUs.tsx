import { Link } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import SeoHead from '@/Components/SeoHead';
import type { ReactNode } from 'react';

import aboutBG from '../../../images/about-us.jpg';
import contactBG from '../../../images/contact-us.jpg';

type StatItem = { value: string; label: string };
type ValueItem = { title: string; desc: string; icon: string };
type EditorialItem = { step: string; title: string; desc: string };

export type AboutUsContent = {
    seo: { title: string; description: string };
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        cta_primary: string;
        cta_secondary: string;
    };
    stats: StatItem[];
    mission: { title: string; paragraphs: string[] };
    vision: { title: string; paragraphs: string[]; quote?: string };
    policy: {
        section_title: string;
        intro_title: string;
        paragraphs: string[];
        duties_title: string;
        duties: string[];
    };
    values: { section_title: string; items: ValueItem[] };
    editorial: { section_title: string; items: EditorialItem[] };
    cta: {
        title: string;
        subtitle: string;
        cta_primary: string;
        cta_secondary: string;
    };
};

interface Props {
    content: AboutUsContent;
}

const VALUE_STYLES: Record<string, { accent: string; iconBg: string; iconColor: string; icon: ReactNode }> = {
    integrity: {
        accent: 'border-[#F24F00]',
        iconBg: 'bg-[#F24F00]/10',
        iconColor: 'text-[#F24F00]',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    },
    accessibility: {
        accent: 'border-[#075F26]',
        iconBg: 'bg-[#075F26]/10',
        iconColor: 'text-[#075F26]',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
    independence: {
        accent: 'border-gray-800',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-700',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
    },
    freshness: {
        accent: 'border-indigo-500',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        ),
    },
};

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2.5 mb-8">
            <span className="w-1 h-6 bg-[#F24F00] flex-shrink-0" />
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
        </div>
    );
}

export default function AboutUs({ content }: Props) {
    const { seo, hero, stats, mission, vision, policy, values, editorial, cta } = content;

    return (
        <BlogLayout>
            <SeoHead
                title={seo.title}
                description={seo.description}
                url="/about-us"
            />

            <div
                className="relative bg-gray-900 overflow-hidden"
                style={{
                    background: `linear-gradient(to left,rgb(17 24 39 / 0.92), rgb(17 24 39 / 0.75)), url(${aboutBG}) no-repeat left center`,
                    backgroundSize: '100%',
                }}
            >
                <div className="absolute inset-y-0 right-0 w-1.5 bg-[#F24F00]" />
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#F24F00]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F24F00]/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                    <span className="inline-block bg-[#F24F00] px-3 py-1 text-xs font-black uppercase tracking-widest text-white mb-5">
                        {hero.badge}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
                        {hero.title}
                    </h1>
                    <p className="text-gray-400 text-lg leading-8 max-w-xl mb-8">
                        {hero.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="#about-section--mvp"
                            className="inline-flex items-center gap-2 bg-[#F24F00] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                        >
                            {hero.cta_primary}
                            <svg className="h-4 w-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href={route('front.blog.index')}
                            className="inline-flex items-center gap-2 border border-gray-600 px-5 py-2.5 text-sm font-bold text-gray-300 hover:border-gray-400 hover:text-white transition-colors"
                        >
                            {hero.cta_secondary}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-[#F24F00]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-white/20">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="flex flex-col items-center justify-center py-8 gap-1.5">
                                <span className="text-3xl font-black text-white tabular-nums">{value}</span>
                                <span className="text-xs text-white/80 font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div id="about-section--mvp" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-sm border-t-4 border-[#F24F00] p-8">
                        <div className="flex items-center gap-2.5 mb-6">
                            <span className="w-1 h-6 bg-[#F24F00] flex-shrink-0" />
                            <h2 className="text-lg font-black text-gray-900">{mission.title}</h2>
                        </div>
                        <div className="space-y-4 text-sm text-gray-600 leading-7">
                            {mission.paragraphs.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white shadow-sm border-t-4 border-[#075F26] p-8">
                        <div className="flex items-center gap-2.5 mb-6">
                            <span className="w-1 h-6 bg-[#075F26] flex-shrink-0" />
                            <h2 className="text-lg font-black text-gray-900">{vision.title}</h2>
                        </div>
                        <div className="space-y-4 text-sm text-gray-600 leading-7">
                            {vision.paragraphs.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                        {vision.quote && (
                            <div className="mt-8 border-r-2 border-[#075F26] pr-4">
                                <p className="text-xs text-gray-400 italic leading-6">{vision.quote}</p>
                            </div>
                        )}
                    </div>
                </div>

                <section>
                    <SectionTitle title={policy.section_title} />

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
                        <div className="bg-white shadow-sm p-8">
                            <h3 className="text-sm font-black text-gray-900 mb-5 pb-3 border-b border-gray-100">
                                {policy.intro_title}
                            </h3>
                            <div className="space-y-4 text-sm text-gray-600 leading-7">
                                {policy.paragraphs.map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow-sm p-6">
                            <h3 className="text-sm font-black text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center bg-[#F24F00] text-white text-[10px] font-black flex-shrink-0">
                                    {policy.duties.length}
                                </span>
                                {policy.duties_title}
                            </h3>
                            <ol className="space-y-4">
                                {policy.duties.map((duty, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-7">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center bg-[#F24F00]/10 text-[#F24F00] text-xs font-black mt-0.5">
                                            {(i + 1).toLocaleString('fa-IR')}
                                        </span>
                                        {duty}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                <section>
                    <SectionTitle title={values.section_title} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.items.map(v => {
                            const style = VALUE_STYLES[v.icon] ?? VALUE_STYLES.integrity;
                            return (
                                <div key={v.title} className={`bg-white shadow-sm p-6 border-t-4 ${style.accent}`}>
                                    <div className={`w-10 h-10 flex items-center justify-center mb-4 ${style.iconBg} ${style.iconColor}`}>
                                        {style.icon}
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 mb-2">{v.title}</h3>
                                    <p className="text-xs text-gray-500 leading-6">{v.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <SectionTitle title={editorial.section_title} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {editorial.items.map(item => (
                            <div key={`${item.step}-${item.title}`} className="bg-white shadow-sm p-6 flex gap-4">
                                <span className="text-4xl font-black text-gray-100 leading-none flex-shrink-0 select-none">
                                    {item.step}
                                </span>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-xs text-gray-500 leading-6">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className="bg-gray-900 p-10 sm:p-14 text-center relative overflow-hidden bg-cover"
                    style={{
                        background: `url(${contactBG}), radial-gradient(rgb(17 24 39 / 0.92), rgb(17 24 39 / 0.75))`,
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-[#F24F00]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F24F00]/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
                    <div className="relative">
                        <h2 className="text-2xl font-black text-white mb-3">{cta.title}</h2>
                        <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto leading-7">
                            {cta.subtitle}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href={route('front.blog.index')}
                                className="inline-flex items-center gap-2 bg-[#F24F00] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                            >
                                {cta.cta_primary}
                                <svg className="h-4 w-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <Link
                                href={route('front.contact')}
                                className="inline-flex items-center gap-2 border border-gray-600 px-6 py-3 text-sm font-bold text-gray-300 hover:border-gray-400 hover:text-white transition-colors"
                            >
                                {cta.cta_secondary}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </BlogLayout>
    );
}
