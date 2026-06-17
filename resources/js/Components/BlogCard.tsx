import { Link } from '@inertiajs/react';
import { BlogPost, BlogTag } from '@/types/models';

interface Props {
    post: BlogPost & { tags?: BlogTag[]; approved_comments_count?: number };
    className?: string;
}

export default function BlogCard({ post, className = '' }: Props) {
    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className={`min-h-[250px] lg:min-h-[450px] group flex flex-col justify-end overflow-hidden rounded-2xl lg:rounded-3xl shadow-none ${className}`}
            style={{
                backgroundImage: `linear-gradient(0deg,rgba(246, 233, 233, 1) 25%,rgba(246, 233, 233, 0) 60%), url(/storage/${post.featured_image}) `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/*{post.featured_image ? (*/}
            {/*    <img*/}
            {/*        src={`/storage/${post.featured_image}`}*/}
            {/*        alt={post.title}*/}
            {/*        className="h-44 w-full object-cover"*/}
            {/*    />*/}
            {/*) : (*/}
            {/*    <div className="h-44 w-full flex items-center justify-center">*/}
            {/*        <svg className="h-12 w-12 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>*/}
            {/*            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />*/}
            {/*        </svg>*/}
            {/*    </div>*/}
            {/*)}*/}
            <div className="flex flex-1 flex-col justify-end p-3 lg:p-6 max-h-[120px] lg:max-h-[160px]">
                {/*{post.category && (*/}
                {/*    <span className="inline-block text-[10px] w-fit p-1 rounded-full font-normal text-white bg-[#B8181E] hover:bg-[#E31F25] opacity-75">{post.category.name}</span>*/}
                {/*)}*/}
                <h2 className="flex-1 text-sm sm:text-base lg:text-xl font-bold text-[#1A1528] group-hover:text-[#000000] transition-colors line-clamp-2">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="text-xs sm:text-sm lg:text-base font-normal text-[#1A1528] line-clamp-2" title={post.excerpt}>{post.excerpt}</p>
                )}
                {/*<div className="mt-3 flex items-center justify-between text-xs text-gray-400">*/}
                {/*    <span>{post.author?.name}</span>*/}
                {/*    <span>{post.approved_comments_count ?? 0} نظر</span>*/}
                {/*</div>*/}
            </div>
        </Link>
    );
}
