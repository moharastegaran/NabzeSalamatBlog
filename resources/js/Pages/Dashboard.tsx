import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ReactNode, useMemo, useState } from 'react';
import { toJalali, toJalaliLabel } from '@/utils/date';
import { formatPrice } from '@/utils/currency';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
// ── Types ────────────────────────────────────────────────────────────────────

interface AssetStats { total: number; by_type: Record<string, number>; }

interface RecentPost {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
}

interface UserStats { total: number; by_role: Record<string, number>; }

interface Stats {
    users: UserStats | null;
    published_posts: number | null;
    blog_categories: number | null;
    assets: AssetStats | null;
}

interface ChartData {
    labels: string[];
    series: number[];
}

interface RoleOption { slug: string; name: string; }

interface Props {
    stats: Stats;
    profile: { mobile: string | null };
    roles: RoleOption[];
    recent_posts: RecentPost[] | null;
    range: string;
    chart_data: ChartData;
}

const RANGES = [
    { value: 'monthly',   label: 'ماهانه' },
    { value: 'quarterly', label: '3 ماهه' },
    { value: 'half_year', label: '6 ماهه' },
    { value: 'annual',    label: 'سالانه' },
] as const;

// ── Small components ─────────────────────────────────────────────────────────

function IconUsers() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconBlog() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
    );
}

function IconAssets() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

