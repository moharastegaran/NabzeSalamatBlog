import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { PageProps } from '@/types';

interface RoleItem {
    id: number;
    name: string;
    slug: string;
    permissions: string[];
}

interface Props {
    roles: RoleItem[];
    permissions: string[];
}

const CORE_ROLES = ['admin', 'contributor', 'writer'];

const PERMISSION_LABELS: Record<string, string> = {
    'users.create':           'ایجاد کاربر',
    'users.edit':             'ویرایش کاربر',
    'users.delete':           'حذف کاربر',
    'tickets.assign':         'تخصیص تیکت',
    'tickets.close':          'بستن تیکت',
    'tickets.respond':        'پاسخ به تیکت',
    'blog.create':            'ایجاد مقاله',
    'blog.edit':              'ویرایش مقاله',
    'blog.delete':            'حذف مقاله',
    'blog_categories.create': 'ایجاد دسته‌بندی',
    'blog_categories.edit':   'ویرایش دسته‌بندی',
    'blog_categories.delete': 'حذف دسته‌بندی',
    'tags.create':            'ایجاد برچسب',
    'tags.delete':            'حذف برچسب',
    'comments.approve':       'تایید نظر',
    'comments.discard':       'رد نظر',
    'announcements.manage':   'مدیریت اعلانات',
    'attachments.add':        'افزودن پیوست',
    'attachments.edit':       'ویرایش پیوست',
    'attachments.delete':     'حذف پیوست',
    'roles.manage':           'مدیریت نقش‌ها',
    'maintenance.manage':     'مدیریت تعمیرات',
    'reporting.get':          'دسترسی به گزارشات',
};

const ROLE_LABELS: Record<string, string> = {
    admin:       'مدیر کل',
    contributor: 'همکار محتوا',
    writer:      'نویسنده',
};

