import { Link } from '@inertiajs/react';
import type { BlogPost } from '@/types/models';

interface Props {
    posts: BlogPost[];
    title?: string;
}

export default function MostReadWidget({ posts, title = 'پربازدیدترین هفته' }: Props) {
    if (!posts.length) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-[#F24F00] flex-shrink-0" />
                <h3 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                    {title}
                    <svg className="w-3.5 h-3.5 text-[#F24F00]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C9.81 2 8 3.81 8 6c0 2.22 2 4.5 4 7 2-2.5 4-4.78 4-7 0-2.19-1.81-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S11.17 4.5 12 4.5s1.5.67 1.5 1.5S12.83 7.5 12 7.5zM12 15c-2.33 3.5-7 5.43-7 9h14c0-3.57-4.67-5.5-7-9z"/>
                    </svg>
                </h3>
            </div>
            <div>
                {posts.map((post, index) => (
                    <Link
                        key={post.id}
                        href={route('front.blog.show', post.slug)}
                        className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0 group items-start"
                    >
                        {/* Rank badge */}
                        <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5 ${
                            index === 0 ? 'bg-[#F24F00] text-white'
                            : index === 1 ? 'bg-gray-700 text-white'
                            : index === 2 ? 'bg-[#cd7f32] text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                            {(index + 1).toLocaleString('fa-IR')}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-16 h-12 shrink-0 overflow-hidden bg-gray-100">
                            {post.featured_image
                                ? <img src={`/storage/${post.featured_image}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                : <div className="w-full h-full bg-gray-200" />
                            }
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                            <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors">
                                {post.title}
                            </h4>
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {post.views.toLocaleString('fa-IR')} بازدید
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
