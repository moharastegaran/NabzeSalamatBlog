import { useState, useEffect, type FormEvent } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import BlogLayout from '@/Layouts/BlogLayout';
import AdBannerSlot from '@/Components/AdBannerSlot';
import MostReadWidget from '@/Components/MostReadWidget';
import SeoHead from '@/Components/SeoHead';
import SocialFollowWidget from '@/Components/SocialFollowWidget';
import type { AdBanner, BlogComment, BlogPost, BlogTag, PostFieldValue, PostMedia } from '@/types/models';
import type { PageProps } from '@/types';

interface Props {
    post: BlogPost & { approved_comments: BlogComment[] };
    related: BlogPost[];
    recentPosts: BlogPost[];
    mostRead: BlogPost[];
    adBanners: AdBanner[];
    viewToken: string | null;
}

function formatDate(iso: string) {
    const d = new Date(iso);
    const date = d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    return `${date} — ${time}`;
}

function formatFieldValue(fv: PostFieldValue): string {
    const raw = fv.value?.trim() ?? '';
    if (!raw) return '';

    const type = fv.definition?.field_type;
    if (type === 'date') {
        const d = new Date(raw);
        return Number.isNaN(d.getTime())
            ? raw
            : d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (type === 'number') {
        const n = Number(raw);
        return Number.isFinite(n) ? n.toLocaleString('fa-IR') : raw;
    }
    if (type === 'select') {
        const choice = fv.definition?.options?.choices?.find(c => c.value === raw);
        return choice?.label ?? raw;
    }
    return raw;
}

function mediaSrc(media: PostMedia): string {
    return media.disk === 'public' ? `/storage/${media.path}` : media.url;
}

function parseYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([^?&\s]+)/);
    return m?.[1] ?? null;
}