function StatCard({ icon, color, title, value, subValue, badge, actions }: {
    icon: ReactNode;
    color: { bar: string; iconBg: string; iconText: string; iconRing: string };
    title: string;
    value: string | number;
    subValue?: ReactNode;
    badge?: ReactNode;
    actions: ReactNode;
}) {
    return (
        <div className="relative flex flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
            <div className={`h-1 w-full ${color.bar}`} />
            <div className="flex-1 px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{title}</p>
                        <p className="mt-1.5 text-4xl font-bold tracking-tight text-gray-900 tabular-nums">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                        {subValue && <div className="mt-2 text-sm text-gray-500">{subValue}</div>}
                    </div>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.iconBg} ${color.iconText} ring-1 ${color.iconRing}`}>
                        {icon}
                    </div>
                </div>
                {badge && <div className="mt-3">{badge}</div>}
            </div>
            <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3 flex flex-wrap gap-2 min-h-[52px] items-center">
                {actions}
            </div>
        </div>
    );
}

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">
            {children}
            <svg className="h-3 w-3 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}

function ActionLinkSecondary({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            {children}
            <svg className="h-3 w-3 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}

function ActionDisabled({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 cursor-not-allowed select-none">
            {children}
            <span className="rounded bg-gray-50 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">به‌زودی</span>
        </span>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between py-3">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800 text-right max-w-[60%] truncate" title={value}>{value}</span>
        </div>
    );
}

// ── Revenue chart ────────────────────────────────────────────────────────────

function RevenueChart({ data, range }: { data: ChartData; range: string }) {
    const [loadingRange, setLoadingRange] = useState(false);

    const changeRange = (newRange: string) => {
        if (newRange === range || loadingRange) return;
        setLoadingRange(true);
        router.get(route('dashboard'), { range: newRange }, {
            preserveState: true,
            preserveScroll: true,
            only: ['chart_data', 'range'],
            onFinish: () => setLoadingRange(false),
        });
    };

    const hasData = data.series.some((v) => v > 0);

    const options = useMemo<ApexOptions>(() => ({
        chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: 'PeydaWebFaNum, ui-sans-serif, sans-serif',
            animations: { enabled: true, speed: 400 },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#4f46e5'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.02,
                stops: [0, 100],
            },
        },
        xaxis: {
            categories: data.labels,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#9ca3af', fontSize: '12px' },
                formatter: (val: string) => toJalaliLabel(val, range),
            },
        },
        yaxis: {
            labels: {
                style: { colors: '#9ca3af', fontSize: '12px' },
                formatter: (val: number) => {
                    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
                    if (val >= 1_000)     return (val / 1_000).toFixed(0) + 'K';
                    return formatPrice(val);
                },
            },
        },
        grid: {
            borderColor: '#f3f4f6',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
        },
        tooltip: {
            y: { formatter: (val: number) => formatPrice(val) },
            theme: 'light',
        },
        markers: {
            size: 4,
            colors: ['#4f46e5'],
            strokeColors: '#ffffff',
            strokeWidth: 2,
            hover: { size: 6 },
        },
    }), [data.labels, range]);

    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">درآمد</h3>
                    <p className="text-xs text-gray-500 mt-0.5">بر اساس سفارشات ارسالی</p>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-gray-50 p-1">
                    {RANGES.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            disabled={loadingRange}
                            onClick={() => changeRange(value)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                range === value
                                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                                    : 'text-gray-500 hover:text-gray-700 disabled:opacity-50'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-2 py-4">
                {hasData ? (
                    <ReactApexChart
                        type="area"
                        height={300}
                        series={[{ name: 'Revenue', data: data.series }]}
                        options={options}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 space-y-2">
                        <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm">هیچ سفارشی در این بازه زمانی ارسال نشده است.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({ stats, profile, roles, recent_posts, range, chart_data }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const primaryRole = user.roles?.[0] ?? '';
    const roleLabel = Object.fromEntries(roles.map(r => [r.slug, r.name]));
    const canEditProfile = true;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">داشبورد</h2>}>
            <Head title="داشبورد" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* ── Mobile user greeting ───────────────────────────── */}
                    <div className="sm:hidden flex items-center gap-3 rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden mb-6">
                        <div className="h-full w-1 self-stretch bg-indigo-500 shrink-0" />
                        <div className="flex items-center gap-3 px-4 py-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100 text-lg font-bold text-indigo-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
                                    {roleLabel[primaryRole] ?? primaryRole}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Row 1: stat cards ──────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-6">
                        {stats.users !== null ? (
                            <StatCard
                                icon={<IconUsers />}
                                color={{ bar: 'bg-emerald-500', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', iconRing: 'ring-emerald-100' }}
                                title="کاربران" value={stats.users.total}
                                badge={
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(stats.users.by_role).map(([slug, count]) => (
                                            <span key={slug} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                <span className="font-medium">{count.toLocaleString()}</span>
                                                <span>{roleLabel[slug] ?? slug}</span>
                                            </span>
                                        ))}
                                    </div>
                                }
                                actions={<ActionLink href={route('users.index')}>مدیریت کاربران</ActionLink>}
                            />
                        ) : (
                            <StatCard
                                icon={<IconUsers />}
                                color={{ bar: 'bg-gray-300', iconBg: 'bg-gray-50', iconText: 'text-gray-400', iconRing: 'ring-gray-100' }}
                                title="کاربران" value="—"
                                subValue={<span className="italic">بدون دسترسی</span>}
                                actions={<ActionDisabled>مدیریت کاربران</ActionDisabled>}
                            />
                        )}

                        {stats.published_posts !== null ? (
                            <StatCard
                                icon={<IconBlog />}
                                color={{ bar: 'bg-violet-500', iconBg: 'bg-violet-50', iconText: 'text-violet-600', iconRing: 'ring-violet-100' }}
                                title="مطالب منتشرشده"
                                value={stats.published_posts}
                                subValue={<span>{stats.blog_categories} دسته‌بندی</span>}
                                actions={
                                    <>
                                        <ActionLink href={route('blog.index')}>مطالب</ActionLink>
                                        <ActionLinkSecondary href={route('blog.categories.index')}>دسته‌بندی‌ها</ActionLinkSecondary>
                                    </>
                                }
                            />
                        ) : (
                            <StatCard
                                icon={<IconBlog />}
                                color={{ bar: 'bg-gray-300', iconBg: 'bg-gray-50', iconText: 'text-gray-400', iconRing: 'ring-gray-100' }}
                                title="مطالب منتشرشده" value="—"
                                subValue={<span className="italic">بدون دسترسی</span>}
                                actions={<ActionDisabled>مدیریت مطالب</ActionDisabled>}
                            />
                        )}

                        {stats.assets !== null ? (
                            <StatCard
                                icon={<IconAssets />}
                                color={{ bar: 'bg-amber-500', iconBg: 'bg-amber-50', iconText: 'text-amber-600', iconRing: 'ring-amber-100' }}
                                title="فایل‌های رسانه‌ای"
                                value={stats.assets.total}
                                badge={
                                    <div className="flex flex-wrap gap-1.5">
                                        {(['image', 'video', 'audio', 'document'] as const).map(type => {
                                            const labels: Record<string, string> = { image: 'تصویر', video: 'ویدیو', audio: 'صوت', document: 'سند' };
                                            const count = stats.assets!.by_type[type] ?? 0;
                                            return (
                                                <span key={type} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                    <span className="font-medium">{count.toLocaleString()}</span>
                                                    <span>{labels[type]}</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                }
                                actions={<ActionLink href={route('assets.index')}>مدیریت فایل‌ها</ActionLink>}
                            />
                        ) : (
                            <StatCard
                                icon={<IconAssets />}
                                color={{ bar: 'bg-gray-300', iconBg: 'bg-gray-50', iconText: 'text-gray-400', iconRing: 'ring-gray-100' }}
                                title="فایل‌های رسانه‌ای" value="—"
                                subValue={<span className="italic">بدون دسترسی</span>}
                                actions={<ActionDisabled>مدیریت فایل‌ها</ActionDisabled>}
                            />
                        )}
                    </div>

                    {/* ── Row 2: user info + recent posts ─────────────── */}
                    <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

                        {/* User info card */}
                        <div className="relative flex flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
                            <div className="h-1 w-full bg-indigo-500" />

                            <div className="px-5 pt-5 pb-4 flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100 text-2xl font-bold text-indigo-600">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-base font-semibold text-gray-900">{user.name}</p>
                                    <span className="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
                                        {roleLabel[primaryRole] ?? primaryRole}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 divide-y divide-gray-100 px-5 text-sm">
                                <InfoRow label="ایمیل" value={user.email} />
                                <InfoRow label="تلفن همراه" value={profile.mobile ?? '—'} />
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3 min-h-[52px] flex items-center">
                                {canEditProfile
                                    ? <ActionLinkSecondary href={route('profile.edit')}>ویرایش پروفایل</ActionLinkSecondary>
                                    : <span className="text-xs text-gray-400 italic">ویرایش پروفایل در دسترس نیست</span>}
                            </div>
                        </div>

                        {/* Recent posts card */}
                        <div className="relative flex flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
                            <div className="h-1 w-full bg-violet-500" />
                            <div className="px-5 pt-5 pb-2">
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">آخرین مطالب من</p>
                            </div>

                            <div className="flex-1 px-5 pb-2">
                                {recent_posts && recent_posts.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {recent_posts.map(post => (
                                            <li key={post.id} className="flex items-center justify-between gap-3 py-2.5">
                                                <p className="truncate text-sm font-medium text-gray-800 min-w-0">{post.title}</p>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${post.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                        {post.status === 'published' ? 'منتشر' : 'پیش‌نویس'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 tabular-nums">{toJalali(post.published_at ?? post.created_at)}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-6 text-center text-sm text-gray-400 italic">هیچ مطاله‌ای ثبت نشده است.</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3 min-h-[52px] flex items-center">
                                {recent_posts !== null
                                    ? <ActionLinkSecondary href={route('blog.index')}>مشاهده همه مطالب</ActionLinkSecondary>
                                    : <span className="text-xs text-gray-400 italic">دسترسی به مطالب وجود ندارد</span>}
                            </div>
                        </div>

                    </div>

                    {/* ── Row 3: Revenue chart ────────────────────────────── */}
                    {/* <RevenueChart data={chart_data} range={range} /> */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
