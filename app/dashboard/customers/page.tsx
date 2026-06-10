"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiEdit3, FiMapPin, FiPhone, FiPlus, FiSearch, FiShoppingBag, FiTrash2, FiUser } from "react-icons/fi";
import Modal from "@/Components/Modal";

type Customer = {
  id: string;
  name: string;
  email: string;
  isStoreOwner: boolean;
  StoreName?: string | null;
  orderCount: number;
  phone?: string | null;
  address?: string | null;
  _count?: { customerOrders: number };
};

const getAxiosMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await axios.get<Customer[]>("/api/customers");
        setCustomers(res.data);
      } catch (error: unknown) {
        setMessage(getAxiosMessage(error, "فشل في تحميل بيانات العملاء"));
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.address, customer.StoreName]
        .filter(Boolean)
        .some((item) => item!.toLowerCase().includes(value))
    );
  }, [customers, search]);

  const deleteCustomer = (id: string) => {
    setModal({
      isOpen: true,
      title: "تأكيد حذف العميل/المتجر",
      message: "هل أنت متأكد من حذف هذا العميل/المتجر نهائياً؟ لا يمكن التراجع عن هذا الإجراء.",
      type: "confirm",
      onConfirm: () => executeDeleteCustomer(id),
    });
  };

  const executeDeleteCustomer = async (id: string) => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    try {
      await axios.delete(`/api/customers/${id}`);
      setCustomers((items) => items.filter((item) => item.id !== id));
    } catch (error: unknown) {
      setMessage(getAxiosMessage(error, "فشل في حذف العميل"));
    }
  };

  return (
    // تم تفعيل الاتجاه العربي والمحاذاة لليمين عبر الـ Tailwind
    <div className="p-6 min-h-screen text-black" dir="rtl">

      {/* هيدر الصفحة */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6 text-right">
        <div>
          <h1 className="text-3xl font-black text-black tracking-wide">سجل العملاء والمتاجر</h1>
          <p className="text-sm text-black/70 mt-1 font-semibold">إدارة الحسابات، المتاجر الشريكة ومتابعة إحصائيات الطلبيات</p>
        </div>
        <Link href="/dashboard/customers/add" className="bg-black hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 w-fit">
          <FiPlus className="text-xl" />
          <span>إضافة عميل جديد</span>
        </Link>
      </div>

      {/* صندوق البحث والجدول */}
      <div className="w-full bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center text-right">

          {/* تعديل الأيقونة والـ padding لتناسب الـ RTL */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">
              <FiSearch />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن عميل (الاسم، المتجر، رقم الهاتف...)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-10 pl-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 text-right"
            />
          </div>
          <p className="text-sm text-zinc-400 font-semibold">{filteredCustomers.length} عميل مسجل</p>
        </div>

        {message && <div className="m-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-right">{message}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full text-right border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 text-xs font-bold border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiUser className="text-orange-500" /> العميل</span></th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiShoppingBag className="text-orange-500" /> نوع الحساب</span></th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiPhone className="text-orange-500" /> رقم الهاتف</span></th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><FiMapPin className="text-orange-500" /> العنوان</span></th>
                <th className="px-6 py-4">الطلبيات</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-200 divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-400">جاري تحميل بيانات العملاء...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-400">لم يتم العثور على أي عملاء</td></tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-white text-right">{customer.name}</p>
                    {/* الحفاظ على قراءة البريد الإلكتروني بنسق LTR لتفادي تشوه العلامات */}
                    <p className="text-xs text-zinc-500 font-mono text-left" dir="ltr">{customer.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.isStoreOwner ? (
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        صاحب متجر: {customer.StoreName || "غير محدد"}
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-medium">عميل عادي</span>
                    )}
                  </td>
                  {/* رقم الهاتف يقرأ LTR ومحاذاة لليسار لسلامة الأرقام */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-zinc-400 text-left" dir="ltr">{customer.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{customer.address || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-400">
                    {customer._count?.customerOrders ?? customer.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex items-center justify-center gap-2">
                    {/* زر التعديل المستهدف للجوال باللمس */}
                    <Link href={`/dashboard/customers/edit/${customer.id}`} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-orange-400 inline-flex items-center gap-1 font-semibold text-xs transition-colors">
                      <FiEdit3 /> <span>تعديل</span>
                    </Link>
                    <button onClick={() => deleteCustomer(customer.id)} className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-red-400 transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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