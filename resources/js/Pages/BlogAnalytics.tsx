import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    AreaChart, Area,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

interface Summary {
    totalViews: number;
    uniquePosts: number;
    avgReadSeconds: number;
    topSource: string | null;
}

interface ViewPoint     { date: string; views: number; }
interface DevicePoint   { device_type: string; views: number; }
interface ReferrerPoint { referrer_domain: string; views: number; }
interface UtmPoint      { utm_source: string; utm_medium: string | null; views: number; }
interface TopPost       { post_id: number; title: string; slug: string; views: number; avg_reading_seconds: number | null; }

interface Analytics {
    summary: Summary;
    views_over_time: ViewPoint[];
    device_split: DevicePoint[];
    top_referrers: ReferrerPoint[];
    utm_sources: UtmPoint[];
    top_posts: TopPost[];
}

interface Props {
    range: '7d' | '30d' | '90d';
    analytics: Analytics;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RANGES = [
    { value: '7d',  label: '۷ روز' },
    { value: '30d', label: '۳۰ روز' },
    { value: '90d', label: '۹۰ روز' },
] as const;

const DEVICE_LABEL: Record<string, string> = {
    desktop: 'دسکتاپ',
    mobile:  'موبایل',
    tablet:  'تبلت',
};

const DEVICE_COLORS = ['#6366f1', '#f59e0b', '#10b981'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtSeconds(s: number | null): string {
    if (!s) return '—';
    if (s < 60) return `${s}ث`;
    return `${Math.floor(s / 60)}د ${s % 60}ث`;
}

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
}

// ── Shared chart style ────────────────────────────────────────────────────────

const AXIS_STYLE  = { fontSize: 11, fill: '#9ca3af', fontFamily: 'inherit' };
const TIP_STYLE   = { fontSize: 12, fontFamily: 'inherit' };
const GRID_STROKE = '#f3f4f6';

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl shadow-md ring-1 ring-black/5 overflow-hidden ${className}`}>
            {title && (
                <div className="px-5 pt-4 pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 overflow-hidden">
            <div className={`h-1 w-full ${color}`} />
            <div className="px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900 tabular-nums truncate">{value}</p>
            </div>
        </div>
    );
}

function Empty() {
    return <p className="text-sm text-gray-400 text-center py-8">داده‌ای وجود ندارد</p>;
}

// ── Charts ────────────────────────────────────────────────────────────────────

function ViewsAreaChart({ data }: { data: ViewPoint[] }) {
    const formatted = data.map(d => ({ ...d, label: fmtDate(d.date) }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="label" tick={AXIS_STYLE} interval="preserveStartEnd" />
                <YAxis tick={AXIS_STYLE} allowDecimals={false} />
                <Tooltip contentStyle={TIP_STYLE} formatter={(v) => [Number(v).toLocaleString(), 'بازدید']} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fill="url(#viewsGrad)" dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

function DevicePieChart({ data }: { data: DevicePoint[] }) {
    if (data.length === 0) return <Empty />;

    const labelled = data.map(d => ({ ...d, name: DEVICE_LABEL[d.device_type] ?? d.device_type }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={labelled}
                    dataKey="views"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}٪`}
                    labelLine={false}
                >
                    {labelled.map((_, i) => (
                        <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={TIP_STYLE} formatter={(v) => [Number(v).toLocaleString(), 'بازدید']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'inherit' }} />
            </PieChart>
        </ResponsiveContainer>
    );
}

function ReferrersBarChart({ data }: { data: ReferrerPoint[] }) {
    if (data.length === 0) return <Empty />;

    return (
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" tick={AXIS_STYLE} allowDecimals={false} />
                <YAxis type="category" dataKey="referrer_domain" tick={AXIS_STYLE} width={110} />
                <Tooltip contentStyle={TIP_STYLE} formatter={(v) => [Number(v).toLocaleString(), 'بازدید']} />
                <Bar dataKey="views" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function UtmTable({ data }: { data: UtmPoint[] }) {
    if (data.length === 0) return <Empty />;

    return (
        <table className="w-full text-sm text-right">
            <thead>
                <tr className="text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                    <th className="pb-2 font-semibold">منبع</th>
                    <th className="pb-2 font-semibold">کانال</th>
                    <th className="pb-2 font-semibold text-left">بازدید</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {data.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 font-medium text-gray-700">{r.utm_source}</td>
                        <td className="py-2 text-gray-500">{r.utm_medium ?? '—'}</td>
                        <td className="py-2 text-left tabular-nums text-gray-900">{r.views.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function TopPostsTable({ data }: { data: TopPost[] }) {
    if (data.length === 0) return <Empty />;

    return (
        <table className="w-full text-sm text-right">
            <thead>
                <tr className="text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                    <th className="pb-2 font-semibold w-6">#</th>
                    <th className="pb-2 font-semibold">عنوان</th>
                    <th className="pb-2 font-semibold text-left">بازدید</th>
                    <th className="pb-2 font-semibold text-left">میانگین مطالعه</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {data.map((p, i) => (
                    <tr key={p.post_id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 text-gray-400 font-medium">{i + 1}</td>
                        <td className="py-2.5 max-w-xs">
                            <Link
                                href={route('front.blog.show', p.slug)}
                                className="text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1 font-medium"
                                target="_blank"
                            >
                                {p.title}
                            </Link>
                        </td>
                        <td className="py-2.5 text-left tabular-nums text-gray-900">{p.views.toLocaleString()}</td>
                        <td className="py-2.5 text-left tabular-nums text-gray-500">{fmtSeconds(p.avg_reading_seconds)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlogAnalytics({ range, analytics }: Props) {
    const { summary, views_over_time, device_split, top_referrers, utm_sources, top_posts } = analytics;

    const setRange = (r: string) => router.get(route('analytics.blog'), { range: r }, { preserveScroll: true });

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">آنالیتیکس وبلاگ</h2>}>
            <Head title="آنالیتیکس وبلاگ" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Range selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {RANGES.map(r => (
                            <button
                                key={r.value}
                                onClick={() => setRange(r.value)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                    range === r.value
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                        <span className="text-xs text-gray-400 mr-1">نتایج هر ۱۰ دقیقه به‌روزرسانی می‌شوند</span>
                    </div>

                    {/* KPI row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard label="بازدید کل"            value={summary.totalViews.toLocaleString()} color="bg-indigo-500" />
                        <KpiCard label="پست‌های بازدیدشده"    value={summary.uniquePosts.toLocaleString()} color="bg-violet-500" />
                        <KpiCard label="میانگین زمان مطالعه"  value={fmtSeconds(summary.avgReadSeconds)}  color="bg-emerald-500" />
                        <KpiCard label="منبع برتر"             value={summary.topSource ?? '—'}            color="bg-amber-500" />
                    </div>

                    {/* Views over time */}
                    <Card title="بازدید در طول زمان">
                        <ViewsAreaChart data={views_over_time} />
                    </Card>

                    {/* Device split + Top referrers */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card title="نوع دستگاه">
                            <DevicePieChart data={device_split} />
                        </Card>
                        <Card title="منابع ارجاع" className="lg:col-span-2">
                            <ReferrersBarChart data={top_referrers} />
                        </Card>
                    </div>

                    {/* UTM + Top posts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card title="کمپین‌های UTM">
                            <UtmTable data={utm_sources} />
                        </Card>
                        <Card title={`برترین پست‌ها — ${RANGES.find(r => r.value === range)?.label}`}>
                            <TopPostsTable data={top_posts} />
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