function PostMediaSection({
    media,
    videoUrl,
    poster,
    title,
}: {
    media?: PostMedia[];
    videoUrl?: string | null;
    poster?: string | null;
    title: string;
}) {
    const videos = (media ?? []).filter(m => m.collection_name === 'video');
    const audios = (media ?? []).filter(m => m.collection_name === 'audio');
    const externalVideo = videoUrl?.trim() || null;

    if (videos.length === 0 && audios.length === 0 && !externalVideo) return null;

    const posterSrc = poster ? `/storage/${poster}` : undefined;

    return (
        <div className="mt-10 space-y-6">
            {(videos.length > 0 || externalVideo) && (
                <div className="border border-gray-200 bg-gray-50/80 overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                        <span className="inline-block h-3 w-3 bg-[#F24F00]" />
                        <h2 className="text-sm font-black text-gray-900">ویدیو</h2>
                    </div>
                    <div className="space-y-4 p-4">
                        {externalVideo && (() => {
                            const ytId = parseYouTubeId(externalVideo);
                            return (
                                <div className="aspect-video overflow-hidden bg-black">
                                    {ytId ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                                            className="h-full w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={title}
                                        />
                                    ) : (
                                        <video
                                            src={externalVideo}
                                            controls
                                            poster={posterSrc}
                                            className="h-full w-full object-contain bg-black"
                                        >
                                            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                                        </video>
                                    )}
                                </div>
                            );
                        })()}
                        {videos.map(item => (
                            <div key={item.id} className="space-y-2">
                                <div className="aspect-video overflow-hidden bg-black">
                                    <video
                                        src={mediaSrc(item)}
                                        controls
                                        preload="metadata"
                                        poster={posterSrc}
                                        className="h-full w-full object-contain bg-black"
                                    >
                                        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                                    </video>
                                </div>
                                {(item.name || item.file_name) && (
                                    <p className="text-xs text-gray-500 truncate">
                                        {item.name || item.file_name}
                                        {item.human_readable_size ? ` · ${item.human_readable_size}` : ''}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {audios.length > 0 && (
                <div className="border border-gray-200 bg-gray-50/80 overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                        <span className="inline-block h-3 w-3 bg-[#F24F00]" />
                        <h2 className="text-sm font-black text-gray-900">فایل صوتی</h2>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {audios.map(item => (
                            <li key={item.id} className="px-4 py-3 space-y-2">
                                <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                                    <span className="font-medium text-gray-700 truncate">
                                        {item.name || item.file_name}
                                    </span>
                                    {item.human_readable_size && (
                                        <span className="shrink-0">{item.human_readable_size}</span>
                                    )}
                                </div>
                                <audio
                                    controls
                                    preload="metadata"
                                    src={mediaSrc(item)}
                                    className="w-full"
                                >
                                    مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
                                </audio>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function PostFieldValues({ values }: { values?: PostFieldValue[] }) {
    const items = (values ?? []).filter(fv => fv.value?.trim() && fv.definition);

    if (items.length === 0) return null;

    return (
        <div className="mt-10 border border-gray-200 bg-gray-50/80">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                <span className="inline-block h-3 w-3 bg-[#F24F00]" />
                <h2 className="text-sm font-black text-gray-900">اطلاعات تکمیلی</h2>
            </div>
            <dl className="divide-y divide-gray-200">
                {items.map(fv => (
                    <div key={fv.id} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:gap-4">
                        <dt className="text-sm font-semibold text-gray-600">{fv.definition?.label}</dt>
                        <dd className="text-sm leading-relaxed text-gray-900 whitespace-pre-wrap">{formatFieldValue(fv)}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

// ── Sidebar header (matches Category.tsx) ─────────────────────────────────────
function SideboxHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b-2 border-[#F24F00]">
            <span className="inline-block w-3 h-3 bg-[#F24F00] shrink-0" />
            <h3 className="text-sm font-black text-gray-900 tracking-tight">{title}</h3>
        </div>
    );
}

// ── Recent / related compact card ─────────────────────────────────────────────
function RecentCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0 group"
        >
            <div className="w-16 h-12 shrink-0 overflow-hidden bg-gray-100">
                {post.featured_image
                    ? <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    : <div className="w-full h-full bg-gray-200" />
                }
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors">
                    {post.title}
                </h4>
                {post.published_at && (
                    <span className="text-[10px] text-gray-400">{new Date(post.published_at).toLocaleDateString('fa-IR')}</span>
                )}
            </div>
        </Link>
    );
}

// ── Mobile share bar (shown below title block, hidden on lg) ─────────────────
function MobileShareBar({ commentCount }: { commentCount: number }) {
    const [pageUrl, setPageUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => { setPageUrl(window.location.href); }, []);

    const shareUrl = encodeURIComponent(pageUrl);

    const copyLink = () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const scrollToComments = () => {
        document.getElementById('post-comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="lg:hidden flex items-center gap-2 border-t border-b border-gray-100 py-2.5 mb-6">
            <a href={pageUrl ? `https://t.me/share/url?url=${shareUrl}` : '#'} target="_blank" rel="noopener noreferrer"
               title="تلگرام" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#229ED9] transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
            </a>
            <a href={pageUrl ? `https://wa.me/?text=${shareUrl}` : '#'} target="_blank" rel="noopener noreferrer"
               title="واتساپ" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#25D366] transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </a>
            <button onClick={copyLink} title={copied ? 'کپی شد!' : 'کپی لینک'}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-[#F24F00]'}`}>
                {copied
                    ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                }
            </button>
            <div className="flex-1" />
            <button onClick={scrollToComments} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#F24F00] transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
                </svg>
                <span className="font-semibold tabular-nums">{commentCount} نظر</span>
            </button>
        </div>
    );
}

// ── Thin right action sidebar ──────────────────────────────────────────────────
function ActionSidebar({ commentCount }: { commentCount: number }) {
    const [pageUrl, setPageUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => { setPageUrl(window.location.href); }, []);

    const shareUrl = encodeURIComponent(pageUrl);

    const copyLink = () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const scrollToComments = () => {
        document.getElementById('post-comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="sticky top-6 flex flex-col items-center gap-3">
            {/* Telegram */}
            <a
                href={pageUrl ? `https://t.me/share/url?url=${shareUrl}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                title="اشتراک در تلگرام"
                className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-500 hover:bg-[#229ED9] hover:text-white transition-colors duration-200"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
            </a>

            {/* WhatsApp */}
            <a
                href={pageUrl ? `https://wa.me/?text=${shareUrl}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                title="اشتراک در واتساپ"
                className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-500 hover:bg-[#25D366] hover:text-white transition-colors duration-200"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </a>

            {/* Copy link */}
            <button
                onClick={copyLink}
                title={copied ? 'کپی شد!' : 'کپی لینک'}
                className={`w-10 h-10 flex items-center justify-center bg-white shadow-sm transition-colors duration-200 ${
                    copied ? 'text-green-500' : 'text-gray-500 hover:bg-[#F24F00] hover:text-white'
                }`}
            >
                {copied ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                )}
            </button>

            <div className="w-5 h-px bg-gray-200" />

            {/* Comments scroll */}
            <button
                onClick={scrollToComments}
                title="رفتن به نظرات"
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#F24F00] transition-colors"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span className="text-[10px] font-semibold tabular-nums">{commentCount}</span>
            </button>
        </div>
    );
}

// ── Comment form ───────────────────────────────────────────────────────────────
type FieldErrors = Partial<Record<'name' | 'email' | 'body', string>>;

function CommentForm({ postId }: { postId: number }) {
    const [form,   setForm]   = useState({ name: '', email: '', body: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({});
    const [globalError,  setGlobalError]  = useState('');

    const inputCls = (field: keyof FieldErrors) =>
        `w-full border bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
            fieldErrors[field]
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-gray-200 focus:border-[#F24F00] focus:ring-[#F24F00]'
        }`;

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setFieldErrors({});
        setGlobalError('');

        try {
            await axios.post(route('blog.comments.store', postId), form);
            setForm({ name: '', email: '', body: '' });
            setStatus('success');
        } catch (err: any) {
            if (err.response?.status === 422) {
                const raw: Record<string, string[]> = err.response.data?.errors ?? {};
                const mapped: FieldErrors = {};
                (Object.keys(raw) as (keyof FieldErrors)[]).forEach(k => { mapped[k] = raw[k][0]; });
                setFieldErrors(mapped);
                setStatus('idle');
            } else {
                setGlobalError('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
                setStatus('error');
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 px-5 py-4">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <p className="text-sm font-bold text-green-800">نظر شما ثبت شد</p>
                    <p className="text-xs text-green-700 mt-0.5">پس از بررسی و تأیید نمایش داده خواهد شد.</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4">

            {status === 'error' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{globalError}</p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">نام <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className={inputCls('name')}
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">ایمیل</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className={inputCls('email')}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">متن نظر <span className="text-red-500">*</span></label>
                <textarea
                    required
                    rows={4}
                    value={form.body}
                    onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                    className={`${inputCls('body')} resize-none`}
                />
                {fieldErrors.body && <p className="mt-1 text-xs text-red-500">{fieldErrors.body}</p>}
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-[#F24F00] px-6 py-2 text-sm font-bold text-white hover:bg-[#d44400] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {status === 'submitting' && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {status === 'submitting' ? 'در حال ارسال...' : 'ارسال نظر'}
            </button>

        </form>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function useReadingTimeBeacon(token: string | null) {
    useEffect(() => {
        if (!token) return;

        let activeSeconds = 0;
        let lastVisible = !document.hidden ? Date.now() : null;
        let interval: ReturnType<typeof setInterval>;

        const tick = () => {
            if (!document.hidden && lastVisible !== null) {
                activeSeconds += (Date.now() - lastVisible) / 1000;
                lastVisible = Date.now();
            }
        };

        const onVisibility = () => {
            if (document.hidden) {
                tick();
                lastVisible = null;
            } else {
                lastVisible = Date.now();
            }
        };

        const send = () => {
            tick();
            const seconds = Math.round(activeSeconds);
            if (seconds < 1) return;
            navigator.sendBeacon('/api/reading-time', JSON.stringify({ token, seconds }));
        };

        interval = setInterval(tick, 1000);
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('pagehide', send);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pagehide', send);
        };
    }, [token]);
}

export default function BlogShow({ post, related, recentPosts, mostRead, adBanners, viewToken }: Props) {
    const date = post.published_at ? formatDate(post.published_at) : null;
    const comments = post.approved_comments ?? [];

    const [copiedShort, setCopiedShort] = useState(false);
    const copyShortLink = () => {
        const url = `${window.location.origin}/${post.short_link}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedShort(true);
            setTimeout(() => setCopiedShort(false), 2000);
        });
    };

    useReadingTimeBeacon(viewToken);

    const { app } = usePage<PageProps>().props;
    const description = post.excerpt
        || post.subtitle
        || undefined;
    const category = post.category ?? post.categories?.[0] ?? null;
    const pageUrl = `${app.url}/blog/${post.slug}`;
    const imageUrl = post.featured_image
        ? `${app.url}/storage/${post.featured_image}`
        : undefined;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        description: description ?? post.title,
        image: imageUrl ? [imageUrl] : undefined,
        datePublished: post.published_at ?? undefined,
        dateModified: post.updated_at ?? post.published_at ?? undefined,
        author: post.author
            ? { '@type': 'Person', name: post.author.name }
            : undefined,
        publisher: {
            '@type': 'Organization',
            name: app.name,
            logo: {
                '@type': 'ImageObject',
                url: `${app.url}/favicon-32x32.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl,
        },
        articleSection: category?.name,
        inLanguage: 'fa-IR',
    };

    return (
        <BlogLayout>
            <SeoHead
                title={post.title}
                description={description}
                image={post.featured_image}
                url={`/blog/${post.slug}`}
                type="article"
                publishedTime={post.published_at}
                modifiedTime={post.updated_at ?? post.published_at}
                author={post.author?.name}
                jsonLd={jsonLd}
            />

            <div className="mx-auto max-w-7xl px-4 pb-8 py-6 sm:px-6 lg:px-8">

                {/* Breadcrumb */}

                {/* 3-column: RTL → col1=right(44px action) | col2=middle(article) | col3=left(sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-[50px_1fr_325px] gap-8 items-start">

                    {/* Thin right action sidebar */}
                    <div className="hidden lg:block">
                        <ActionSidebar commentCount={comments.length} />
                    </div>

                    {/* Main article */}
                    <article className="min-w-0">

                        <div className="flex flex-col lg:flex-row lg:justify-between items-center border-b border-gray-200 py-2 lg:py-5 mb-3 lg:mb-0 gap-2 ">

                            <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                                <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
                                <span>/</span>
                                <Link href={route('front.blog.index')} className="hover:text-gray-600 transition-colors">وبلاگ</Link>
                                {(() => {
                                    const cats = post.categories ?? [];
                                    const cat = (cats.length > 0 ? cats[cats.length - 1] : null)
                                        ?? post.category
                                        ?? null;
                                    if (!cat) return null;

                                    const parent = 'parent' in cat ? cat.parent : null;

                                    return (
                                        <>
                                            {parent && (
                                                <>
                                                    <span>/</span>
                                                    <Link href={route('front.blog.category', parent.slug)} className="hover:text-gray-600 transition-colors">
                                                        {parent.name}
                                                    </Link>
                                                </>
                                            )}
                                            <span>/</span>
                                            <Link href={route('front.blog.category', cat.slug)} className="hover:text-gray-600 transition-colors">
                                                {cat.name}
                                            </Link>
                                        </>
                                    );
                                })()}
                            </nav>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-600">
                                {post.author && (
                                    <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-[#F24F00]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                          <Link href={route('front.blog.author', post.author.id)} className="hover:text-[#F24F00] transition-colors">
                                              {post.author.name}
                                          </Link>
                            </span>
                                )}
                                {date && (
                                    <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-[#F24F00]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                                </svg>
                                        {date}
                            </span>
                                )}
                                {post.time_to_read && (
                                    <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-[#F24F00]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                        {post.time_to_read.toLocaleString('fa-IR')} دقیقه مطالعه
                            </span>
                                )}
                                {post.views > 0 && (
                                    <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-[#F24F00]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                        {post.views.toLocaleString('fa-IR')} بازدید
                            </span>
                                )}
                                {comments.length > 0 && (
                                    <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-[#F24F00]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                                        {comments.length} نظر
                            </span>
                                )}
                            </div>
                        </div>

                          {/* Post title block */}
                          <div className="flex flex-col justify-center gap-2 my-8 h-full">
                              {post.subtitle && (
                                  <div className="inline-flex items-start gap-2 bg-transparent">
                                      <span className="w-1.5 h-1.5 bg-[#F24F00] shrink-0 mt-1" />
                                      <p className="text-sm font-semibold text-[#F24F00] leading-snug text-center lg:text-right">{post.subtitle}</p>
                                  </div>
                              )}
                              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl lg:leading-snug text-center lg:text-right">{post.title}</h1>
                              {/* Lead / Excerpt */}
                              {post.excerpt && (
                                 <blockquote className="border-r-4 border-[#F24F00] bg-[#F24F00]/5 px-3 py-2 text-sm font-medium leading-relaxed text-gray-800 not-italic">
                                     {post.excerpt}
                                 </blockquote>
                              )}
                      </div>


                        {/* Mobile share bar */}
                        <MobileShareBar commentCount={comments.length} />

                        {/* Body — featured image beside content on desktop, above on mobile */}
                        <div className="blog-body flow-root">
                            {post.featured_image && (
                                <div className="w-full lg:w-1/2 lg:float-start overflow-hidden max-h-[300px] lg:max-h-[420px] mb-5 lg:mb-4 lg:me-6">
                                    <img
                                        src={`/storage/${post.featured_image}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div dangerouslySetInnerHTML={{ __html: post.body }} />
                        </div>

                        <PostMediaSection
                            media={post.media}
                            videoUrl={post.video_url}
                            poster={post.featured_image}
                            title={post.title}
                        />

                        <PostFieldValues values={post.field_values} />

                        {/* Short link */}
                        {post.short_link && (
                            <div className="mt-8 flex items-center gap-3 border border-gray-200 bg-gray-50 px-4 py-3 w-full lg:w-2/3">
                                <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </svg>
                                <span className="text-xs text-gray-400 flex-shrink-0 font-medium">لینک کوتاه:</span>
                                <span className="font-mono text-sm text-gray-700 flex-1 select-all truncate">
                                    {typeof window !== 'undefined' ? window.location.origin : ''}/{post.short_link}
                                </span>
                                <button
                                    onClick={copyShortLink}
                                    title={copiedShort ? 'کپی شد!' : 'کپی لینک کوتاه'}
                                    className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 transition-colors ${
                                        copiedShort
                                            ? 'text-[#075F26] bg-green-50'
                                            : 'hover:text-gray-500 text-[#F24F00] bg-[#F24F00]/5'
                                    }`}
                                >
                                    {copiedShort ? (
                                        <>
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span dir="rtl">کپی شد</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                            </svg>
                                            <span dir="rtl">کپی</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Related posts */}
                        {related.length > 0 && (
                            <section className="mt-14">
                                <h2 className="mb-6 flex items-center gap-2 text-base font-black text-gray-900">
                                    <span className="inline-block w-3 h-3 bg-[#F24F00]" />
                                    خبرهای مرتبط
                                </h2>
                                <div className="flex flex-col gap-6">
                                    {related.map(p => (
                                        <Link
                                            key={p.id}
                                            href={route('front.blog.show', p.slug)}
                                            className="group flex flex-row bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
                                        >
                                            <div className="w-28 shrink-0 aspect-square overflow-hidden bg-gray-100">
                                                {p.featured_image ? (
                                                    <img
                                                        src={`/storage/${p.featured_image}`}
                                                        alt={p.title}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-200">
                                                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
                                                {p.subtitle && (
                                                    <p className="text-xs font-medium text-[#F24F00] line-clamp-1">
                                                        {p.subtitle}
                                                    </p>
                                                )}
                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#F24F00] transition-colors leading-snug line-clamp-2">
                                                    {p.title}
                                                </h3>
                                                {p.excerpt && (
                                                    <p className="text-sm text-gray-600 leading-7 line-clamp-3">
                                                        {p.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Comments */}
                        <div id="post-comments" className="mt-14 scroll-mt-6">
                            <h2 className="mb-6 flex items-center gap-2 text-base font-black text-gray-900">
                                <span className="inline-block w-3 h-3 bg-[#F24F00]" />
                                نظرات
                                {comments.length > 0 && (
                                    <span className="text-sm font-normal text-gray-400">({comments.length})</span>
                                )}
                            </h2>

                            {comments.length > 0 && (
                                <div className="mb-8 space-y-4">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="bg-white p-5 shadow-sm">
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="font-bold text-gray-800 text-sm">{comment.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(comment.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-7">{comment.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="bg-white p-6 shadow-sm">
                                <h3 className="mb-5 flex items-center gap-2 text-sm font-black text-gray-800">
                                    <span className="inline-block w-2.5 h-2.5 bg-[#F24F00]" />
                                    ثبت نظر
                                </h3>
                                <CommentForm postId={post.id} />
                            </div>
                        </div>
                    </article>

                    {/* Left sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-6">

                        {/* Most read this week */}
                        {mostRead.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <MostReadWidget posts={mostRead} />
                            </div>
                        )}

                        {/* Recent posts */}
                        {recentPosts.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <SideboxHeader title="جدیدترین خبرها" />
                                <div>
                                    {recentPosts.map(p => <RecentCard key={p.id} post={p} />)}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <SideboxHeader title="برچسب‌ها" />
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: BlogTag) => (
                                        <Link key={tag.id} href={route('front.blog.tag', tag.slug)}
                                            className="bg-[#F24F00]/10 px-3 py-1 text-xs font-bold text-[#F24F00] hover:bg-[#F24F00] hover:text-white transition-colors">
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        {post.category && (
                            <div className="bg-white p-4 shadow-sm">
                                <SideboxHeader title="دسته‌بندی" />
                                <Link
                                    href={route('front.blog.category', post.category.slug)}
                                    className="flex items-center justify-between py-1.5 text-sm text-gray-700 hover:text-[#F24F00] transition-colors group"
                                >
                                    <span>{post.category.name}</span>
                                    <svg className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F24F00] transition-colors -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {/* Ad banners */}
                        {adBanners.length > 0 && (
                            <AdBannerSlot banners={adBanners} />
                        )}

                        {/* Social */}
                        <div className="bg-white p-4 shadow-sm">
                            <SideboxHeader title="ما را دنبال کنید" />
                            <SocialFollowWidget variant="circles" />
                        </div>

                    </aside>
                </div>
            </div>
        </BlogLayout>
    );
}
