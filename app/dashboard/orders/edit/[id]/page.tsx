"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowRight, FiBox, FiFileText, FiMapPin, FiNavigation, FiSave, FiTruck, FiDollarSign, FiCalendar, FiActivity, FiPlayCircle } from "react-icons/fi";

const getAxiosMessage = (error: unknown, fallback: string) =>
    axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export default function EditOrderPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [allCaptains, setAllCaptains] = useState<{ id: string; name: string }[]>([]);

    const [form, setForm] = useState({
        from: "", to: "", captainId: "", content: "", notes: "", status: "", price: "", createdAt: "", clientPaid: false, captainPaid: false, captainPrice: 0
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [orderRes, captainsRes] = await Promise.all([
                    axios.get(`/api/order/${id}`),
                    axios.get("/api/captain")
                ]);
                const o = orderRes.data;
                setAllCaptains(captainsRes.data);
                setForm({
                    from: o.from, to: o.to, captainId: o.captainId, content: o.content, notes: o.notes, status: o.status, price: o.price.toString(),
                    createdAt: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 16) : "",
                    clientPaid: o.clientPaid || false,
                    captainPaid: o.captainPaid || false,
                    captainPrice: o.captainPrice
                });

            } catch (error: unknown) {
                setMessage({ type: "error", text: getAxiosMessage(error, "فشل جلب بيانات الطلب") });
            } finally {

                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const [savingStatus, setSavingStatus] = useState(false);

    const handleQuickStatusUpdate = async () => {
        setSavingStatus(true);
        setMessage({ type: "", text: "" });
        try {
            await axios.patch(`/api/order/${id}`, { status: form.status });
            setMessage({ type: "success", text: "تم تحديث حالة الطلب بنجاح" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getAxiosMessage(error, "فشل تحديث الحالة") });
        } finally {
            setSavingStatus(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await axios.patch(`/api/order/${id}`, form);
            setMessage({ type: "success", text: "تم تحديث بيانات الطلب بنجاح" });
            setTimeout(() => router.push("/dashboard/orders"), 1000);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getAxiosMessage(error, "فشل حفظ البيانات") });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-white bg-zinc-950 min-h-screen">جاري تحميل بيانات الطلب...</div>;

    return (
        <div className="p-4 md:p-6 min-h-screen text-white text-right" dir="rtl">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">تعديل بيانات الطلب</h1>
                    <p className="text-xs text-white/70 mt-1">تحديث مسار، تكلفة وحالة الشحنة الحالية</p>
                </div>
                <Link href="/dashboard/orders" className="bg-black text-white rounded-xl px-4 py-2 text-xs font-bold inline-flex items-center gap-2">
                    <FiArrowRight /> <span>رجوع للطلبات</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-2xl max-w-4xl mx-auto flex flex-col gap-5">
                {message.text && (
                    <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field icon={<FiBox />} label="محتوى الشحنة" required>
                        <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                    </Field>
                    <Field icon={<FiDollarSign />} label="سعر التوصيل" required>
                        <input type="number" step="0.1" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm font-mono text-white" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </Field>
                    <Field icon={<FiActivity />} label="حالة الطلب" required>
                        <div className="flex gap-2">
                            <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:border-orange-500 appearance-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="جاري التوصيل">جاري التوصيل</option>
                                <option value="تم التوصيل">تم التوصيل</option>
                                <option value="مؤجل">مؤجل</option>
                                <option value="مرجع">مرجع</option>
                                <option value="ملغي">ملغي</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleQuickStatusUpdate}
                                disabled={savingStatus}
                                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl px-4 py-3 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
                            >
                                {savingStatus ? "جاري التحديث..." : "تحديث الحالة"}
                            </button>
                        </div>
                    </Field>
                    <Field icon={<FiCalendar />} label="تاريخ ووقت تسجيل الطلب" required>
                        <input type="datetime-local" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white font-mono" value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })} />
                    </Field>
                    <Field icon={<FiMapPin />} label="مكان الاستلام (من)" required>
                        <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                    </Field>
                    <Field icon={<FiNavigation />} label="مكان التسليم (إلى)" required>
                        <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                    </Field>
                    <Field icon={<FiTruck />} label="الكابتن المسؤول" required >
                        <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white appearance-none" value={form.captainId} onChange={(e) => setForm({ ...form, captainId: e.target.value })}>
                            {allCaptains.map((cap) => <option key={cap.id} value={cap.id}>{cap.name}</option>)}
                        </select>
                    </Field>
                    <Field icon={<FiDollarSign />} label="سعر الكابتن" required>
                        <input type="number" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={form.captainPrice} onChange={(e) => setForm({ ...form, captainPrice: e.target.value })} />
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
                    <Field icon={<FiFileText />} label="ملاحظات الطلب" wide textarea>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white resize-none" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </Field>

                        {/* readonly  */}
                    <div className="flex justify-center items-center">
                        
                    <Field icon={<FiDollarSign />} label="حصة محمود" required>
                        <input disabled readOnly required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={((Number(form.price) - Number(form.captainPrice)) * 0.40).toFixed(2)} />
                    </Field>
                    <Field icon={<FiDollarSign />} label="حصة رنين" required>
                        <input disabled readOnly required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white" value={((Number(form.price) - Number(form.captainPrice)) * 0.40).toFixed(2)} />
                    </Field>
                    <Field icon={<FiDollarSign />} label="حصة مجد" required>
                        <input disabled readOnly required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-12 pl-4 py-3 text-sm text-white"  value={((Number(form.price) - Number(form.captainPrice)) * 0.20).toFixed(2)}  />
                    </Field>
                    </div>
                </div>


                <div className="flex justify-end border-t border-zinc-800/60 pt-5">
                    <button disabled={saving} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-xs disabled:opacity-50 transition-all">
                        <FiSave /> <span>حفظ التعديلات</span>
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