const PERMISSION_GROUPS: { label: string; prefix: string }[] = [
    { label: 'مقالات وبلاگ',    prefix: 'blog' },
    { label: 'دسته‌بندی‌ها',    prefix: 'blog_categories' },
    { label: 'برچسب‌ها',        prefix: 'tags' },
    { label: 'نظرات',           prefix: 'comments' },
    { label: 'تیکت‌ها',         prefix: 'tickets' },
    { label: 'کاربران',         prefix: 'users' },
    { label: 'پیوست‌ها',        prefix: 'attachments' },
    { label: 'اعلانات',         prefix: 'announcements' },
    { label: 'نقش‌ها',          prefix: 'roles' },
    { label: 'تعمیرات',         prefix: 'maintenance' },
    { label: 'گزارشات',         prefix: 'reporting' },
];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function PermissionCheckboxes({
    permissions,
    selected,
    onChange,
}: {
    permissions: string[];
    selected: string[];
    onChange: (perms: string[]) => void;
}) {
    const toggle = (perm: string) => {
        onChange(
            selected.includes(perm)
                ? selected.filter((p) => p !== perm)
                : [...selected, perm],
        );
    };

    const toggleGroup = (perms: string[]) => {
        const allSelected = perms.every((p) => selected.includes(p));
        if (allSelected) {
            onChange(selected.filter((p) => !perms.includes(p)));
        } else {
            onChange([...new Set([...selected, ...perms])]);
        }
    };

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {PERMISSION_GROUPS.map(({ label, prefix }) => {
                const group = permissions.filter((p) => p === prefix || p.startsWith(prefix + '.'));
                if (group.length === 0) return null;
                const allChecked = group.every((p) => selected.includes(p));
                const someChecked = !allChecked && group.some((p) => selected.includes(p));
                return (
                    <div key={prefix} className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border-b border-gray-200">
                            <input
                                type="checkbox"
                                checked={allChecked}
                                ref={(el) => { if (el) el.indeterminate = someChecked; }}
                                onChange={() => toggleGroup(group)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
                        </div>
                        <div className="flex flex-wrap gap-px bg-gray-100">
                            {group.map((perm) => {
                                const action = perm.includes('.') ? perm.split('.').slice(1).join('.') : perm;
                                return (
                                    <label
                                        key={perm}
                                        className="flex cursor-pointer items-center gap-2 bg-white px-3 py-2 hover:bg-indigo-50 flex-1 min-w-[130px]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(perm)}
                                            onChange={() => toggle(perm)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {PERMISSION_LABELS[perm] ?? action}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function RolesIndex({ roles, permissions }: Props) {

    const [showCreate, setShowCreate]     = useState(false);
    const [editingRole, setEditingRole]   = useState<RoleItem | null>(null);
    const [renamingRole, setRenamingRole] = useState<RoleItem | null>(null);

    const createForm = useForm({ name: '', slug: '', permissions: [] as string[] });
    const editForm   = useForm({ name: '', permissions: [] as string[] });
    const renameForm = useForm({ name: '', slug: '' });

    const openEdit = (role: RoleItem) => {
        setEditingRole(role);
        editForm.setData({ name: role.name, permissions: [...role.permissions] });
    };

    const openRename = (role: RoleItem) => {
        setRenamingRole(role);
        renameForm.setData({ name: role.name, slug: role.slug });
    };

    const closeCreate = () => { setShowCreate(false); createForm.reset(); };
    const closeEdit   = () => { setEditingRole(null);  editForm.reset(); };
    const closeRename = () => { setRenamingRole(null); renameForm.reset(); };

    const submitCreate = () => {
        createForm.post(route('roles.store'), { onSuccess: closeCreate });
    };

    const submitEdit = () => {
        if (!editingRole) return;
        editForm.put(route('roles.update', editingRole.id), { onSuccess: closeEdit });
    };

    const submitRename = () => {
        if (!renamingRole) return;
        renameForm.patch(route('roles.rename', renamingRole.id), { onSuccess: closeRename });
    };

    const deleteRole = (role: RoleItem) => {
        if (!confirm(`نقش «${role.name || role.slug}» حذف شود؟`)) return;
        router.delete(route('roles.destroy', role.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">مدیریت نقش‌ها</h2>}>
            <Head title="مدیریت نقش‌ها" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{roles.length} نقش تعریف شده</p>
                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            افزودن نقش
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['نام نقش', 'دسترسی‌ها', 'عملیات'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-right text-sm font-medium text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {roles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {role.name || role.slug}
                                            </p>
                                            <p className="text-xs font-mono text-gray-400">{role.slug}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {role.permissions.length === 0 ? (
                                                    <span className="text-xs text-gray-400">بدون دسترسی</span>
                                                ) : role.permissions.map((perm) => (
                                                    <span
                                                        key={perm}
                                                        className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                                                    >
                                                        {PERMISSION_LABELS[perm] ?? perm}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openRename(role)}
                                                    title="تغییر نام"
                                                    className="rounded-md border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(role)}
                                                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    ویرایش دسترسی‌ها
                                                </button>
                                                {!CORE_ROLES.includes(role.slug) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteRole(role)}
                                                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                    >
                                                        حذف
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showCreate && (
                <Modal title="افزودن نقش جدید" onClose={closeCreate}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">نام نمایشی</label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="مثال: مدیر انبار"
                                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                {createForm.errors.name && (
                                    <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">اسلاگ <span className="text-gray-400 font-normal">(انگلیسی)</span></label>
                                <input
                                    type="text"
                                    value={createForm.data.slug}
                                    onChange={(e) => createForm.setData('slug', e.target.value)}
                                    placeholder="مثال: warehouse_manager"
                                    className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                {createForm.errors.slug && (
                                    <p className="mt-1 text-xs text-red-600">{createForm.errors.slug}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">دسترسی‌ها</label>
                            <PermissionCheckboxes
                                permissions={permissions}
                                selected={createForm.data.permissions}
                                onChange={(perms) => createForm.setData('permissions', perms)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-4">
                            <button
                                type="button"
                                onClick={closeCreate}
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={submitCreate}
                                disabled={createForm.processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                            >
                                {createForm.processing ? 'در حال ذخیره...' : 'ایجاد نقش'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {editingRole && (
                <Modal
                    title={`ویرایش: ${editingRole.name || editingRole.slug}`}
                    onClose={closeEdit}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">نام نمایشی</label>
                            <input
                                type="text"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {editForm.errors.name && (
                                <p className="mt-1 text-xs text-red-600">{editForm.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">دسترسی‌ها</label>
                            <PermissionCheckboxes
                                permissions={permissions}
                                selected={editForm.data.permissions}
                                onChange={(perms) => editForm.setData('permissions', perms)}
                            />
                            {editForm.errors.permissions && (
                                <p className="mt-1 text-xs text-red-600">{editForm.errors.permissions}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-4">
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={submitEdit}
                                disabled={editForm.processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                            >
                                {editForm.processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {renamingRole && (
                <Modal title={`تغییر نام نقش: ${renamingRole.name || renamingRole.slug}`} onClose={closeRename}>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">نام نمایشی</label>
                            <input
                                type="text"
                                value={renameForm.data.name}
                                onChange={(e) => renameForm.setData('name', e.target.value)}
                                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {renameForm.errors.name && (
                                <p className="mt-1 text-xs text-red-600">{renameForm.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                اسلاگ <span className="text-gray-400 font-normal">(انگلیسی، یکتا)</span>
                            </label>
                            <input
                                type="text"
                                value={renameForm.data.slug}
                                onChange={(e) => renameForm.setData('slug', e.target.value)}
                                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {renameForm.errors.slug && (
                                <p className="mt-1 text-xs text-red-600">{renameForm.errors.slug}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 border-t pt-4">
                            <button
                                type="button"
                                onClick={closeRename}
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={submitRename}
                                disabled={renameForm.processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                            >
                                {renameForm.processing ? 'در حال ذخیره...' : 'ذخیره'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
