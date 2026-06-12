import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';
import { formatPrice } from '@/utils/currency';
import BlogCard from '@/Components/BlogCard';
import { BlogComment, BlogPost, BlogTag, Product, ProductCategory } from '@/types/models';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface FullPost extends BlogPost {
    tags: BlogTag[];
    products: Pick<Product, 'id' | 'title' | 'images'>[];
    product_categories: Pick<ProductCategory, 'id' | 'name'>[];
    approved_comments: BlogComment[];
}

interface Props {
    post: FullPost;
    related: BlogPost[];
    saleProducts: Product[];
    recentPosts: BlogPost[];
    latestProducts: Product[];
    cartCount: number;
}

const fmtDate = (d?: string | null) => {
    if (!d) return '';
    try {
        return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric', month: 'short', day: 'numeric',
        }).format(new Date(d));
    } catch { return d.slice(0, 10); }
};

export default function BlogShow({ post, related, saleProducts = [], recentPosts = [], latestProducts = [], cartCount }: Props) {
    const [name, setName]           = useState('');
    const [email, setEmail]         = useState('');
    const [body, setBody]           = useState('');
    const [errors, setErrors]       = useState<Record<string, string>>({});
    const [success, setSuccess]     = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied]       = useState(false);

    // ── Carousel ──────────────────────────────────────────────────────────────
    const TOTAL = latestProducts.length;
    const [slideIndex, setSlideIndex] = useState(0);
    const [visibleCols, setVisibleCols] = useState(4);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            setVisibleCols(w >= 1024 ? 4 : w >= 640 ? 2 : 1);
            setSlideIndex(0);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const maxSlide  = Math.max(0, TOTAL - visibleCols);
    const canPrev   = slideIndex > 0;
    const canNext   = slideIndex < maxSlide;
    const prevSlide = () => setSlideIndex(s => Math.max(0, s - 1));
    const nextSlide = () => setSlideIndex(s => Math.min(maxSlide, s + 1));

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setSuccess('');
        try {
            const { data } = await axios.post(route('blog.comments.store', post.id), { name, email, body });
            setSuccess(data.message);
            setName(''); setEmail(''); setBody('');
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = (platform: 'instagram' | 'whatsapp') => {
        const url   = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        const links = {
            whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
            instagram: `https://t.me/share/url?url=${url}&text=${title}`,
            // twitter:  `https://x.com/intent/tweet?url=${url}&text=${title}`,
        };
        window.open(links[platform], '_blank', 'noopener,noreferrer');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <ShopLayout cartCount={cartCount}>
            <Head title={post.title} />
             <div className="min-h-screen mx-auto max-w-shop px-4 py-10 sm:px-6 lg:px-0">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-[#B8181E]">
                        <Link href={route('shop.landing')} className="hover:text-gray-600">خانه</Link>
                        <span>{">"}</span>
                        <Link href={route('shop.blog.index')} className="hover:text-gray-600">وبلاگ</Link>
                        {post.category && (
                            <>
                                <span>{">"}</span>
                                <span className="text-gray-500">{post.category.name}</span>
                            </>
                        )}
                    </nav>

                    {/* Two-column layout — in RTL the first grid column sits on the right */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] sm:gap-6 lg:gap-10">

                        {/* ── Main content ── */}
                        <div className="min-w-0 space-y-20">

                            {/* Article */}
                            <article className="overflow-hidden">
                                <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-5">
                                    <div className="bg-[#F2F2F2] p-8 rounded-t-3xl ">
                                        <h1 className="text-2xl font-bold text-black leading-relaxed">{post.title}</h1>
                                        <p className="text-base text-[#1A1528] mt-5">{post.excerpt}</p>
                                    </div>
                                    <div className="relative mb-4">
                                        <svg viewBox="0 0 135 70" fill="none" xmlns="http://www.w3.org/2000/svg"
                                             className="absolute -right-0 -bottom-1 lg:w-[200px] w-[140px] z-10 -scale-x-100">
                                            <path
                                                d="M1.17338e-08 0C0 15 12.5 22.5 22 22.5H89C103 22.5 114 34.5 114 48.5C114 61 125.5 70 135 70H1.17338e-08V0Z"
                                                fill="white"></path>
                                        </svg>
                                        <div className="flex flex-col gap-2 absolute right-3 bottom-3 z-20">
                                            {post.author &&
                                                <div className="flex flex-row items-center gap-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none"
                                                    className="">
                                                        <path d="M9.91658 10.7414C12.1983 10.7414 14.048 8.89167 14.048 6.60994C14.048 4.32822 12.1983 2.47852 9.91658 2.47852C7.63486 2.47852 5.78516 4.32822 5.78516 6.60994C5.78516 8.89167 7.63486 10.7414 9.91658 10.7414Z" stroke="#B8181E" stroke-width="1.65257" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M16.5253 17.3525C16.5253 15.5993 15.8288 13.918 14.5891 12.6783C13.3495 11.4386 11.6681 10.7422 9.91497 10.7422C8.16181 10.7422 6.48046 11.4386 5.24079 12.6783C4.00113 13.918 3.30469 15.5993 3.30469 17.3525" stroke="#B8181E" stroke-width="1.65257" stroke-linejoin="round"/>
                                                    </svg>
                                                    <span className="text-base leading-tight">{post.author.name}</span>
                                                </div>
                                            }
                                            <div className="flex flex-row items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                                                    <g clip-path="url(#clip0_1635_25730)">
                                                        <mask id="mask0_1635_25730" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                                            <path d="M19.8308 0H0V19.8308H19.8308V0Z" fill="white"/>
                                                        </mask>
                                                        <g mask="url(#mask0_1635_25730)">
                                                            <mask id="path-2-inside-1_1635_25730" fill="white">
                                                                <path d="M9.91382 18.7983C5.01395 18.7983 1.03125 14.8156 1.03125 9.91577C1.03125 5.0159 5.01395 1.0332 9.91382 1.0332C14.8137 1.0332 18.7964 5.0159 18.7964 9.91577C18.7964 14.8156 14.8137 18.7983 9.91382 18.7983ZM9.91382 2.27263C5.69976 2.27263 2.27068 5.70172 2.27068 9.91577C2.27068 14.1298 5.69976 17.5589 9.91382 17.5589C14.1279 17.5589 17.557 14.1298 17.557 9.91577C17.557 5.70172 14.1279 2.27263 9.91382 2.27263Z"/>
                                                            </mask>
                                                            <path d="M9.91382 18.7983C5.01395 18.7983 1.03125 14.8156 1.03125 9.91577C1.03125 5.0159 5.01395 1.0332 9.91382 1.0332C14.8137 1.0332 18.7964 5.0159 18.7964 9.91577C18.7964 14.8156 14.8137 18.7983 9.91382 18.7983ZM9.91382 2.27263C5.69976 2.27263 2.27068 5.70172 2.27068 9.91577C2.27068 14.1298 5.69976 17.5589 9.91382 17.5589C14.1279 17.5589 17.557 14.1298 17.557 9.91577C17.557 5.70172 14.1279 2.27263 9.91382 2.27263Z" fill="#B8181E"/>
                                                            <path d="M9.91382 18.7983V17.1458C5.92664 17.1458 2.68382 13.903 2.68382 9.91577H1.03125H-0.621321C-0.621321 15.7283 4.10126 20.4509 9.91382 20.4509V18.7983ZM1.03125 9.91577H2.68382C2.68382 5.92859 5.92664 2.68577 9.91382 2.68577V1.0332V-0.619368C4.10126 -0.619368 -0.621321 4.10321 -0.621321 9.91577H1.03125ZM9.91382 1.0332V2.68577C13.901 2.68577 17.1438 5.92859 17.1438 9.91577H18.7964H20.449C20.449 4.10321 15.7264 -0.619368 9.91382 -0.619368V1.0332ZM18.7964 9.91577H17.1438C17.1438 13.903 13.901 17.1458 9.91382 17.1458V18.7983V20.4509C15.7264 20.4509 20.449 15.7283 20.449 9.91577H18.7964ZM9.91382 2.27263V0.62006C4.78707 0.62006 0.618107 4.78903 0.618107 9.91577H2.27068H3.92325C3.92325 6.61441 6.61245 3.9252 9.91382 3.9252V2.27263ZM2.27068 9.91577H0.618107C0.618107 15.0425 4.78707 19.2115 9.91382 19.2115V17.5589V15.9063C6.61245 15.9063 3.92325 13.2171 3.92325 9.91577H2.27068ZM9.91382 17.5589V19.2115C15.0406 19.2115 19.2095 15.0425 19.2095 9.91577H17.557H15.9044C15.9044 13.2171 13.2152 15.9063 9.91382 15.9063V17.5589ZM17.557 9.91577H19.2095C19.2095 4.78903 15.0406 0.62006 9.91382 0.62006V2.27263V3.9252C13.2152 3.9252 15.9044 6.61441 15.9044 9.91577H17.557Z" fill="#B8181E" mask="url(#path-2-inside-1_1635_25730)"/>
                                                            <mask id="path-4-inside-2_1635_25730" fill="white">
                                                                <path d="M12.9788 13.163C12.8714 13.163 12.764 13.1382 12.6648 13.0721L10.1033 11.5435C9.46708 11.1634 8.99609 10.3288 8.99609 9.59345V6.20565C8.99609 5.86687 9.27703 5.58594 9.61581 5.58594C9.95458 5.58594 10.2355 5.86687 10.2355 6.20565V9.59345C10.2355 9.89091 10.4834 10.3288 10.7396 10.4776L13.301 12.0062C13.5985 12.1797 13.6894 12.5598 13.5159 12.8573C13.3919 13.0556 13.1854 13.163 12.9788 13.163Z"/>
                                                            </mask>
                                                            <path d="M12.9788 13.163C12.8714 13.163 12.764 13.1382 12.6648 13.0721L10.1033 11.5435C9.46708 11.1634 8.99609 10.3288 8.99609 9.59345V6.20565C8.99609 5.86687 9.27703 5.58594 9.61581 5.58594C9.95458 5.58594 10.2355 5.86687 10.2355 6.20565V9.59345C10.2355 9.89091 10.4834 10.3288 10.7396 10.4776L13.301 12.0062C13.5985 12.1797 13.6894 12.5598 13.5159 12.8573C13.3919 13.0556 13.1854 13.163 12.9788 13.163Z" fill="#B8181E"/>
                                                            <path d="M12.6648 13.0721L13.5815 11.6971L13.5471 11.6742L13.5117 11.653L12.6648 13.0721ZM10.1033 11.5435L9.25579 12.9622L9.25644 12.9626L10.1033 11.5435ZM10.7396 10.4776L11.5864 9.05849L11.5779 9.05342L11.5694 9.04845L10.7396 10.4776ZM13.301 12.0062L12.4542 13.4253L12.4612 13.4295L12.4684 13.4337L13.301 12.0062ZM13.5159 12.8573L14.9173 13.7331L14.9306 13.7117L14.9433 13.69L13.5159 12.8573ZM12.9788 13.163V11.5104C13.135 11.5104 13.3614 11.5503 13.5815 11.6971L12.6648 13.0721L11.7481 14.4471C12.1666 14.7261 12.6078 14.8156 12.9788 14.8156V13.163ZM12.6648 13.0721L13.5117 11.653L10.9502 10.1244L10.1033 11.5435L9.25644 12.9626L11.8179 14.4912L12.6648 13.0721ZM10.1033 11.5435L10.9508 10.1248C10.815 10.0437 10.6487 9.74855 10.6487 9.59345H8.99609H7.34352C7.34352 10.9091 8.11912 12.2831 9.25579 12.9622L10.1033 11.5435ZM8.99609 9.59345H10.6487V6.20565H8.99609H7.34352V9.59345H8.99609ZM8.99609 6.20565H10.6487C10.6487 6.77956 10.1897 7.23851 9.61581 7.23851V5.58594V3.93337C8.36434 3.93337 7.34352 4.95418 7.34352 6.20565H8.99609ZM9.61581 5.58594V7.23851C9.0419 7.23851 8.58295 6.77956 8.58295 6.20565H10.2355H11.8881C11.8881 4.95418 10.8673 3.93337 9.61581 3.93337V5.58594ZM10.2355 6.20565H8.58295V9.59345H10.2355H11.8881V6.20565H10.2355ZM10.2355 9.59345H8.58295C8.58295 10.1334 8.78219 10.6044 8.955 10.9083C9.12662 11.21 9.4331 11.6299 9.90974 11.9067L10.7396 10.4776L11.5694 9.04845C11.6984 9.12335 11.7669 9.19702 11.7875 9.22016C11.8132 9.24907 11.8241 9.26745 11.828 9.27428C11.8319 9.28123 11.8414 9.29867 11.8523 9.33294C11.861 9.36013 11.8881 9.45122 11.8881 9.59345H10.2355ZM10.7396 10.4776L9.89268 11.8967L12.4542 13.4253L13.301 12.0062L14.1479 10.5871L11.5864 9.05849L10.7396 10.4776ZM13.301 12.0062L12.4684 13.4337C11.9402 13.1256 11.8241 12.4778 12.0884 12.0246L13.5159 12.8573L14.9433 13.69C15.5547 12.6419 15.2568 11.2339 14.1337 10.5787L13.301 12.0062ZM13.5159 12.8573L12.1145 11.9814C12.2912 11.6987 12.613 11.5104 12.9788 11.5104V13.163V14.8156C13.7577 14.8156 14.4927 14.4125 14.9173 13.7331L13.5159 12.8573Z" fill="#B8181E" mask="url(#path-4-inside-2_1635_25730)"/>
                                                        </g>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1635_25730">
                                                            <rect width="19.8308" height="19.8308" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span className="text-base leading-tight">1405/03/12</span>
                                            </div>
                                        </div>
                                        {post.featured_image && (
                                            <img
                                                src={`/storage/${post.featured_image}`}
                                                alt={post.title}
                                                className="w-full max-h-80 object-cover rounded-3xl"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 sm:p-8 bg-[#F2F2F2] rounded-b-3xl rounded-tl-3xl">
                                    {/*<div className="mt-2 flex items-center gap-3 text-sm text-gray-400">*/}
                                    {/*    {post.author && <span>{post.author.name}</span>}*/}
                                    {/*    <span>·</span>*/}
                                    {/*    <span>{post.views} بازدید</span>*/}
                                    {/*    <span>·</span>*/}
                                    {/*    <span>{post.approved_comments?.length ?? 0} نظر</span>*/}
                                    {/*</div>*/}

                                    {/* Tags */}
                                    {/*{post.tags && post.tags.length > 0 && (*/}
                                    {/*    <div className="mt-4 flex flex-wrap gap-2">*/}
                                    {/*        {post.tags.map(tag => (*/}
                                    {/*            <span key={tag.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">*/}
                                    {/*                #{tag.name}*/}
                                    {/*            </span>*/}
                                    {/*        ))}*/}
                                    {/*    </div>*/}
                                    {/*)}*/}

                                    {/* Body */}
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700"
                                        dir="rtl"
                                        dangerouslySetInnerHTML={{ __html: post.body }}
                                    />

                                    {/* Linked products */}
                                    {post.products && post.products.length > 0 && (
                                        <div className="mt-8 border-t pt-6">
                                            <h3 className="mb-3 text-sm font-bold text-[#1A1528]">محصولات مرتبط</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {post.products.map(p => (
                                                    <Link
                                                        key={p.id}
                                                        href={route('shop.show', p.id)}
                                                        className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                                                    >
                                                        {p.images?.[0] && (
                                                            <img src={`/storage/${p.images[0]}`} alt={p.title} className="h-8 w-8 rounded object-cover" />
                                                        )}
                                                        <span className="text-gray-700">{p.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Linked product categories */}
                                    {post.product_categories && post.product_categories.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="mb-3 text-sm font-bold text-[#1A1528]">دسته‌بندی‌های مرتبط</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {post.product_categories.map(c => (
                                                    <Link
                                                        key={c.id}
                                                        href={route('shop.index') + `?category_id=${c.id}`}
                                                        className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-[#E31F25] hover:bg-red-100 transition-colors"
                                                    >
                                                        {c.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>

                            {/* Comments */}
                            <section className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-[#1F0001]">
                                        دیدگاه کاربران
                                    </h2>
                                    <button className="bg-transparent text-base text-[#404040] font-normal">
                                        {post.approved_comments?.length>0 ? `مشاهده ${post.approved_comments?.length} دیدگاه` : 'هنوز دیدگاهی ثبت نشده است'}
                                    </button>
                                </div>

                                {post.approved_comments?.map(comment => (
                                    <div key={comment.id} className="rounded-2xl bg-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[#E31F25]">
                                                {comment.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1A1528]">{comment.name}</p>
                                                <p className="text-xs text-gray-400">{fmtDate(comment.created_at)}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
                                    </div>
                                ))}

                                {/* Comment form */}
                                <div className="rounded-2xl bg-white">
                                    {success && (
                                        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</div>
                                    )}

                                    <form onSubmit={submitComment} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    placeholder="نام*"
                                                    onChange={e => setName(e.target.value)}
                                                    className="w-full bg-[#F2F2F2] rounded-3xl sm:px-4 sm:py-3 px-2 py-1 text-base outline-none border-none focus:border-[#E31F25] focus:ring-1 focus:ring-[#E31F25]"
                                                />
                                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    placeholder="ایمیل*"
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="w-full bg-[#F2F2F2] rounded-3xl sm:px-4 sm:py-3 px-2 py-1 text-base outline-none border-none focus:border-[#E31F25] focus:ring-1 focus:ring-[#E31F25]"
                                                />
                                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <textarea
                                                value={body}
                                                onChange={e => setBody(e.target.value)}
                                                rows={6}
                                                placeholder="نظر خود را درباره این مطلب به اشتراک بگذارید"
                                                className="w-full bg-[#F2F2F2] rounded-3xl sm:p-4 p-2 text-base outline-none border-none focus:ring-1 focus:ring-[#E31F25] resize-none"
                                            />
                                            {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="rounded-full bg-[#B8181E] px-6 py-2.5 text-base font-semibold text-white hover:bg-[#E31F25] disabled:opacity-60 transition-colors mr-auto"
                                        >
                                            {submitting ? 'در حال ثبت...' : 'ثبت دیدگاه'}
                                        </button>
                                    </form>
                                </div>
                            </section>
                        </div>

                        {/* ── Sidebar ── */}
                        <aside className="space-y-4 lg:space-y-8 lg:sticky lg:top-24 lg:self-start">

                            {/* Card 1 — Share */}
                            <div className="rounded-3xl bg-[#F2F2F2] p-5">
                                <h3 className="mb-5 text-lg font-semibold text-[#1A1528]">اشتراک‌گذاری</h3>
                                <div className="flex items-center gap-x-2">

                                    {/* Telegram */}
                                    <button
                                        onClick={() => handleShare('whatsapp')}
                                        title="اشتراک در واتساپ"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2AABEE] text-white transition-opacity hover:opacity-80 bg-gradient-to-l from-[#E9C7C8] to-[#BE0003]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                            <path d="M5.16292 15.7999L5.44567 15.9673C6.6332 16.6721 7.99481 17.0449 9.38336 17.0456H9.38627C13.6505 17.0456 17.1208 13.576 17.1226 9.3115C17.1234 7.24499 16.3194 5.3017 14.8588 3.8399C14.1423 3.11898 13.2901 2.54732 12.3512 2.15801C11.4124 1.7687 10.4057 1.56947 9.38931 1.57186C5.12181 1.57186 1.65131 5.0411 1.64979 9.3053C1.64769 10.7614 2.05773 12.1884 2.83252 13.4212L3.01659 13.7137L2.23489 16.5675L5.16292 15.7999ZM0 18.7784L1.32062 13.9566C0.506159 12.5456 0.077676 10.9447 0.078182 9.30467C0.0803327 4.17401 4.25561 0 9.3864 0C11.8762 0.00126508 14.2132 0.970191 15.9708 2.72903C17.7283 4.48788 18.6954 6.82575 18.6945 9.31214C18.6922 14.4424 14.5163 18.6172 9.38627 18.6172H9.38222C7.82453 18.6166 6.2939 18.2258 4.93432 17.4844L0 18.7784Z" fill="#F6F4FB"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.9659 5.31934C6.79157 4.9321 6.60814 4.92425 6.44254 4.91755L5.99672 4.91211C5.84162 4.91211 5.58962 4.9703 5.37658 5.20308C5.16354 5.43585 4.5625 5.99843 4.5625 7.1427C4.5625 8.28697 5.39594 9.39265 5.51207 9.548C5.6282 9.70335 7.121 12.1264 9.48506 13.0586C11.4496 13.8333 11.8494 13.6792 12.276 13.6405C12.7025 13.6018 13.652 13.078 13.8457 12.5349C14.0394 11.9918 14.0395 11.5265 13.9814 11.4292C13.9233 11.3319 13.7682 11.2741 13.5355 11.1577C13.3027 11.0413 12.1594 10.4787 11.9463 10.401C11.7331 10.3234 11.5781 10.2848 11.4229 10.5176C11.2677 10.7503 10.8225 11.2739 10.6868 11.4292C10.551 11.5844 10.4155 11.6039 10.1827 11.4876C9.94997 11.3714 9.20105 11.1257 8.31245 10.3334C7.62109 9.71689 7.1544 8.95556 7.01853 8.72291C6.88266 8.49026 7.00411 8.36426 7.12075 8.24838C7.22512 8.14414 7.35327 7.97677 7.46978 7.84103C7.5863 7.70528 7.62463 7.60825 7.70205 7.45328C7.77948 7.29831 7.74089 7.16218 7.6827 7.04592C7.6245 6.92966 7.17262 5.77932 6.9659 5.31934Z" fill="#F6F4FB"/>
                                        </svg>
                                    </button>

                                    {/* WhatsApp */}
                                    <button
                                        onClick={() => handleShare('instagram')}
                                        title="اشتراک در اینستاگرام"
                                        className="flex h-9 w-9  items-center justify-center rounded-full text-white transition-opacity hover:opacity-80 bg-gradient-to-l from-[#E9C7C8] to-[#BE0003]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 20 20" fill="none">
                                            <g clip-path="url(#clip0_1543_23518)">
                                                <path d="M13.949 1.9209H5.68611C3.40439 1.9209 1.55469 3.7706 1.55469 6.05233V14.3152C1.55469 16.5969 3.40439 18.4466 5.68611 18.4466H13.949C16.2307 18.4466 18.0804 16.5969 18.0804 14.3152V6.05233C18.0804 3.7706 16.2307 1.9209 13.949 1.9209Z" stroke="#F6F4FB" stroke-width="2.01981" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M13.2191 9.39553C13.321 10.0832 13.2036 10.7855 12.8834 11.4026C12.5632 12.0197 12.0566 12.5201 11.4356 12.8326C10.8147 13.1452 10.111 13.254 9.42459 13.1435C8.73823 13.0331 8.10416 12.709 7.61259 12.2174C7.12101 11.7259 6.79696 11.0918 6.68651 10.4054C6.57607 9.71907 6.68486 9.01535 6.99741 8.39438C7.30996 7.77341 7.81036 7.26681 8.42743 6.94662C9.0445 6.62644 9.74681 6.50898 10.4345 6.61095C11.1359 6.71497 11.7853 7.04183 12.2868 7.54325C12.7882 8.04468 13.1151 8.69408 13.2191 9.39553Z" stroke="#F6F4FB" stroke-width="2.01981" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M14.4609 5.37109H14.4693" stroke="#F6F4FB" stroke-width="2.01981" stroke-linecap="round" stroke-linejoin="round"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1543_23518">
                                                    <rect width="19.8308" height="19.8308" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </button>

                                    {/* Copy link */}
                                    <button
                                        onClick={copyLink}
                                        title="کپی لینک"
                                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                            copied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gradient-to-l from-[#E9C7C8] to-[#BE0003] hover:bg-gray-200'
                                        }`}
                                    >
                                        {copied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.8496 7.68949C19.4925 7.68949 20.8243 6.3577 20.8243 4.71486C20.8243 3.07202 19.4925 1.74023 17.8496 1.74023C16.2068 1.74023 14.875 3.07202 14.875 4.71486C14.875 6.3577 16.2068 7.68949 17.8496 7.68949Z" stroke="#F6F4FB" stroke-width="1.98308" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M5.95119 14.6309C7.59403 14.6309 8.92582 13.2991 8.92582 11.6563C8.92582 10.0134 7.59403 8.68164 5.95119 8.68164C4.30835 8.68164 2.97656 10.0134 2.97656 11.6563C2.97656 13.2991 4.30835 14.6309 5.95119 14.6309Z" stroke="#F6F4FB" stroke-width="1.98308" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M17.8496 21.5713C19.4925 21.5713 20.8243 20.2395 20.8243 18.5967C20.8243 16.9539 19.4925 15.6221 17.8496 15.6221C16.2068 15.6221 14.875 16.9539 14.875 18.5967C14.875 20.2395 16.2068 21.5713 17.8496 21.5713Z" stroke="#F6F4FB" stroke-width="1.98308" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M8.51562 13.1533L15.2879 17.0997" stroke="#F6F4FB" stroke-width="1.98308" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M15.2779 6.21191L8.51562 10.1583" stroke="#F6F4FB" stroke-width="1.98308" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Card 2 — Related posts */}
                            {related.length > 0 && (
                                <div className="rounded-3xl bg-[#F2F2F2] p-5">
                                    <h3 className="mb-5 text-lg font-semibold text-[#1A1528] mb-5">مطالب مرتبط</h3>
                                    {related.slice(0, 6).map(rel => (
                                        <Link
                                            key={rel.id}
                                            href={route('shop.blog.show', rel.slug)}
                                            className="flex items-end gap-3 group border-b border-1 border-[#D5D5D5AA] pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
                                        >
                                            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                {rel.featured_image ? (
                                                    <img
                                                        src={`/storage/${rel.featured_image}`}
                                                        alt={rel.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between" style={{height:'stretch'}}>
                                                <p className="grow text-xs font-semibold leading-snug text-[#1A1528] line-clamp-2 group-hover:text-[#E31F25] transition-colors">
                                                    {rel.title}
                                                </p>
                                                {rel.published_at && (
                                                    <p className="mt-1 text-[10px] text-[#5C5C5C] flex flex-row items-center gap-0.5">
                                                        <span>{fmtDate(rel.published_at)}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11 11" fill="none">
                                                            <mask id="path-1-inside-1_1986_24870" fill="white">
                                                                <path d="M5.33176 10.6635C2.39061 10.6635 0 8.27291 0 5.33176C0 2.39061 2.39061 0 5.33176 0C8.27291 0 10.6635 2.39061 10.6635 5.33176C10.6635 8.27291 8.27291 10.6635 5.33176 10.6635ZM5.33176 0.743966C2.80227 0.743966 0.743966 2.80227 0.743966 5.33176C0.743966 7.86124 2.80227 9.91955 5.33176 9.91955C7.86124 9.91955 9.91955 7.86124 9.91955 5.33176C9.91955 2.80227 7.86124 0.743966 5.33176 0.743966Z"/>
                                                            </mask>
                                                            <path d="M5.33176 10.6635C2.39061 10.6635 0 8.27291 0 5.33176C0 2.39061 2.39061 0 5.33176 0C8.27291 0 10.6635 2.39061 10.6635 5.33176C10.6635 8.27291 8.27291 10.6635 5.33176 10.6635ZM5.33176 0.743966C2.80227 0.743966 0.743966 2.80227 0.743966 5.33176C0.743966 7.86124 2.80227 9.91955 5.33176 9.91955C7.86124 9.91955 9.91955 7.86124 9.91955 5.33176C9.91955 2.80227 7.86124 0.743966 5.33176 0.743966Z" fill="#B8181E"/>
                                                            <path d="M5.33176 10.6635V9.67156C2.93845 9.67156 0.991955 7.72506 0.991955 5.33176H0H-0.991955C-0.991955 8.82075 1.84277 11.6555 5.33176 11.6555V10.6635ZM0 5.33176H0.991955C0.991955 2.93845 2.93845 0.991955 5.33176 0.991955V0V-0.991955C1.84277 -0.991955 -0.991955 1.84277 -0.991955 5.33176H0ZM5.33176 0V0.991955C7.72506 0.991955 9.67156 2.93845 9.67156 5.33176H10.6635H11.6555C11.6555 1.84277 8.82075 -0.991955 5.33176 -0.991955V0ZM10.6635 5.33176H9.67156C9.67156 7.72506 7.72506 9.67156 5.33176 9.67156V10.6635V11.6555C8.82075 11.6555 11.6555 8.82075 11.6555 5.33176H10.6635ZM5.33176 0.743966V-0.247989C2.25443 -0.247989 -0.247989 2.25443 -0.247989 5.33176H0.743966H1.73592C1.73592 3.35011 3.35011 1.73592 5.33176 1.73592V0.743966ZM0.743966 5.33176H-0.247989C-0.247989 8.40909 2.25443 10.9115 5.33176 10.9115V9.91955V8.9276C3.35011 8.9276 1.73592 7.3134 1.73592 5.33176H0.743966ZM5.33176 9.91955V10.9115C8.40909 10.9115 10.9115 8.40909 10.9115 5.33176H9.91955H8.9276C8.9276 7.3134 7.3134 8.9276 5.33176 8.9276V9.91955ZM9.91955 5.33176H10.9115C10.9115 2.25443 8.40909 -0.247989 5.33176 -0.247989V0.743966V1.73592C7.3134 1.73592 8.9276 3.35011 8.9276 5.33176H9.91955Z" fill="#B8181E" mask="url(#path-1-inside-1_1986_24870)"/>
                                                            <mask id="path-3-inside-2_1986_24870" fill="white">
                                                                <path d="M7.17186 7.28055C7.10738 7.28055 7.04291 7.26567 6.98339 7.22599L5.44586 6.30843C5.06396 6.08029 4.78125 5.57935 4.78125 5.13793V3.10441C4.78125 2.90105 4.94988 2.73242 5.15323 2.73242C5.35658 2.73242 5.52522 2.90105 5.52522 3.10441V5.13793C5.52522 5.31648 5.67401 5.57935 5.82776 5.66862L7.36529 6.58618C7.54384 6.69034 7.5984 6.91849 7.49425 7.09704C7.41985 7.21607 7.29586 7.28055 7.17186 7.28055Z"/>
                                                            </mask>
                                                            <path d="M7.17186 7.28055C7.10738 7.28055 7.04291 7.26567 6.98339 7.22599L5.44586 6.30843C5.06396 6.08029 4.78125 5.57935 4.78125 5.13793V3.10441C4.78125 2.90105 4.94988 2.73242 5.15323 2.73242C5.35658 2.73242 5.52522 2.90105 5.52522 3.10441V5.13793C5.52522 5.31648 5.67401 5.57935 5.82776 5.66862L7.36529 6.58618C7.54384 6.69034 7.5984 6.91849 7.49425 7.09704C7.41985 7.21607 7.29586 7.28055 7.17186 7.28055Z" fill="#B8181E"/>
                                                            <path d="M6.98339 7.22599L7.53363 6.40064L7.51301 6.38689L7.49172 6.37419L6.98339 7.22599ZM5.44586 6.30843L4.93713 7.16L4.93753 7.16024L5.44586 6.30843ZM5.82776 5.66862L6.33613 4.81676L6.32586 4.81079L5.82776 5.66862ZM7.36529 6.58618L6.85693 7.43803L6.86547 7.44301L7.36529 6.58618ZM7.49425 7.09704L8.33542 7.62277L8.34345 7.60993L8.35108 7.59686L7.49425 7.09704ZM7.17186 7.28055V6.2886C7.26562 6.2886 7.4015 6.31255 7.53363 6.40064L6.98339 7.22599L6.43315 8.05135C6.68432 8.21879 6.94915 8.27251 7.17186 8.27251V7.28055ZM6.98339 7.22599L7.49172 6.37419L5.95419 5.45663L5.44586 6.30843L4.93753 7.16024L6.47506 8.0778L6.98339 7.22599ZM5.44586 6.30843L5.95459 5.45687C5.87307 5.40817 5.77321 5.23103 5.77321 5.13793H4.78125H3.78929C3.78929 5.92767 4.25484 6.7524 4.93713 7.16L5.44586 6.30843ZM4.78125 5.13793H5.77321V3.10441H4.78125H3.78929V5.13793H4.78125ZM4.78125 3.10441H5.77321C5.77321 3.4489 5.49772 3.72438 5.15323 3.72438V2.73242V1.74047C4.40204 1.74047 3.78929 2.35321 3.78929 3.10441H4.78125ZM5.15323 2.73242V3.72438C4.80874 3.72438 4.53326 3.4489 4.53326 3.10441H5.52522H6.51717C6.51717 2.35321 5.90443 1.74047 5.15323 1.74047V2.73242ZM5.52522 3.10441H4.53326V5.13793H5.52522H6.51717V3.10441H5.52522ZM5.52522 5.13793H4.53326C4.53326 5.46202 4.65285 5.74478 4.75658 5.92716C4.8596 6.10829 5.04356 6.36033 5.32967 6.52646L5.82776 5.66862L6.32586 4.81079C6.40329 4.85575 6.44443 4.89997 6.45678 4.91386C6.47222 4.93121 6.47875 4.94225 6.48108 4.94635C6.48345 4.95052 6.48914 4.96099 6.49571 4.98156C6.50093 4.99788 6.51717 5.05256 6.51717 5.13793H5.52522ZM5.82776 5.66862L5.31943 6.52043L6.85696 7.43799L7.36529 6.58618L7.87363 5.73438L6.3361 4.81682L5.82776 5.66862ZM7.36529 6.58618L6.86547 7.44301C6.54847 7.25809 6.47874 6.86923 6.63742 6.59722L7.49425 7.09704L8.35108 7.59686C8.71806 6.96774 8.53922 6.12258 7.86511 5.72935L7.36529 6.58618ZM7.49425 7.09704L6.65307 6.5713C6.75914 6.40159 6.95233 6.2886 7.17186 6.2886V7.28055V8.27251C7.63939 8.27251 8.08056 8.03055 8.33542 7.62277L7.49425 7.09704Z" fill="#B8181E" mask="url(#path-3-inside-2_1986_24870)"/>
                                                        </svg>
                                                    </p>
                                                )}
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 11 11" fill="none"
                                            className="mb-1.5 h-3 w-3 flex-shrink-0 text-[#B8181E] group-hover:text-gray-300 transition-colors">
                                                <path d="M0.993533 0.355469L8.51162 0.355469C8.86527 0.355469 9.15286 0.643056 9.15286 0.996711C9.15286 1.35037 8.86527 1.63795 8.51162 1.63795L2.54417 1.63795L10.1128 9.2085C10.3634 9.45917 10.3634 9.86529 10.1128 10.116C9.86211 10.3666 9.45599 10.3666 9.20533 10.116L1.63672 2.54541L1.63672 8.51285C1.63672 8.86651 1.34913 9.1541 0.995477 9.1541C0.641821 9.1541 0.354234 8.86651 0.354234 8.51285L0.354234 0.996711C0.35229 0.643056 0.639878 0.355469 0.993533 0.355469Z" fill="currentColor" stroke="currentColor" stroke-width="0.710641"/>
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Card 3 — Sale products (only when active discounts exist) */}
                            {saleProducts.length > 0 && (
                                <div className="rounded-3xl bg-[#F2F2F2] p-5">
                                    <h3 className="mb-5 text-lg font-semibold text-[#1A1528]">تخفیفات</h3>
                                    <div className="space-y-4">
                                        {saleProducts.map(product => {
                                            const variation =
                                                product.variations?.find(v => v.sale_price != null && Number(v.sale_price) < Number(v.price))
                                                ?? product.variations?.[0];
                                            const price     = variation ? Number(variation.price) : null;
                                            const salePrice = variation?.sale_price != null ? Number(variation.sale_price) : null;
                                            const isOnSale  = price !== null && salePrice !== null && salePrice < price;
                                            if (!isOnSale) return null;
                                            const discountPct = Math.round((1 - salePrice! / price!) * 100);
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={route('shop.show', product.id)}
                                                    className="flex items-end gap-3 group border-b border-1 border-[#D5D5D5AA] pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
                                                >
                                                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={`/storage/${product.images[0]}`}
                                                                alt={product.title}
                                                                className="h-full w-full object-contain p-1"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold leading-snug text-[#1F0001] line-clamp-2 group-hover:text-[#E31F25] transition-colors">
                                                            {product.title}
                                                        </p>
                                                        <div className="mt-1.5 flex items-center gap-1.5 overflow-hidden">
                                                            <span className="text-[10px] text-[#809BA4] line-through">
                                                                {price!}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-2xl bg-[#E31F25] px-1 py-0.5 text-[9px] font-normal leading-none text-white">
                                                                {discountPct}<span className="mr-0.5" style={{fontSize:"80%"}}>%</span>
                                                            </span>
                                                            <span className="text-xs font-bold text-[#5C5C5C]">
                                                                {formatPrice(salePrice!)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 11 11" fill="none"
                                                         className="mb-1.5 h-3 w-3 flex-shrink-0 text-[#B8181E] group-hover:text-gray-300 transition-colors">
                                                        <path d="M0.993533 0.355469L8.51162 0.355469C8.86527 0.355469 9.15286 0.643056 9.15286 0.996711C9.15286 1.35037 8.86527 1.63795 8.51162 1.63795L2.54417 1.63795L10.1128 9.2085C10.3634 9.45917 10.3634 9.86529 10.1128 10.116C9.86211 10.3666 9.45599 10.3666 9.20533 10.116L1.63672 2.54541L1.63672 8.51285C1.63672 8.86651 1.34913 9.1541 0.995477 9.1541C0.641821 9.1541 0.354234 8.86651 0.354234 8.51285L0.354234 0.996711C0.35229 0.643056 0.639878 0.355469 0.993533 0.355469Z" fill="currentColor" stroke="currentColor" stroke-width="0.710641"/>
                                                    </svg>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>

                    {/* ── Suggested recent posts ─────────────────────────────── */}
                    {recentPosts.length > 0 && (
                        <section className="mt-16">
                            <h2 className="mb-6 text-lg lg:text-3xl font-bold text-[#1A1528] text-center">بلاگ‌های پیشنهادی</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-3">
                                {recentPosts.map(p => (
                                    <BlogCard key={p.id} post={p} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Product carousel ───────────────────────────────────── */}
                    {TOTAL > 0 && (
                        <div id="section-show--recentproducts" className="mt-16">
                            <h2 className="mb-6 text-lg lg:text-3xl font-bold text-[#1A1528]">محصولات جدید</h2>

                            <div className="bg-[#F2F2F2] rounded-3xl relative p-10">
                                {/* Right arrow — prev in RTL */}
                                <button
                                    type="button"
                                    onClick={prevSlide}
                                    disabled={!canPrev}
                                    aria-label="قبلی"
                                    className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-[#E31F25] hover:bg-[#E31F25] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <div className="overflow-hidden px-4">
                                    <div
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{
                                            width: `${(TOTAL / visibleCols) * 100}%`,
                                            transform: `translateX(${slideIndex * (100 / TOTAL)}%)`,
                                        }}
                                    >
                                        {latestProducts.map(product => (
                                            <div key={product.id} className="px-4" style={{ width: `${100 / TOTAL}%` }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Left arrow — next in RTL */}
                                <button
                                    type="button"
                                    onClick={nextSlide}
                                    disabled={!canNext}
                                    aria-label="بعدی"
                                    className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-[#E31F25] hover:bg-[#E31F25] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="mt-8 flex justify-center">
                                    <Link
                                        href={route('shop.index')}
                                        className="rounded-full bg-[#B8181E] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#E31F25] transition-colors"
                                    >
                                        مشاهده بیشتر
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
        </ShopLayout>
    );
}
