"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiFileText, FiMail, FiMapPin, FiPhone, FiPlusCircle, FiShoppingBag, FiUser } from "react-icons/fi";

const getAxiosMessage = (error: unknown, fallback: string) =>
    axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export default function AddCustomerPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "", isStoreOwner: false, StoreName: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await axios.post("/api/customers", form);
            setMessage({ type: "success", text: res.data.message || "تم حفظ بيانات العميل بنجاح" });
            setForm({ name: "", email: "", phone: "", address: "", notes: "", isStoreOwner: false, StoreName: "" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getAxiosMessage(error, "فشل الاتصال بالسيرفر") });
        } finally {
            setLoading(false);
        }
    };

    return (
        // تم إضافة dir="rtl" وتصحيح الكلمة المفتاحية للون الأبيض text-white
        <div className="p-6 min-h-screen text-white text-right" dir="rtl">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                        <FiPlusCircle className="text-orange-500" /> إضافة عميل جديد
                    </h1>
                    <p className="text-sm text-white/70 mt-1 font-semibold">إنشاء ملف تعريف لعميل عادي أو صاحب متجر</p>
                </div>
                {/* تعديل السهم والاتجاه للعودة إلى اليمين */}
                <Link href="/dashboard/customers" className="bg-black text-white rounded-xl px-4 py-2 text-sm font-bold inline-flex items-center gap-2 transition-colors hover:bg-zinc-800">
                    <FiArrowRight />
                    <span>رجوع</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl max-w-4xl mx-auto flex flex-col gap-5">
                {message.text && (
                    <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field icon={<FiUser />} label="الاسم بالكامل" required>
                        <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="أدخل اسم العميل أو التاجر" />
                    </Field>

                    <Field icon={<FiMail />} label="البريد الإلكتروني" required>
                        {/* محاذاة لليسار للحفاظ على سلامة تنسيق الإيميل */}
                        <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-left" type="email" dir="ltr" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="customer@example.com" />
                    </Field>

                    <Field icon={<FiPhone />} label="رقم الهاتف">
                        {/* محاذاة لليسار للحفاظ على سلامة تنسيق أرقام الهواتف */}
                        <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-left" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="059xxxxxxx" />
                    </Field>

                    {/* ضبط حاوية الـ Checkbox لتبدأ من اليمين بنسق متناسق مع العناصر */}
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 h-[50px] mt-[22px]">
                        <input id="isStoreOwner" type="checkbox" checked={form.isStoreOwner} onChange={(e) => setForm({ ...form, isStoreOwner: e.target.checked, StoreName: e.target.checked ? form.StoreName : "" })} className="h-5 w-5 accent-orange-500 cursor-pointer" />
                        <label htmlFor="isStoreOwner" className="text-sm text-white font-bold flex items-center gap-2 cursor-pointer select-none">
                            <FiShoppingBag className="text-orange-500" /> صاحب متجر / تاجر شريك
                        </label>
                    </div>

                    {form.isStoreOwner && (
                        <Field icon={<FiShoppingBag />} label="اسم المتجر / المحل" wide>
                            <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" value={form.StoreName} onChange={(e) => setForm({ ...form, StoreName: e.target.value })} placeholder="مثال: سوبرماركت الأمل، محلات الشرفا" />
                        </Field>
                    )}

                    <Field icon={<FiMapPin />} label="العنوان" wide>
                        <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="مثال: غزة - النصر - مفترق اللبابيدي" />
                    </Field>

                    <Field icon={<FiFileText />} label="ملاحظات وتفاصيل إضافية" wide textarea>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors resize-none" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="أي ملاحظات تخص حساب العميل أو آلية الدفع والتعامل..." />
                    </Field>
                </div>

                <div className="flex justify-end border-t border-zinc-800/60 pt-5">
                    <button disabled={loading} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs disabled:opacity-50 transition-all hover:opacity-95">
                        <FiPlusCircle />
                        <span>{loading ? "جاري الحفظ..." : "حفظ بيانات العميل"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// تعديل مكوّن الحقل لتبدأ الأيقونة من اليمين (right-4) بدلاً من اليسار
const Field = ({ children, icon, label, required, wide, textarea }: { children: React.ReactNode; icon: React.ReactNode; label: string; required?: boolean; wide?: boolean; textarea?: boolean }) => (
    <div className={`flex flex-col gap-1.5 ${wide ? "md:col-span-2" : ""}`}>
        <label className="text-xs text-zinc-400 font-bold">{label} {required && <span className="text-orange-500">*</span>}</label>
        <div className="relative text-right">
            <span className={`absolute right-4 text-zinc-500 text-lg pointer-events-none ${textarea ? "top-3" : "inset-y-0 flex items-center"}`}>{icon}</span>
            {children}
        </div>
    </div>
);