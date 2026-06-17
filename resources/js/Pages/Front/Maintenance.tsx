import { Head } from '@inertiajs/react';

export default function Maintenance() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4" dir="rtl">
            <Head title="به زودی" />
            <h1 className="text-4xl font-bold text-gray-800">به زودی</h1>
            <p className="text-lg text-gray-500">این بخش به زودی راه‌اندازی می‌شود.</p>
        </div>
    );
}
