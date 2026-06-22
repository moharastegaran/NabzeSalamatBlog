import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import { AdBanner, BlogPost, BlogTag, PostFieldValue } from '@/types/models';
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
    adBanners: AdBanner[];
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
    const d = new Date(iso);
    return d.toLocaleDateString('fa-IR') + ' — ' + d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function fmtDateOnly(iso: string) {
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
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-[#F24F00] text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all"
                aria-label="قبلی"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <button
                onClick={() => setActive(i => (i + 1) % posts.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-[#F24F00] text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, i) => {
                const [c1, c2] = BRAND_GRADIENTS[i % BRAND_GRADIENTS.length];
                return (
                    <Link
                        key={cat.id}
                        href={route('front.blog.category', cat.slug)}
                        className="group relative flex-1 h-28 sm:h-44 overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
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
                            <div className="mt-2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/20 ring-2 ring-white/35 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                                {cat.icon ? (
                                    <img src={`/storage/${cat.icon}`} alt="" className="w-6 h-6 object-contain brightness-0 invert" />
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                )}
                            </div>

                            {/* Name */}
                            <span className="mb-1 text-center text-lg font-bold sm:font-black text-white leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
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
    const videoMedia = post.media?.find(m => m.collection_name === 'video') ?? null;
    const mediaUrl   = videoMedia
        ? (videoMedia.disk === 'public' ? `/storage/${videoMedia.path}` : videoMedia.url)
        : null;
    const url = post.video_url ?? mediaUrl ?? null;
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
    if (!posts.length) return null;
    const active = posts[activeIdx] ?? posts[0];

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
                                {fmtDate(active.published_at)}
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
    const [audioError, setAudioError] = useState(false);

    const audioFile = post.media?.find(m => m.collection_name === 'audio') ?? null;
    // Use a relative src for public-disk files to avoid APP_URL mismatch in dev
    const audioSrc  = audioFile
        ? (audioFile.disk === 'public' ? `/storage/${audioFile.path}` : audioFile.url)
        : null;

    const toggle = () => {
        if (!audioRef.current || !audioSrc) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            setAudioError(false);
            audioRef.current.play()
                .then(() => setPlaying(true))
                .catch(() => setAudioError(true));
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

            {/* Hidden audio element */}
            {audioSrc && (
                <audio
                    ref={audioRef}
                    src={audioSrc}
                    preload="metadata"
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
                    onError={() => { setPlaying(false); setAudioError(true); }}
                />
            )}

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
                {audioSrc && (
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
                )}
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
                <div className="mt-auto pt-3 border-t border-gray-100">
                    {audioFile && (
                        <div className="flex justify-end items-center gap-1.5 mb-2.5">
                            <span className="text-[10px] text-gray-300 flex-shrink-0">{audioFile.human_readable_size}</span>
                            <span className="grow text-[10px] text-gray-400 truncate text-left">{audioFile.file_name}</span>
                            <svg className="h-3 w-3 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                    )}
                    {audioError && (
                        <p className="text-[10px] text-red-500 mb-2 text-center">بارگذاری فایل صوتی ناموفق بود</p>
                    )}
                    <div className="flex items-end gap-3">
                        {/* Scrubber + times */}
                        <div className="flex-1 flex flex-col gap-1">
                            <input
                                type="range" min={0} max={100} value={progress}
                                onChange={onSeek}
                                disabled={!audioSrc}
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
                            disabled={!audioSrc}
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
        <Link href={route('front.blog.show', post.slug)} className="group flex flex-col h-full bg-white hover:shadow-md transition-shadow duration-200">
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
                                <span>{fmtDateOnly(fv.value)}</span>
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
                                <span className="font-medium text-gray-600 shrink-0">{fv.definition?.label}:</span>
                                <span className="line-clamp-1">{fv.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

// ── Collapsible tag cloud ─────────────────────────────────────────────────────
const TAGS_COLLAPSE_PX = 128; // ~3 rows on mobile

function CollapsibleTags({ tags }: { tags: BlogTag[] }) {
    const [expanded, setExpanded]   = useState(false);
    const [overflows, setOverflows] = useState(false);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const check = () => {
            if (!innerRef.current) return;
            const mobile = window.innerWidth < 768;
            setOverflows(mobile && innerRef.current.scrollHeight > TAGS_COLLAPSE_PX);
            if (!mobile) setExpanded(false);
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [tags]);

    return (
        <div>
            <div
                ref={innerRef}
                className="relative flex flex-wrap gap-2 overflow-hidden"
                style={{
                    maxHeight: overflows && !expanded ? `${TAGS_COLLAPSE_PX}px` : '9999px',
                    transition: 'max-height 0.35s ease-in-out',
                }}
            >
                {tags.map(tag => {
                    const count = tag.posts_count ?? 0;
                    const tier  = count >= 5 ? 3 : count >= 3 ? 2 : count >= 2 ? 1 : 0;
                    const base  = 'inline-flex items-center gap-1 font-semibold transition-colors duration-200';
                    const sizes  = ['text-xs px-2.5 py-1', 'text-xs px-3 py-1', 'text-sm px-3 py-1', 'text-sm px-3.5 py-1.5'] as const;
                    const styles = [
                        'border border-gray-200 text-gray-500 hover:border-[#F24F00] hover:text-[#F24F00]',
                        'border border-gray-300 text-gray-600 hover:border-[#F24F00] hover:text-[#F24F00]',
                        'border border-[#F24F00]/40 text-[#075F26] hover:bg-[#F24F00] hover:text-white',
                        'bg-[#F24F00] text-white border border-[#F24F00] hover:bg-[#075F26]',
                    ] as const;
                    return (
                        <Link
                            key={tag.id}
                            href={route('front.blog.tag', tag.slug)}
                            className={`${base} ${sizes[tier]} ${styles[tier]}`}
                        >
                            <span className="opacity-50">#</span>
                            {tag.name}
                        </Link>
                    );
                })}

                {/* bottom-fade overlay when collapsed */}
                {overflows && !expanded && (
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                )}
            </div>

            {overflows && (
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="mt-2 flex items-center gap-1 text-xs font-bold text-[#F24F00] hover:text-[#075F26] transition-colors"
                >
                    {expanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// ── Events carousel ───────────────────────────────────────────────────────────
function EventsCarousel({ posts }: { posts: BlogPost[] }) {
    const [index, setIndex] = useState(0);
    const [perPage, setPerPage] = useState(3);

    useEffect(() => {
        const update = () => {
            const n = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
            setPerPage(n);
            setIndex(0);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const maxIndex  = Math.max(0, posts.length - perPage);
    const safeIndex = Math.min(index, maxIndex);
    const itemWidth = 100 / perPage;

    return (
        <div className="relative group/carousel">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${safeIndex * itemWidth}%)` }}
                >
                    {posts.map(post => (
                        <div key={post.id} dir="rtl" className="flex-shrink-0 px-2" style={{ width: `${itemWidth}%` }}>
                            <EventPostCard post={post} />
                        </div>
                    ))}
                </div>
            </div>

            {maxIndex > 0 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`rounded-sm transition-all duration-300 ${i === safeIndex ? 'w-5 h-1.5 bg-[#F24F00]' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'}`}
                        />
                    ))}
                </div>
            )}

            {safeIndex > 0 && (
                <button
                    onClick={() => setIndex(i => i - 1)}
                    className="absolute right-0 top-[45%] -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md hover:bg-[#F24F00] hover:text-white text-gray-700 flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                    aria-label="قبلی"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {safeIndex < maxIndex && (
                <button
                    onClick={() => setIndex(i => i + 1)}
                    className="absolute left-0 top-[45%] -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md hover:bg-[#F24F00] hover:text-white text-gray-700 flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                    aria-label="بعدی"
                >
                    <svg className="w-4 h-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Landing({ sliderPosts, suggestionPosts, trendingPosts, recentPosts, analyzePosts, tags, videoPosts, audioPosts, eventPosts, adBanners }: Props) {
    const { navCategories } = usePage<PageProps>().props;
    const [adsState, setAdsState] = useState<'visible' | 'fading' | 'hidden'>('visible');
    const dismissAds = () => {
        setAdsState('fading');
        setTimeout(() => setAdsState('hidden'), 500);
    };

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

                {/* ── Section 3.5: Ad Banners ─────────────────────────────── */}
                {adBanners.length > 0 && adsState !== 'hidden' && (
                    <section
                        className={`transition-opacity duration-500 ${adsState === 'fading' ? 'opacity-0' : 'opacity-100'}`}
                    >
                        {/* Dotted top border + dismiss button */}
                        <div className="relative border-t-2 border-dashed border-gray-200 mb-4">
                            <button
                                type="button"
                                onClick={dismissAds}
                                title="بستن تبلیغات"
                                className="absolute -top-3.5 left-0 flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-3">
                            {adBanners.slice(0, 2).map((banner, idx) =>
                                banner.image ? (
                                    banner.external_url ? (
                                        <a
                                            key={banner.id}
                                            href={banner.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer sponsored"
                                            title={banner.title}
                                            className="relative block overflow-hidden rounded-lg shadow-md ad-banner-enter"
                                            style={{ animationDelay: `${idx * 0.18}s` }}
                                        >
                                            <img src={`/storage/${banner.image}`} alt={banner.title} className="w-full object-cover ad-banner-breathe" style={{ animationDelay: `${idx * 1.5}s` }} />
                                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ad-banner-shine-loop" style={{ animationDelay: `${idx * 2}s` }} />
                                        </a>
                                    ) : (
                                        <div
                                            key={banner.id}
                                            title={banner.title}
                                            className="relative overflow-hidden rounded-lg shadow-md ad-banner-enter"
                                            style={{ animationDelay: `${idx * 0.18}s` }}
                                        >
                                            <img src={`/storage/${banner.image}`} alt={banner.title} className="w-full object-cover ad-banner-breathe" style={{ animationDelay: `${idx * 1.5}s` }} />
                                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ad-banner-shine-loop" style={{ animationDelay: `${idx * 2}s` }} />
                                        </div>
                                    )
                                ) : null
                            )}
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
                            <SectionHeader title="نبض صدا" href={route('front.blog.category', 'nabze-seda')} />
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
                        <EventsCarousel posts={eventPosts} />
                    </section>
                )}

                {/* ── Section 5: Tags / Topics ─────────────────────────────── */}
                {tags.length > 0 && (
                    <section>
                        <SectionHeader title="موضوعات" />
                        <CollapsibleTags tags={tags} />
                    </section>
                )}

            </div>
        </BlogLayout>
    );
}
