import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AssetPicker from '@/Components/AssetPicker';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { Asset } from '@/types/models';
import type { PageProps } from '@/types';
import { useState } from 'react';
import { hasRole } from '@/utils/roles';

interface Province {
    id: number;
    name: string;
    cities: { id: number; name: string }[];
}

interface EditUserData {
    id: number;
    name: string;
    email: string;
    mobile?: string;
    melli_code?: string;
    profile_image?: string | null;
    bio?: string | null;
    city_id?: number;
    province_id?: number;
}

interface RoleOption { slug: string; name: string; }

interface Props {
    editUser: EditUserData;
    currentRole: string;
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
                className={`appearance-none pl-9 ${className ?? plain}`}
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', BackgroundImage: "none" } as React.CSSProperties}
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

export default function EditUser({ editUser, currentRole, allowedRoles, provinces }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canUpload = hasRole(auth.user?.roles, 'admin');
    const [pickerOpen, setPickerOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name:        editUser.name,
        email:       editUser.email,
        mobile:      editUser.mobile ?? '',
        melli_code:  editUser.melli_code ?? '',
        profile_image: editUser.profile_image ?? null,
        bio:         editUser.bio ?? '',
        province_id: String(editUser.province_id ?? ''),
        city_id:     String(editUser.city_id ?? ''),
        password:               '',
        password_confirmation:  '',
        role:        currentRole || (allowedRoles[0]?.slug ?? ''),
    });

    const cities = data.province_id
        ? (provinces.find(p => p.id === Number(data.province_id))?.cities ?? [])
        : [];

    const onProvinceChange = (provinceId: string) => {
        setData(d => ({ ...d, province_id: provinceId, city_id: '' }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', editUser.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">ویرایش کاربر: {editUser.name}</h2>}>
            <Head title="ویرایش کاربر" />

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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">
                                            تصویر پروفایل <span className="text-gray-500 font-normal">(اختیاری — تصویر نویسنده)</span>
                                        </label>
                                        {data.profile_image ? (
                                            <div className="mb-3 flex items-start gap-3">
                                                <img
                                                    src={`/storage/${data.profile_image}`}
                                                    alt=""
                                                    className="h-20 w-20 rounded-full object-cover ring-1 ring-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setData('profile_image', null)}
                                                    className="mt-1 text-xs text-red-600 hover:text-red-700"
                                                >
                                                    حذف تصویر
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 ring-1 ring-dashed ring-gray-200">
                                                <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setPickerOpen(true)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {data.profile_image ? 'تغییر تصویر' : 'انتخاب از کتابخانه'}
                                        </button>
                                        {errors.profile_image && <p className="mt-1 text-xs text-red-600">{errors.profile_image}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">
                                            بیوگرافی <span className="text-gray-500 font-normal">(اختیاری)</span>
                                        </label>
                                        <RichTextEditor
                                            value={data.bio}
                                            onChange={html => setData('bio', html)}
                                            placeholder="معرفی کوتاه نویسنده…"
                                            minHeight={200}
                                            dir="rtl"
                                            imageResize
                                        />
                                        {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">شماره موبایل</label>
                                            <div className="relative">
                                                <InputIcon><IconPhone /></InputIcon>
                                                <input type="text" inputMode="numeric" maxLength={11} value={data.mobile} onChange={e => setData('mobile', e.target.value)} className={withIcon} dir="ltr" />
                                            </div>
                                            {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">ایمیل <span className="text-gray-500 font-normal">(اختیاری)</span></label>
                                            <div className="relative">
                                                <InputIcon><IconEnvelope /></InputIcon>
                                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={withIcon} autoComplete="email" dir="ltr" />
                                            </div>
                                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">
                                                رمز عبور جدید <span className="text-gray-500 font-normal">(خالی = بدون تغییر)</span>
                                            </label>
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
                                        <input type="text" inputMode="numeric" maxLength={10} value={data.melli_code} onChange={e => setData('melli_code', e.target.value)} className={withIcon} dir="ltr" />
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
                                    {processing ? 'در حال ذخیره سازی…' : 'ذخیره تغییرات'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <AssetPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(asset: Asset) => setData('profile_image', asset.path)}
                accept="image"
                canUpload={canUpload}
            />
        </AuthenticatedLayout>
    );
}
