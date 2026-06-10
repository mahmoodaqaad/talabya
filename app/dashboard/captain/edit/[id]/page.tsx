"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowRight, FiTruck, FiPhone, FiCreditCard, FiSave } from "react-icons/fi";

export default function EditCaptainPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [form, setForm] = useState({ name: "", phone: "", Identity: "" });

    useEffect(() => {
        axios.get(`/api/captain/${id}`).then((res) => {
            setForm({ name: res.data.name, phone: res.data.phone, Identity: res.data.Identity || "" });
            setLoading(false);
        }).catch(() => {
            setMessage({ type: "error", text: "فشل في جلب بيانات الكابتن" });
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.patch(`/api/captain/${id}`, form);
            setMessage({ type: "success", text: "تم تحديث ملف الكابتن بنجاح" });
            setTimeout(() => router.push("/dashboard/captain"), 1000);
        } catch {
            setMessage({ type: "error", text: "فشل حفظ التعديلات بالسيرفر" });
        } finally { setSaving(false); }
    };

    if (loading) return <div className="p-6 text-center text-white bg-zinc-950 min-h-screen">جاري التحميل...</div>;

    return (
        <div className="p-4 md:p-6 min-h-screen text-white text-right" dir="rtl">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black">تعديل بيانات كابتن التوصيل</h1>
                </div>
                <Link href="/dashboard/captain" className="bg-black text-white rounded-xl px-4 py-2 text-xs font-bold inline-flex items-center gap-2"><FiArrowRight /> <span>رجوع</span></Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-xl mx-auto flex flex-col gap-5">
                {message.text && <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{message.text}</div>}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400 font-bold">اسم الكابتن الثلاثي</label>
                        <div className="relative"><span className="absolute right-4 inset-y-0 flex items-center text-zinc-500"><FiTruck /></span>
                            <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400 font-bold">رقم هاتف الاتصال</label>
                        <div className="relative"><span className="absolute right-4 inset-y-0 flex items-center text-zinc-500"><FiPhone /></span>
                            <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white text-left font-mono" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400 font-bold">رقم الهوية الوطنية / الإقامة</label>
                        <div className="relative"><span className="absolute right-4 inset-y-0 flex items-center text-zinc-500"><FiCreditCard /></span>
                            <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white font-mono" value={form.Identity} onChange={(e) => setForm({ ...form, Identity: e.target.value })} />
                        </div>
                    </div>
                </div>
                <button disabled={saving} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs mt-2"><FiSave /> <span>{saving ? "جاري الحفظ..." : "حفظ وتحديث"}</span></button>
            </form>
        </div>
    );
}