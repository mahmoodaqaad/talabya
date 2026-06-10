"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiFileText, FiMail, FiMapPin, FiPhone, FiPlusCircle, FiUser } from "react-icons/fi";
import { RiBikeFill } from "react-icons/ri";
import { RiMap2Fill } from "react-icons/ri";

const getAxiosMessage = (error: unknown, fallback: string) =>
    axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export default function AddCaptain() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        area: "",
        notes: "",
        bike: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await axios.post("/api/captain", form);
            setMessage({ type: "success", text: res.data.message || "تم حفظ بيانات الكابتن بنجاح" });
            setForm({ name: "", email: "", phone: "", address: "", notes: "", bike: "", area: "" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getAxiosMessage(error, "فشل الاتصال بالسيرفر") });
        } finally {
            setLoading(false);
        }
    };

    return (
        // تم إضافة dir="rtl" لقلب اتجاه الصفحة بالكامل
        <div className="p-6 min-h-screen text-white text-right" dir="rtl">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                        <FiPlusCircle className="text-orange-500" /> إضافة كابتن جديد
                    </h1>
                    <p className="text-sm text-white/70 mt-1 font-semibold">إنشاء ملف تعريف جديد لكابتن التوصيل</p>
                </div>
                {/* تعديل زر الرجوع ليعود لليمين واستبدال الأيقونة لتناسب القراءة العربية */}
                <Link href="/dashboard/captain" className="bg-black text-white rounded-xl px-4 py-2 text-sm font-bold inline-flex items-center gap-2 transition-colors hover:bg-zinc-800">
                    <FiArrowRight />
                    <span>رجوع</span>
                </Link>
            </div>

            <form className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl max-w-4xl mx-auto flex flex-col gap-5" onSubmit={handleSubmit}>
                {message.text && (
                    <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field icon={<FiUser />} label="الاسم بالكامل" required>
                        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="أدخل اسم الكابتن رباعي" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" />
                    </Field>

                    <Field icon={<FiMail />} label="البريد الإلكتروني" >
                        {/* استخدام dir="ltr" وحواذاه لليسار في الإيميل لمنع تشوه صيغة النص التقني */}
                        <input type="email" name="email"  value={form.email} onChange={handleChange} placeholder="captain@talabya.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-left" dir="ltr" />
                    </Field>

                    <Field icon={<FiPhone />} label="رقم الهاتف" required>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="059xxxxxxx" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-left" dir="ltr" />
                    </Field>

                    <Field icon={<RiBikeFill />} label="نوع المركبة / الدراجة" required>
                        <select name="bike" required value={form.bike} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer appearance-none">
                            <option value="" disabled>اختر نوع الدراجة</option>
                            <option value="bicycle">دراجة هوائية</option>
                            <option value="electric">دراجة كهربائية</option>
                            <option value="motorcycle">دراجة نارية</option>
                        </select>
                    </Field>

                    <Field icon={<RiMap2Fill />} label="العنوان السكني" wide>
                        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="مثال: غزة - الرمال - شارع الثلاثيني" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" />
                    </Field>

                    <Field icon={<FiMapPin />} label="منطقة العمل الإدارية / Area" wide>
                        <input type="text" name="area" value={form.area} onChange={handleChange} placeholder="مثال: غزة والوسطى" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" />
                    </Field>

                    <Field icon={<FiFileText />} label="ملاحظات تفصيلية" wide textarea>
                        <textarea rows={3} name="notes" value={form.notes} onChange={handleChange} placeholder="أدخل أي تفاصيل إضافية عن أوقات العمل أو الاستثناءات..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors resize-none" />
                    </Field>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-zinc-800/60 pt-5 mt-2">
                    <button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiPlusCircle className="text-base" />
                        <span>{loading ? "جاري الحفظ..." : "حفظ ملف الكابتن"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// تعديل مكوّن الحقل المشترك (Field) ليدعم إزاحة الرمز من جهة اليمين بدلاً من اليسار تلقائياً بناءً على الـ RTL
const Field = ({ children, icon, label, required, wide, textarea }: { children: React.ReactNode; icon: React.ReactNode; label: string; required?: boolean; wide?: boolean; textarea?: boolean }) => (
    <div className={`flex flex-col gap-1.5 ${wide ? "md:col-span-2" : ""}`}>
        <label className="text-xs text-zinc-400 font-bold">{label} {required && <span className="text-orange-500">*</span>}</label>
        <div className="relative text-right">
            {/* نقل تموضع الأيقونة من left-4 إلى right-4 ليناسب الاتجاه العربي لجميع المدخلات الملتزمة بالـ RTL عدا الإيميل والهاتف المعكوسين داخل المكون */}
            <span className={`absolute right-4 text-zinc-500 text-lg pointer-events-none ${textarea ? "top-3" : "inset-y-0 flex items-center"}`}>{icon}</span>
            {children}
        </div>
    </div>
);