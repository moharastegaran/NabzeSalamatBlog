import PersianDatePicker from '@/Components/PersianDatePicker';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toJalali, localDateStr } from '@/utils/date';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Note {
    id: number;
    body: string;
    is_done: boolean;
    due_date: string | null;
    created_at: string;
}

interface Props {
    notes: Note[];
}

function IconTrash() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function NoteRow({ note }: { note: Note }) {
    const toggle = () => router.patch(route('notes.toggle', note.id), {}, { preserveScroll: true });
    const remove = () => router.delete(route('notes.destroy', note.id), { preserveScroll: true });

    return (
        <div className={`flex items-start gap-3 rounded-lg px-4 py-3 transition-colors ${note.is_done ? 'bg-gray-50' : 'bg-white'}`}>
            <button
                type="button"
                onClick={toggle}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    note.is_done
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-200 hover:border-indigo-400'
                }`}
                aria-label={note.is_done ? 'علامت‌گذاری به عنوان انجام‌نشده' : 'علامت‌گذاری به عنوان انجام‌شده'}
            >
                {note.is_done && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            <div className="min-w-0 flex-1">
                <p className={`text-sm leading-relaxed ${note.is_done ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {note.body}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                    <span>{toJalali(note.created_at)}</span>
                    {note.due_date && (
                        <span className={`flex items-center gap-1 font-medium ${
                            !note.is_done && note.due_date < localDateStr()
                                ? 'text-red-500'
                                : 'text-indigo-500'
                        }`}>
                            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {toJalali(note.due_date)}
                        </span>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={remove}
                className="shrink-0 rounded p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
                aria-label="حذف یادداشت"
            >
                <IconTrash />
            </button>
        </div>
    );
}

export default function NotesIndex({ notes }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({ body: '', due_date: '' });

    const active = notes.filter((n) => !n.is_done);
    const done = notes.filter((n) => n.is_done);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('notes.store'), { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">یادداشت‌ها</h2>}>
            <Head title="یادداشت‌ها" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

                    {/* Add note form */}
                    <form onSubmit={submit} className="mb-6 flex flex-wrap gap-2">
                        <input
                            type="text"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="یادداشت جدید..."
                            maxLength={500}
                            className="flex-1rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <PersianDatePicker
                            value={data.due_date}
                            onChange={(v) => setData('due_date', v)}
                            placeholder="سررسید..."
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={processing || !data.body.trim()}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <IconPlus />
                            افزودن
                        </button>
                    </form>

                    {errors.body && <p className="mb-4 text-sm text-red-500">{errors.body}</p>}

                    {/* Active notes */}
                    {active.length > 0 ? (
                        <div className="mb-6 overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-200">
                            <div className="divide-y divide-gray-200">
                                {active.map((note) => (
                                    <NoteRow key={note.id} note={note} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        notes.length === 0 && (
                            <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                                <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-sm text-gray-500">هنوز یادداشتی ثبت نشده است.</p>
                            </div>
                        )
                    )}

                    {/* Done notes */}
                    {done.length > 0 && (
                        <div>
                            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                انجام‌شده ({done.length})
                            </p>
                            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-200">
                                <div className="divide-y divide-gray-200">
                                    {done.map((note) => (
                                        <NoteRow key={note.id} note={note} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
