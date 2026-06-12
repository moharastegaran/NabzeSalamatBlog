import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Province {
    id: number;
    name: string;
    cities: { id: number; name: string }[];
}

interface RoleOption { slug: string; name: string; }

interface Props {
    allowedRoles: RoleOption[];
    provinces: Province[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-b border-gray-200 pb-1 mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{children}</h4>
        </div>
    );
}

function InputIcon({ children }: { children: React.ReactNode }) {
    return (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {children}
        </div>
    );
}

function SelectWrapper({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            <select
                {...props}
                className={`appearance-none pr-3 ${className ?? plain}`}
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', background: 'none' } as React.CSSProperties}
            >
                {children}
            </select>
        </div>
    );
}

const IconUser = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const IconPhone = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
    </svg>
);

const IconEnvelope = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const IconLock = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const IconId = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
);

const BASE = 'w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
const withIcon = `${BASE} pl-9`;
const plain    = BASE;

export default function CreateUser({ allowedRoles, provinces }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:       '',
        email:      '',
        mobile:     '',
        melli_code: '',
        province_id: '',
        city_id:    '',
        password:   '',
        password_confirmation: '',
        role:       allowedRoles[0]?.slug ?? '',
    });

    const cities = data.province_id
        ? (provinces.find(p => p.id === Number(data.province_id))?.cities ?? [])
        : [];

    const onProvinceChange = (provinceId: string) => {
        setData(d => ({ ...d, province_id: provinceId, city_id: '' }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">ایجاد کاربر جدید</h2>}>
            <Head title="ایجاد کاربر" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="px-6 py-6 space-y-6">

                            {/* ── Account ── */}
                            <div>
                                <SectionTitle>اطلاعات حساب</SectionTitle>
                                <div className="space-y-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">نام و نام خانوادگی</label>
                                        <div className="relative">
                                            <InputIcon><IconUser /></InputIcon>
                                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={withIcon} autoComplete="name" />
                                        </div>
                                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">شماره موبایل</label>
                                            <div className="relative">
                                                <InputIcon><IconPhone /></InputIcon>
                                                <input type="text" inputMode="numeric" maxLength={11} value={data.mobile} onChange={e => setData('mobile', e.target.value)} className={withIcon} dir="rtl" />
                                            </div>
                                            {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">ایمیل <span className="text-gray-500 font-normal">(اختیاری)</span></label>
                                            <div className="relative">
                                                <InputIcon><IconEnvelope /></InputIcon>
                                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={withIcon} autoComplete="email" dir="rtl" />
                                            </div>
                                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">رمز عبور</label>
                                            <div className="relative">
                                                <InputIcon><IconLock /></InputIcon>
                                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={withIcon} autoComplete="new-password" />
                                            </div>
                                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">تکرار رمز عبور</label>
                                            <div className="relative">
                                                <InputIcon><IconLock /></InputIcon>
                                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className={withIcon} autoComplete="new-password" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* ── Role ── */}
                            <div>
                                <SectionTitle>نقش کاربری</SectionTitle>
                                <div className="flex flex-wrap gap-4">
                                    {allowedRoles.map(role => (
                                        <label key={role.slug} className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.slug}
                                                checked={data.role === role.slug}
                                                onChange={() => setData('role', role.slug)}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-800">{role.name}</span>
                                        </label>
                                    ))}
                                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                                </div>
                            </div>

                            {/* ── Identity ── */}
                            <div>
                                <SectionTitle>اطلاعات هویتی</SectionTitle>
                                <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-1">کد ملی</label>
                                    <div className="relative">
                                        <InputIcon><IconId /></InputIcon>
                                        <input type="text" inputMode="numeric" maxLength={10} value={data.melli_code} onChange={e => setData('melli_code', e.target.value)} className={`${withIcon} text-right`} dir="ltr" />
                                    </div>
                                    {errors.melli_code && <p className="mt-1 text-xs text-red-600">{errors.melli_code}</p>}
                                </div>
                            </div>

                            {/* ── Location ── */}
                            <div>
                                <SectionTitle>موقعیت</SectionTitle>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">استان</label>
                                        <SelectWrapper value={data.province_id} onChange={e => onProvinceChange(e.target.value)}>
                                            <option value="">— انتخاب استان —</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </SelectWrapper>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">شهر</label>
                                        <SelectWrapper value={data.city_id} onChange={e => setData('city_id', e.target.value)} disabled={cities.length === 0}>
                                            <option value="">— انتخاب شهر —</option>
                                            {cities.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </SelectWrapper>
                                        {errors.city_id && <p className="mt-1 text-xs text-red-600">{errors.city_id}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                                <Link href={route('users.index')} className="rounded-md px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-700">
                                    انصراف
                                </Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                                    {processing ? 'در حال ذخیره سازی…' : 'ایجاد کاربر'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
