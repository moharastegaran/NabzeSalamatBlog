import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import { BlogPost, BlogTag, PostFieldValue } from '@/types/models';
import { NavCategory, PageProps } from '@/types';

interface Props {
    sliderPosts: BlogPost[];
    suggestionPosts: BlogPost[];
    trendingPosts: BlogPost[];
    recentPosts: BlogPost[];
    analyzePosts: BlogPost[];
    tags: BlogTag[];
    videoPosts: BlogPost[];
    audioPosts: BlogPost[];
    eventPosts: BlogPost[];
}

// ── Shared ────────────────────────────────────────────────────────────────────
function SectionHeader({ title, href }: { title: string; href?: string }) {
    return (
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-[#F24F00]">
            <h2 className="flex items-center gap-2 text-base font-black text-gray-900 tracking-tight">
                <span className="inline-block w-3.5 h-3.5 bg-[#F24F00]" />
                {title}
            </h2>
            {href && (
                <Link href={href} className="text-xs font-semibold text-[#F24F00] hover:text-[#075F26] flex items-center gap-1 transition-colors">
                    بیشتر
                    <svg className="w-3 h-3 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            )}
        </div>
    );
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('fa-IR');
}

// ── Hero slider ───────────────────────────────────────────────────────────────
function HeroSlider({ posts }: { posts: BlogPost[] }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (posts.length < 2) return;
        const t = setInterval(() => setActive(i => (i + 1) % posts.length), 4500);
        return () => clearInterval(t);
    }, [posts.length]);

    if (!posts.length) return <div className="w-full h-full bg-gray-200 animate-pulse" />;

    return (
        <div className="relative w-full h-full overflow-hidden group">
            {posts.map((post, i) => (
                <div
                    key={post.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {post.featured_image
                        ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-[#7A2700] to-gray-900" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                </div>
            ))}

            {(() => {
                const cur = posts[active];
                if (!cur) return null;
                return (
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 lg:p-7">
                        {cur.category && (
                            <span className="mb-2 inline-block w-fit bg-[#F24F00] px-2.5 py-0.5 text-[11px] font-black text-white uppercase tracking-wider">
                                {cur.category.name}
                            </span>
                        )}
                        <Link href={route('front.blog.show', cur.slug)}>
                            <h2 className="text-white text-xl lg:text-3xl font-black leading-tight line-clamp-2 mb-2 hover:text-gray-200 transition-colors">
                                {cur.title}
                            </h2>
                        </Link>
                        {cur.excerpt && (
                            <p className="text-gray-300 text-sm line-clamp-2 mb-4 max-w-xl leading-relaxed">
                                {cur.excerpt}
                            </p>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400 text-xs">
                                {cur.published_at && <span>{fmtDate(cur.published_at)}</span>}
                                {(cur.views ?? 0) > 0 && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {cur.views.toLocaleString('fa-IR')}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {posts.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActive(i)}
                                        className={`rounded-sm transition-all duration-300 ${i === active ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}

            <button
                onClick={() => setActive(i => (i - 1 + posts.length) % posts.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-[#F24F00] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                aria-label="قبلی"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <button
                onClick={() => setActive(i => (i + 1) % posts.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-[#F24F00] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                aria-label="بعدی"
            >
                <svg className="w-4 h-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

// ── Hero sidebar item ─────────────────────────────────────────────────────────
function HeroSideItem({ post }: { post: BlogPost }) {
    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="flex gap-3 py-3 border-b border-gray-100 last:border-0 group"
        >
            <div className="flex-shrink-0 w-20 h-[60px] overflow-hidden bg-gray-100">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                }
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                {post.category && (
                    <span className="text-[10px] font-black text-[#F24F00] block truncate uppercase">{post.category.name}</span>
                )}
                <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors">{post.title}</h4>
                {post.published_at && (
                    <span className="text-[10px] text-gray-400 mt-0.5">{fmtDate(post.published_at)}</span>
                )}
            </div>
        </Link>
    );
}

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ post }: { post: BlogPost }) {
    return (
        <Link href={route('front.blog.show', post.slug)} className="group block bg-white hover:shadow-md transition-shadow duration-200">
            <div className="overflow-hidden bg-gray-100 aspect-[16/10]">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                }
            </div>
            <div className="p-3">
                {post.category && (
                    <span className="inline-block bg-[#F24F00] text-white text-[10px] font-black px-2 py-0.5 mb-2 uppercase tracking-wide">
                        {post.category.name}
                    </span>
                )}
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors">
                    {post.title}
                </h3>
                {post.published_at && (
                    <span className="block text-[10px] text-gray-400 mt-2">{fmtDate(post.published_at)}</span>
                )}
            </div>
        </Link>
    );
}

// ── Category cards ────────────────────────────────────────────────────────────
const BRAND_GRADIENTS: [string, string][] = [
    ['#F24F00', '#7A2700'],
    ['#075F26', '#023B18'],
    ['#1A5276', '#0D2D45'],
    ['#6C3483', '#4A235A'],
    ['#117A65', '#0B5345'],
    ['#B7770D', '#7D5109'],
    ['#922B21', '#641E16'],
    ['#1E8449', '#145A32'],
];

function CategoryStrip({ categories }: { categories: NavCategory[] }) {
    if (!categories.length) return null;

    return (
        <div className="flex gap-3">
            {categories.map((cat, i) => {
                const [c1, c2] = BRAND_GRADIENTS[i % BRAND_GRADIENTS.length];
                return (
                    <Link
                        key={cat.id}
                        href={route('front.blog.category', cat.slug)}
                        className="group relative flex-1 h-44 overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
                    >
                        {/* Background: thumbnail or brand gradient */}
                        {cat.thumbnail ? (
                            <img
                                src={`/storage/${cat.thumbnail}`}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div
                                className="absolute inset-0"
                                style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }}
                            />
                        )}

                        {/* Brand color overlay — tints image with brand palette */}
                        <div
                            className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-75"
                            style={{ background: `linear-gradient(to bottom, ${c1}55, ${c2}dd)` }}
                        />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-between p-3">

                            {/* Icon — frosted glass circle */}
                            <div className="mt-2 w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/35 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                                {cat.icon ? (
                                    <img src={`/storage/${cat.icon}`} alt="" className="w-6 h-6 object-contain brightness-0 invert" />
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                )}
                            </div>

                            {/* Name */}
                            <span className="mb-1 text-center text-lg font-black text-white leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                                {cat.name}
                            </span>

                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

// ── Trending list item ────────────────────────────────────────────────────────
function TrendItem({ post, rank }: { post: BlogPost; rank: number }) {
    return (
        <Link href={route('front.blog.show', post.slug)} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 group">
            <span className={`flex-shrink-0 text-2xl font-black leading-none tabular-nums mt-0.5 min-w-[2rem] text-start ${rank <= 3 ? 'text-[#F24F00]' : 'text-gray-200'}`}>
                {String(rank).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
                {post.category && (
                    <span className="text-[10px] font-black text-[#F24F00] block mb-0.5 uppercase">{post.category.name}</span>
                )}
                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors">{post.title}</h4>
                {post.published_at && (
                    <span className="text-[10px] text-gray-400 mt-1 block">{fmtDate(post.published_at)}</span>
                )}
            </div>
            <div className="flex-shrink-0 w-16 h-[50px] overflow-hidden bg-gray-100">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full bg-gray-200" />
                }
            </div>
        </Link>
    );
}

// ── Tabbed posts ──────────────────────────────────────────────────────────────
type TabKey = 'trending' | 'recent' | 'analyze';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'trending', label: 'پربازدیدترین' },
    { key: 'recent',   label: 'جدیدترین'     },
    { key: 'analyze',  label: 'تحلیل‌ها'      },
];

function TabbedPosts({ trending, recent, analyze }: { trending: BlogPost[]; recent: BlogPost[]; analyze: BlogPost[] }) {
    const [activeTab, setActiveTab] = useState<TabKey>('trending');
    const [fading, setFading] = useState(false);

    const switchTab = (tab: TabKey) => {
        if (tab === activeTab) return;
        setFading(true);
        setTimeout(() => { setActiveTab(tab); setFading(false); }, 150);
    };

    const posts: Record<TabKey, BlogPost[]> = { trending, recent, analyze };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="flex border-b-2 border-gray-100 flex-shrink-0">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => switchTab(key)}
                        className={`px-4 py-3 text-sm font-bold relative transition-colors whitespace-nowrap ${
                            activeTab === key ? 'text-[#F24F00]' : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {label}
                        {activeTab === key && (
                            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#F24F00]" />
                        )}
                    </button>
                ))}
            </div>

            <div className={`flex-1 overflow-y-auto transition-opacity duration-150 px-1 ${fading ? 'opacity-0' : 'opacity-100'}`}>
                {posts[activeTab].length > 0
                    ? posts[activeTab].map((post, i) => <TrendItem key={post.id} post={post} rank={i + 1} />)
                    : <p className="text-center text-sm text-gray-400 py-10">مطلبی یافت نشد</p>
                }
            </div>
        </div>
    );
}

// ── Video section ─────────────────────────────────────────────────────────────
function parseYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([^?&\s]+)/);
    return m?.[1] ?? null;
}

function VideoPlayer({ post }: { post: BlogPost }) {
    const url = post.video_url;
    if (url) {
        const ytId = parseYouTubeId(url);
        if (ytId) {
            return (
                <iframe
                    src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={post.title}
                />
            );
        }
        return (
            <video
                key={url}
                src={url}
                controls
                className="w-full h-full object-contain bg-black"
                poster={post.featured_image ? `/storage/${post.featured_image}` : undefined}
            />
        );
    }
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
            {post.featured_image && (
                <img src={`/storage/${post.featured_image}`} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            )}
            <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </div>
    );
}

function VideoCard({ post, active, onClick }: { post: BlogPost; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex gap-3 p-3 text-right transition-colors border-b border-gray-100 last:border-0 ${active ? 'bg-red-50' : 'hover:bg-gray-50'}`}
        >
            <div className="relative flex-shrink-0 w-24 aspect-video overflow-hidden bg-gray-200">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gray-300" />
                }
                <div className={`absolute inset-0 flex items-center justify-center ${active ? 'bg-[#F24F00]/50' : 'bg-black/30'}`}>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#F24F00] translate-x-px" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
                {post.video_url && (
                    <span className="absolute top-1 right-1 bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white">ویدیو</span>
                )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                {post.category && <span className="text-[10px] font-black text-[#F24F00] truncate uppercase">{post.category.name}</span>}
                <h4 className={`text-xs font-bold line-clamp-2 leading-snug ${active ? 'text-[#F24F00]' : 'text-gray-800'}`}>{post.title}</h4>
                {post.published_at && <span className="text-[10px] text-gray-400">{fmtDate(post.published_at)}</span>}
            </div>
        </button>
    );
}

function VideoSection({ posts }: { posts: BlogPost[] }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const active = posts[activeIdx] ?? posts[0];
    if (!posts.length) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white">
            {/* Video list — col-span-1, right in RTL */}
            <div className="border-l border-gray-100 lg:max-h-[380px] lg:overflow-y-auto divide-y divide-gray-100">
                {posts.map((post, i) => (
                    <VideoCard key={post.id} post={post} active={i === activeIdx} onClick={() => setActiveIdx(i)} />
                ))}
            </div>

            {/* Player — col-span-2, left in RTL */}
            <div className="lg:col-span-2 flex flex-col order-first lg:order-none">
                <div className="aspect-video bg-black">
                    <VideoPlayer post={active} />
                </div>
                <div className="p-4 border-t border-gray-100 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        {active.category && (
                            <span className="bg-[#F24F00] text-white text-[10px] font-black px-2 py-0.5 uppercase">{active.category.name}</span>
                        )}
                        {active.published_at && (
                            <span className="text-xs text-gray-400">
                                {new Date(active.published_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        )}
                    </div>
                    <Link
                        href={route('front.blog.show', active.slug)}
                        className="text-sm font-black text-gray-900 leading-snug hover:text-[#F24F00] transition-colors line-clamp-2 block"
                    >
                        {active.title}
                    </Link>
                    {active.excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">{active.excerpt}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Audio card ────────────────────────────────────────────────────────────────
function BlogAudioCard({ post }: { post: BlogPost }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying]   = useState(false);
    const [progress, setProgress] = useState(0);
    const [current, setCurrent]   = useState(0);
    const [duration, setDuration] = useState(0);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
    };

    const onTimeUpdate = () => {
        if (!audioRef.current) return;
        const cur = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 0;
        setCurrent(cur);
        setProgress(dur ? (cur / dur) * 100 : 0);
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!audioRef.current || !audioRef.current.duration) return;
        audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
        setProgress(val);
    };

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    return (
        <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">

            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-[#F24F00]/20 to-[#075F26]/30" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Waveform badge */}
                <div className="absolute bottom-3 right-3 flex items-end gap-0.5">
                    {[4, 7, 5, 9, 6, 8, 5, 7, 4].map((h, i) => (
                        <span
                            key={i}
                            className={`w-[3px] rounded-full bg-white/80 ${playing ? 'animate-pulse' : ''}`}
                            style={{ height: `${h * 2}px`, animationDelay: `${i * 80}ms` }}
                        />
                    ))}
                </div>

                {/* Play overlay button */}
                <button
                    onClick={toggle}
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    aria-label={playing ? 'توقف' : 'پخش'}
                >
                    <div className="w-12 h-12 rounded-full bg-[#F24F00]/90 flex items-center justify-center shadow-lg">
                        {playing
                            ? <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            : <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        }
                    </div>
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-2.5 p-4 flex-1">
                {(() => {
                    const cat = post.categories?.at(-1) ?? post.category;
                    return cat && (
                        <span className="inline-block bg-[#F24F00] text-white text-[10px] font-black px-2 py-0.5 w-fit uppercase tracking-wide">
                            {cat.name}
                        </span>
                    );
                })()}
                <Link href={route('front.blog.show', post.slug)}>
                    <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug hover:text-[#F24F00] transition-colors">
                        {post.title}
                    </h3>
                </Link>
                {post.excerpt && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                )}

                {/* Player */}
                {(() => {
                    const audioFile = post.media?.[0];
                    return (
                        <div className="mt-auto pt-3 border-t border-gray-100">
                            {audioFile && (
                                <audio
                                    ref={audioRef}
                                    src={audioFile.url}
                                    onTimeUpdate={onTimeUpdate}
                                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                                    onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
                                />
                            )}
                            {audioFile && (
                                <div className="flex justify-end items-center gap-1.5 mb-2.5">
                                    <span className="text-[10px] text-gray-300 flex-shrink-0">{audioFile.human_readable_size}</span>
                                    <span className="grow text-[10px] text-gray-400 truncate text-left">{audioFile.file_name}</span>
                                    <svg className="h-3 w-3 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex items-end gap-3">
                                {/* Scrubber + times */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <input
                                        type="range" min={0} max={100} value={progress}
                                        onChange={onSeek}
                                        disabled={!audioFile}
                                        className="w-full h-1 border-none rounded-full cursor-pointer accent-[#F24F00] disabled:opacity-40" dir="ltr"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 tabular-nums">
                                        <span>{duration ? fmt(duration) : '--:--'}</span>
                                        <span>{fmt(current)}</span>
                                    </div>
                                </div>

                                {/* Play/pause */}
                                <button
                                    onClick={toggle}
                                    disabled={!audioFile}
                                    className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F24F00] hover:bg-[#075F26] disabled:bg-gray-300 text-white flex items-center justify-center transition-colors shadow-sm"
                                    aria-label={playing ? 'توقف' : 'پخش'}
                                >
                                    {playing
                                        ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                        : <svg className="w-4 h-4 translate-x-px" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    }
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>

        </div>
    );
}

// ── Event post card ───────────────────────────────────────────────────────────
function EventPostCard({ post }: { post: BlogPost }) {
    const fieldValues = post.field_values ?? [];
    const dateFVs  = fieldValues.filter((fv): fv is PostFieldValue & { value: string } =>
        fv.definition?.field_type === 'date' && !!fv.value
    );
    const otherFVs = fieldValues.filter((fv): fv is PostFieldValue & { value: string } =>
        fv.definition?.field_type !== 'date' && !!fv.value
    );

    return (
        <Link href={route('front.blog.show', post.slug)} className="group flex flex-col bg-white hover:shadow-md transition-shadow duration-200">
            {/* Image */}
            <div className="overflow-hidden aspect-video bg-gray-100 flex-shrink-0">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-[#075F26]/20 to-[#F24F00]/10" />
                }
            </div>

            <div className="flex flex-col gap-2 p-3 flex-1">
                {/* Category badge */}
                {(() => {
                    const cat = post.categories?.at(-1) ?? post.category;
                    return cat && (
                        <span className="inline-block w-fit bg-[#075F26] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wide">
                            {cat.name}
                        </span>
                    );
                })()}

                {/* Date range badge */}
                {dateFVs.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#075F26]">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dateFVs.map((fv, i) => (
                            <React.Fragment key={fv.id}>
                                {i > 0 && <span className="text-gray-300">—</span>}
                                <span>{fmtDate(fv.value)}</span>
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors flex-1">
                    {post.title}
                </h3>

                {/* Other field values (venue, etc.) */}
                {otherFVs.length > 0 && (
                    <div className="space-y-1 mt-auto pt-2 border-t border-gray-100">
                        {otherFVs.map(fv => (
                            <div key={fv.id} className="flex items-start gap-1.5 text-xs text-gray-500">
                                <svg className="w-3 h-3 shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium text-gray-600 shrink-0">{fv.definition!.label}:</span>
                                <span className="line-clamp-1">{fv.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Landing({ sliderPosts, suggestionPosts, trendingPosts, recentPosts, analyzePosts, tags, videoPosts, audioPosts, eventPosts }: Props) {
    const { navCategories } = usePage<PageProps>().props;

    return (
        <BlogLayout>
            <Head title="نبض سلامت" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-7">

                {/* ── Section 1: Hero ──────────────────────────────────────── */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-0 shadow-sm overflow-hidden">

                    {/* Slider — 2 cols */}
                    <div className="lg:col-span-2 h-[280px] sm:h-[400px] lg:h-[460px]">
                        <HeroSlider posts={sliderPosts} />
                    </div>

                    {/* Sidebar — 1 col */}
                    <div className="bg-white flex flex-col p-4">
                        <div className="flex-shrink-0">
                            <SectionHeader title="پیشنهادی" />
                        </div>
                        <div className="flex-1 flex flex-col divide-y divide-gray-100 overflow-hidden">
                            {suggestionPosts.length > 0
                                ? suggestionPosts.map(post => <HeroSideItem key={post.id} post={post} />)
                                : [0, 1].map(i => (
                                    <div key={i} className="flex gap-3 py-3">
                                        <div className="w-20 h-[60px] bg-gray-100 animate-pulse" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-2.5 bg-gray-100 animate-pulse" />
                                            <div className="h-2.5 bg-gray-100 animate-pulse w-3/4" />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </section>

                {/* ── Section 2: Category strip ────────────────────────────── */}
                <section>
                    <SectionHeader title="دسته‌بندی‌ها" href={route('front.blog.index')} />
                    <CategoryStrip categories={navCategories} />
                </section>

                {/* ── Section 3: Latest news grid ───────────────────────────── */}
                {recentPosts.length > 0 && (
                    <section>
                        <SectionHeader title="آخرین اخبار" href={route('front.blog.index')} />
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {recentPosts.slice(0, 4).map(post => (
                                <ArticleCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Section 4: Trending + Audio ──────────────────────────── */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Trending — 1 col */}
                    <div className="flex flex-col">
                        <SectionHeader title="پربازدیدترین" />
                        <div className="flex-1 bg-white min-h-0">
                            <TabbedPosts
                                trending={trendingPosts}
                                recent={recentPosts}
                                analyze={analyzePosts}
                            />
                        </div>
                    </div>

                    {/* Audio posts — 2 cols */}
                    {audioPosts.length > 0 && (
                        <div className="lg:col-span-2 flex flex-col">
                            <SectionHeader title="نبض صدا" href={route('front.blog.category', 'nbd-sda')} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                {audioPosts.map(post => (
                                    <BlogAudioCard key={post.id} post={post} />
                                ))}
                            </div>
                        </div>
                    )}

                </section>

                {/* ── Section 4b: Videos (full width) ──────────────────────── */}
                {videoPosts.length > 0 && (
                    <section>
                        <SectionHeader title="ویدیوها" />
                        <VideoSection posts={videoPosts} />
                    </section>
                )}

                {/* ── Section 6: Events ────────────────────────────────────── */}
                {eventPosts.length > 0 && (
                    <section>
                        <SectionHeader title="رویدادها" href={route('front.blog.category', 'event')} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {eventPosts.map(post => (
                                <EventPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Section 5: Tags / Topics ─────────────────────────────── */}
                {tags.length > 0 && (
                    <section>
                        <SectionHeader title="موضوعات" />
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => {
                                const count = tag.posts_count ?? 0;
                                const tier = count >= 5 ? 3 : count >= 3 ? 2 : count >= 2 ? 1 : 0;
                                const base = 'inline-flex items-center gap-1 font-semibold transition-colors duration-200';
                                const sizes  = ['text-xs px-2.5 py-1',   'text-xs px-3 py-1',    'text-sm px-3 py-1',    'text-sm px-3.5 py-1.5'] as const;
                                const styles = [
                                    'border border-gray-200 text-gray-500 hover:border-[#F24F00] hover:text-[#F24F00]',
                                    'border border-gray-300 text-gray-600 hover:border-[#F24F00] hover:text-[#F24F00]',
                                    'border border-[#F24F00]/40 text-[#075F26] hover:bg-[#F24F00] hover:text-white',
                                    'bg-[#F24F00] text-white border border-[#F24F00] hover:bg-[#075F26]',
                                ] as const;
                                return (
                                    <Link
                                        key={tag.id}
                                        href={route('front.blog.index', { tag: tag.slug })}
                                        className={`${base} ${sizes[tier]} ${styles[tier]}`}
                                    >
                                        <span className="opacity-50">#</span>
                                        {tag.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>
        </BlogLayout>
    );
}
