"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiEdit3, FiMail, FiMapPin, FiPhone, FiPlus, FiSearch, FiTrash2, FiUser } from "react-icons/fi";
import { RiBikeFill } from "react-icons/ri";
import Modal from "@/Components/Modal";

type Captain = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  Area?: string | null;
  bike?: string | null;
  notes?: string | null;
  _count?: { Orders: number };
};

const getAxiosMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export default function CaptainPage() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "confirm" | "alert" | "success" | "error";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  const loadCaptains = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.get<Captain[]>("/api/captain");
      setCaptains(res.data);
    } catch (error: unknown) {
      setMessage(getAxiosMessage(error, "فشل في تحميل بيانات الكباتن"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptains();
  }, []);

  const filteredCaptains = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return captains;

    return captains.filter((captain) =>
      [captain.name, captain.email, captain.phone, captain.address, captain.bike, captain.Area, captain.notes]
        .filter(Boolean)
        .some((item) => item!.toLowerCase().includes(value))
    );
  }, [captains, search]);

  const deleteCaptain = (id: string) => {
    setModal({
      isOpen: true,
      title: "تأكيد حذف الكابتن",
      message: "هل أنت متأكد من حذف هذا الكابتن نهائياً؟ لا يمكن التراجع عن هذا الإجراء.",
      type: "confirm",
      onConfirm: () => executeDeleteCaptain(id),
    });
  };

  const executeDeleteCaptain = async (id: string) => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    try {
      await axios.delete(`/api/captain/${id}`);
      setCaptains((items) => items.filter((item) => item.id !== id));
    } catch (error: unknown) {
      setMessage(getAxiosMessage(error, "فشل في حذف الكابتن"));
    }
  };

  // دالة مساعدة لترجمة نوع الدراجة المرتجع من قاعدة البيانات ليعرض بشكل منسق
  const translateBike = (bikeType: string | null | undefined) => {
    if (!bikeType) return "-";
    if (bikeType === "electric") return "دراجة كهربائية";
    if (bikeType === "bicycle") return "دراجة هوائية";
    return bikeType;
  };

  return (
    // تم إضافة dir="rtl" لقلب اتجاه الصفحة بالكامل وعناصرها لليمين
    <div className="p-6 min-h-screen text-black" dir="rtl">

      {/* هيدر الصفحة والزر العلوي */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6 text-right">
        <div>
          <h1 className="text-3xl font-black text-black tracking-wide font-sans">سجل الكباتن</h1>
          <p className="text-sm text-black/70 mt-1 font-semibold">إدارة كباتن التوصيل والمهام والطلبيات الحالية</p>
        </div>

        <Link href="/dashboard/captain/add" className="bg-black hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 w-fit">
          <FiPlus className="text-xl" />
          <span>إضافة كابتن جديد</span>
        </Link>
      </div>

      {/* شريط البحث ومعلومات التعداد */}
      <div className="w-full bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center text-right">

          {/* تم تعديل موضع أيقونة البحث والـ padding لتتناسب مع الاتجاه العربي */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">
              <FiSearch />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن كابتن (الاسم، الجوال، العنوان...)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-10 pl-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 text-right"
            />
          </div>
          <p className="text-sm text-zinc-400 font-semibold">{filteredCaptains.length} كابتن مسجل</p>
        </div>

        {/* عرض رسائل الخطأ إن وجدت */}
        {message && <div className="m-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-right">{message}</div>}

        {/* جدول عرض البيانات المستجيب المتناسق مع التوجه العربي */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-right border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 text-xs font-bold border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiUser className="text-orange-500" /> الاسم</span></th>
                {/* <th className="px-6 py-4"><span className="flex items-center gap-2"><FiMail className="text-orange-500" /> البريد الإلكتروني</span></th> */}
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiPhone className="text-orange-500" /> رقم الهاتف</span></th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><RiBikeFill className="text-orange-500" /> نوع المركبة</span></th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiMapPin className="text-orange-500" /> العنوان</span></th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiMapPin className="text-orange-500" /> المنطقة / الـ Area</span></th>
                <th className="px-6 py-4">عدد الطلبات</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-200 divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-zinc-400">جاري تحميل بيانات الكباتن...</td></tr>
              ) : filteredCaptains.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-zinc-400">لم يتم العثور على أي كباتن متوافقين مع البحث</td></tr>
              ) : filteredCaptains.map((captain) => (
                <tr key={captain.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-white">{captain.name}</td>
                  {/* جعل الإيميل والهاتف يحافظان على التنسيق الغربي الأصلي لعدم لخبطة الرموز */}
                  {/* <td className="px-6 py-4 whitespace-nowrap font-mono text-zinc-400 text-left" dir="ltr">{captain.email}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-zinc-400 text-left" dir="ltr">{captain.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {translateBike(captain.bike)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{captain.address || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{captain.Area || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-400">{captain._count?.Orders || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex items-center justify-center gap-2">
                    {/* زر التعديل الفوري للكابتن */}
                    <Link href={`/dashboard/captain/edit/${captain.id}`} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-orange-400 inline-flex items-center gap-1 font-semibold text-xs transition-colors">
                      <FiEdit3 /> <span>تعديل</span>
                    </Link>
                    <button onClick={() => deleteCaptain(captain.id)} className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-red-400 transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Confirmation / Alert */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText={modal.type === "confirm" ? "تأكيد الحذف" : "حسناً"}
        cancelText="إلغاء"
      />
    </div>
  );
}