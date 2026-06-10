"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiBox, FiFileText, FiMapPin, FiNavigation, FiPlusCircle, FiTruck, FiUser, FiPhone, FiDollarSign, FiCalendar, FiActivity } from "react-icons/fi";

type Captain = { id: string; name: string };
type Customer = { id: string; name: string; StoreName?: string | null };

const getAxiosMessage = (error: unknown, fallback: string) =>
    axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export default function AddOrderPage() {
    const [captains, setCaptains] = useState<Captain[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [isTodayDate, setIsTodayDate] = useState(true);

    const [form, setForm] = useState({
        from: "",
        to: "",
        captainId: "",
        CustomerId: "",
        content: "",
        notes: "",
        status: "جاري التوصيل", // 👈 الحالة الافتراضية المحددة تلقائياً
        customerName: "",
        customerPhone: "",
        price: "",
        customCreatedAt: "",
        clientPaid: false,
        captainPaid: false
    });

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [captainsRes, customersRes] = await Promise.all([
                    axios.get<Captain[]>("/api/captain"),
                    axios.get<Customer[]>("/api/customers")
                ]);
                setCaptains(captainsRes.data);
                setCustomers(customersRes.data);
            } catch (error: unknown) {
                setMessage({ type: "error", text: getAxiosMessage(error, "فشل في تحميل قوائم الخيارات") });
            }
        };
        loadOptions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const payload = {
                ...form,
                isNewCustomer,
                customCreatedAt: isTodayDate ? "" : form.customCreatedAt
            };

            const res = await axios.post("/api/order", payload);
            setMessage({ type: "success", text: res.data.message || "تم إنشاء الطلب بنجاح" });

            setForm({
                from: "",
                to: "",
                captainId: "",
                CustomerId: "",
                content: "",
                notes: "",
                status: "جاري التوصيل",
                customerName: "",
                customerPhone: "",
                price: "",
                customCreatedAt: "",
                clientPaid: false,
                captainPaid: false
            });
            setIsNewCustomer(false);
            setIsTodayDate(true);

            const customersRes = await axios.get<Customer[]>("/api/customers");
            setCustomers(customersRes.data);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getAxiosMessage(error, "فشل الاتصال بالسيرفر") });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen text-white text-right" dir="rtl">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                        <FiPlusCircle className="text-orange-500" /> إنشاء طلب جديد
                    </h1>
                    <p className="text-sm text-white/70 mt-1 font-semibold">تعيين العميل، الكابتن المسؤول، وتفاصيل خط سير التوصيل</p>
                </div>
                <Link href="/dashboard/orders" className="bg-black text-white rounded-xl px-4 py-2 text-sm font-bold inline-flex items-center gap-2 transition-colors hover:bg-zinc-800">
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

                    {/* قسم العميل */}
                    <div className="flex flex-col gap-1.5 md:col-span-2 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-zinc-400 font-bold">العميل الطالب / المتجر <span className="text-orange-500">*</span></label>
                            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px] font-bold">
                                <button type="button" onClick={() => setIsNewCustomer(false)} className={`px-3 py-1 rounded-md transition-all ${!isNewCustomer ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>عميل مسجل</button>
                                <button type="button" onClick={() => setIsNewCustomer(true)} className={`px-3 py-1 rounded-md transition-all ${isNewCustomer ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>+ عميل جديد سريع</button>
                            </div>
                        </div>

                        {!isNewCustomer ? (
                            <div className="relative text-right">
                                <span className="absolute right-4 text-zinc-500 text-lg inset-y-0 flex items-center pointer-events-none"><FiUser /></span>
                                <select required={!isNewCustomer} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer" value={form.CustomerId} onChange={(e) => setForm({ ...form, CustomerId: e.target.value })}>
                                    <option value="" disabled>اختر العميل أو المتجر المسجل من القائمة</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>{customer.StoreName || customer.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <span className="absolute right-4 text-zinc-500 text-lg inset-y-0 flex items-center pointer-events-none"><FiUser /></span>
                                    <input required={isNewCustomer} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="اسم العميل الجديد بالكامل" />
                                </div>
                                <div className="relative">
                                    <span className="absolute right-4 text-zinc-500 text-lg inset-y-0 flex items-center pointer-events-none"><FiPhone /></span>
                                    <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-left font-mono" dir="ltr" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="059xxxxxxx" />
                                </div>
                            </div>
                        )}
                    </div>

                    <Field icon={<FiTruck />} label="الكابتن المسؤول عن التوصيل" required>
                        <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer" value={form.captainId} onChange={(e) => setForm({ ...form, captainId: e.target.value })}>
                            <option value="" disabled>اختر كابتن التوصيل</option>
                            {captains.map((captain) => (
                                <option key={captain.id} value={captain.id}>{captain.name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field icon={<FiDollarSign />} label="سعر التوصيل" required>
                        <input type="number" step="0.1" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="أدخل تكلفة التوصيل (مثال: 10)" />
                    </Field>

                    {/* 👈 قسم تحديد حالة الطلب الجديد بإدراج الحالات الأربعة المطلوبة */}
                    <Field icon={<FiActivity />} label="حالة البدء للطلب" required>
                        <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="جاري التوصيل">جاري التوصيل (افتراضي)</option>
                            <option value="تم التوصيل">تم التوصيل</option>
                            <option value="مؤجل">مؤجل</option>
                            <option value="مرجع">مرجع</option>
                            <option value="ملغي">ملغي</option>
                        </select>
                    </Field>

                    {/* قسم التاريخ والوقت المتأخر */}
                    <div className="flex flex-col gap-1.5 bg-zinc-950/20 p-4 rounded-xl border border-zinc-800/50">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-zinc-300">
                            <input type="checkbox" checked={isTodayDate} onChange={(e) => setIsTodayDate(e.target.checked)} className="w-4 h-4 rounded border-zinc-800 text-orange-500 focus:ring-orange-500 bg-zinc-950 accent-orange-500 cursor-pointer" />
                            <span>تسجيل الطلب بتاريخ ووقت اليوم تلقائياً</span>
                        </label>

                        {!isTodayDate && (
                            <div className="relative mt-2 text-right transition-all">
                                <span className="absolute right-4 text-zinc-500 text-lg inset-y-0 flex items-center pointer-events-none"><FiCalendar /></span>
                                <input type="datetime-local" required={!isTodayDate} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono text-right" value={form.customCreatedAt} onChange={(e) => setForm({ ...form, customCreatedAt: e.target.value })} />
                            </div>
                        )}
                    </div>

                    <Field icon={<FiMapPin />} label="نقطة الاستلام (من)" required>
                        <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="عنوان أو اسم مكان الاستلام" />
                    </Field>

                    <Field icon={<FiNavigation />} label="نقطة التسليم (إلى)" required>
                        <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="عنوان العميل المستلم بالتفصيل" />
                    </Field>

                    <Field icon={<FiBox />} label="محتوى الشحنة / الطلب" required wide>
                        <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="مثال: وجبة طعام، قطع غيار..." />
                    </Field>

                    {/* قسم الحسابات والدفع */}
                    <div className="flex flex-col gap-1.5 md:col-span-2 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                        <label className="text-xs text-zinc-400 font-bold mb-1">الحسابات والدفع</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-zinc-200 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50 hover:border-orange-500/50 transition-colors">
                                <input type="checkbox" checked={form.clientPaid} onChange={(e) => setForm({ ...form, clientPaid: e.target.checked })} className="w-5 h-5 rounded border-zinc-800 text-orange-500 focus:ring-orange-500 bg-zinc-950 accent-orange-500 cursor-pointer" />
                                <span>وصلت الفلوس من صاحب الطلبية</span>
                            </label>
                            
                            <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-zinc-200 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50 hover:border-orange-500/50 transition-colors">
                                <input type="checkbox" checked={form.captainPaid} onChange={(e) => setForm({ ...form, captainPaid: e.target.checked })} className="w-5 h-5 rounded border-zinc-800 text-orange-500 focus:ring-orange-500 bg-zinc-950 accent-orange-500 cursor-pointer" />
                                <span>تم محاسبة الديلفري (الكابتن)</span>
                            </label>
                        </div>
                    </div>

                    <Field icon={<FiFileText />} label="ملاحظات وتوجيهات خاصة" wide textarea>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors resize-none" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="أدخل أي تفاصيل إضافية..." />
                    </Field>
                </div>

                <div className="flex justify-end border-t border-zinc-800/60 pt-5">
                    <button disabled={loading} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs disabled:opacity-50 transition-all hover:opacity-95">
                        <FiPlusCircle />
                        <span>{loading ? "جاري الإنشاء..." : "إنشاء الطلب وتكليف الكابتن"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

const Field = ({ children, icon, label, required, wide, textarea }: { children: React.ReactNode; icon: React.ReactNode; label: string; required?: boolean; wide?: boolean; textarea?: boolean }) => (
    <div className={`flex flex-col gap-1.5 ${wide ? "md:col-span-2" : ""}`}>
        <label className="text-xs text-zinc-400 font-bold">{label} {required && <span className="text-orange-500">*</span>}</label>
        <div className="relative text-right">
            <span className={`absolute right-4 text-zinc-500 text-lg pointer-events-none ${textarea ? "top-3" : "inset-y-0 flex items-center"}`}>{icon}</span>
            {children}
        </div>
    </div>
);