import CustomerLayout from '@/Layouts/CustomerLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Province } from '@/types/models';
import { PageProps } from '@/types';

interface UserAddress {
    city_id: number | null;
    province_id: number | null;
}

interface Props {
    user: UserAddress;
    provinces: Province[];
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-sm font-medium text-[#0B1A10] mb-1.5">{children}</label>;
}

function FieldError({ msg }: { msg?: string }) {
    return msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;
}

export default function Address({ user, provinces }: Props) {
    const { flash } = usePage<PageProps>().props;

    const [selectedProvince, setSelectedProvince] = useState<number | ''>(user.province_id ?? '');

    const provinceOptions = provinces.map(p => ({ value: p.id, label: p.name }));
    const cityOptions     = (provinces.find(p => p.id === Number(selectedProvince))?.cities ?? [])
        .map(c => ({ value: c.id, label: c.name }));

    const { data, setData, patch, processing, errors } = useForm({
        city_id: (user.city_id ?? '') as number | '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('customer.address.update'));
    };

    return (
        <CustomerLayout>
            <Head title="ویرایش شهر" />

            <div className="bg-[#F2F2F2] rounded-3xl lg:p-6 p-4">
                <h3 className="text-lg font-bold text-right mb-5">ویرایش شهر</h3>

                {flash.success && (
                    <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel>استان</FieldLabel>
                                <SelectInput
                                    options={provinceOptions}
                                    value={selectedProvince}
                                    placeholder="انتخاب استان..."
                                    onChange={val => {
                                        setSelectedProvince(Number(val));
                                        setData('city_id', '');
                                    }}
                                />
                            </div>
                            <div>
                                <FieldLabel>شهر</FieldLabel>
                                <SelectInput
                                    options={cityOptions}
                                    value={data.city_id}
                                    placeholder={selectedProvince ? 'انتخاب شهر...' : 'ابتدا استان را انتخاب کنید'}
                                    disabled={!selectedProvince}
                                    onChange={val => setData('city_id', Number(val))}
                                />
                                <FieldError msg={errors.city_id} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link
                            href={route('customer.activities')}
                            className="rounded-xl border border-[#075F26] px-8 py-2.5 text-sm font-semibold text-[#075F26] hover:bg-gray-50 transition-colors"
                        >
                            انصراف
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#075F26] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#054E1F] disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}
