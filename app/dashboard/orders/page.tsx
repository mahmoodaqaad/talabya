"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiBox, FiMapPin, FiNavigation, FiPlus, FiSearch, FiTrash2, FiTruck, FiUser, FiEdit3, FiRefreshCw } from "react-icons/fi";
import Modal from "@/Components/Modal";

type Order = {
  id: string;
  from: string;
  to: string;
  content: string;
  notes: string;
  status: string;
  CustomerId: string;
  captainId: string;
  price: string;
  clientPaid: boolean;
  captainPaid: boolean;
  customer?: { name: string } | null;
  captain?: { name: string } | null;
  createdAt: string | Date
};

const getAxiosMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

const statusStyle: Record<string, string> = {
  "جاري التوصيل": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "تم التوصيل": "text-green-400 bg-green-500/10 border-green-500/20",
  "مؤجل": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "مرجع": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "ملغي": "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>();
  const [updatingClientPaidId, setUpdatingClientPaidId] = useState<string | null>(null);
  const [updatingCaptainPaidId, setUpdatingCaptainPaidId] = useState<string | null>(null);
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
    const loadOrders = async () => {
      try {
        const res = await axios.get<Order[]>("/api/order");
        setOrders(res.data);
      } catch (error: unknown) {
        setMessage(getAxiosMessage(error, "فشل في تحميل سجل الطلبات"));
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // 👈 دالة التحديث السريع والذكي للحالة بنقرة واحدة من الجوال
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await axios.patch(`/api/order/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error: unknown) {
      setModal({
        isOpen: true,
        title: "خطأ في التحديث",
        message: getAxiosMessage(error, "فشل تحديث الحالة المتنقلة"),
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleClientPaid = async (orderId: string, currentVal: boolean) => {
    setUpdatingClientPaidId(orderId);
    try {
      await axios.patch(`/api/order/${orderId}`, { clientPaid: !currentVal });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, clientPaid: !currentVal } : order))
      );
    } catch (error: unknown) {
      setModal({
        isOpen: true,
        title: "خطأ في التحديث",
        message: getAxiosMessage(error, "فشل تحديث حالة الدفع للعميل"),
        type: "error",
      });
    } finally {
      setUpdatingClientPaidId(null);
    }
  };

  const handleToggleCaptainPaid = async (orderId: string, currentVal: boolean) => {
    setUpdatingCaptainPaidId(orderId);
    try {
      await axios.patch(`/api/order/${orderId}`, { captainPaid: !currentVal });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, captainPaid: !currentVal } : order))
      );
    } catch (error: unknown) {
      setModal({
        isOpen: true,
        title: "خطأ في التحديث",
        message: getAxiosMessage(error, "فشل تحديث حالة الدفع للكابتن"),
        type: "error",
      });
    } finally {
      setUpdatingCaptainPaidId(null);
    }
  };

  const deleteOrder = (id: string) => {
    setModal({
      isOpen: true,
      title: "تأكيد حذف الطلب",
      message: "هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.",
      type: "confirm",
      onConfirm: () => executeDeleteOrder(id),
    });
  };

  const executeDeleteOrder = async (id: string) => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    try {
      await axios.delete(`/api/order/${id}`);
      setOrders((items) => items.filter((item) => item.id !== id));
    } catch (error: unknown) {
      setMessage(getAxiosMessage(error, "فشل في حذف الطلب"));
    }
  };

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return orders;
    return orders.filter((order) =>
      [order.id, order.from, order.to, order.content, order.status, order.customer?.name, order.captain?.name]
        .filter(Boolean)
        .some((item) => item!.toLowerCase().includes(value))
    );
  }, [orders, search]);

  return (
    <div className="p-4 md:p-6 min-h-screen text-black" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 text-right">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-wide">المراقبة الحية للطلبيات</h1>
          <p className="text-xs md:text-sm text-black/70 mt-1 font-semibold">تحديث سريع للحالات بلمسة واحدة متوافقة تماماً مع الجوال</p>
        </div>
        <Link href="/dashboard/orders/add" className="bg-black hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 w-full sm:w-fit justify-center">
          <FiPlus className="text-xl" />
          <span>إنشاء طلب جديد</span>
        </Link>
      </div>

      <div className="w-full bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-right">
          <div className="relative w-full sm:w-96">
            <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400"><FiSearch /></span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن طلب..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 text-right" />
          </div>
          <p className="text-sm text-zinc-400 font-semibold">{filteredOrders.length} طلب حالي</p>
        </div>

        {message && <div className="m-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-right">{message}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full text-right border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 text-xs font-bold border-b border-zinc-800">
              <tr>
                <th className="px-4 py-4">محتوى الطلب</th>
                <th className="px-4 py-4">المسار (الى ➔ من)</th>
                <th className="px-4 py-4">العميل / المتجر</th>
                <th className="px-4 py-4">الكابتن</th>
                <th className="px-4 py-4">التاريخ والوقت</th>
                <th className="px-4 py-4">سعر التوصيل</th>
                <th className="px-4 py-4 text-center">وصلت الفلوس</th>
                <th className="px-4 py-4 text-center">محاسبة الديلفري</th>
                <th className="px-4 py-4">حالة الطلب السريعة</th>
                <th className="px-4 py-4 text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-200 divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-zinc-400">جاري تحميل لوحة الطلبات...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-zinc-400">لم يتم العثور على طلبيات مسجلة</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-4 font-semibold text-zinc-100 max-w-[180px] truncate" title={order.content}>{order.content}</td>
                  <td dir="rtl" className="px-4 py-4 whitespace-nowrap text-xs text-zinc-300">
                    <span className="text-white font-medium">{order.to}</span>
                    <span className="mx-1 text-orange-500">➔</span>
                    <span className="text-zinc-400">{order.from}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-zinc-300">{order.customer?.name || "-"}</td>
                  <td className="px-4 py-4 whitespace-nowrap"><span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">{order.captain?.name || "غير معين"}</span></td>
                  <td className="px-4 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()} - {new Date(order.createdAt).toLocaleTimeString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{order.price}</td>

                  {/* محاسبة العميل */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      disabled={updatingClientPaidId === order.id}
                      onClick={() => handleToggleClientPaid(order.id, order.clientPaid)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all inline-flex items-center gap-1.5 ${updatingClientPaidId === order.id
                          ? "text-zinc-400 bg-zinc-800 border-zinc-700 opacity-60 cursor-not-allowed"
                          : order.clientPaid
                            ? "text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/20 cursor-pointer"
                            : "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                        }`}
                    >
                      {updatingClientPaidId === order.id ? (
                        <>
                          <FiRefreshCw className="animate-spin text-orange-500" />
                          <span>جاري التحديث</span>
                        </>
                      ) : (
                        order.clientPaid ? "تم الاستلام" : "معلق"
                      )}
                    </button>
                  </td>

                  {/* محاسبة الديلفري */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      disabled={updatingCaptainPaidId === order.id}
                      onClick={() => handleToggleCaptainPaid(order.id, order.captainPaid)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all inline-flex items-center gap-1.5 ${updatingCaptainPaidId === order.id
                          ? "text-zinc-400 bg-zinc-800 border-zinc-700 opacity-60 cursor-not-allowed"
                          : order.captainPaid
                            ? "text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/20 cursor-pointer"
                            : "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                        }`}
                    >
                      {updatingCaptainPaidId === order.id ? (
                        <>
                          <FiRefreshCw className="animate-spin text-orange-500" />
                          <span>جاري التحديث</span>
                        </>
                      ) : (
                        order.captainPaid ? "تمت المحاسبة" : "معلق"
                      )}
                    </button>
                  </td>

                  {/* 👈 خلية تغيير الحالة السريعة القائمة على اللمس اللحظي بـ Select Dropdown مخصص */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="relative inline-block w-36">
                      {updatingId === order.id ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md border text-zinc-400 bg-zinc-800 border-zinc-700">
                          <FiRefreshCw className="animate-spin text-orange-500" />
                          <span>جاري التحديث</span>
                        </div>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`w-full px-2.5 py-1 text-xs font-bold rounded-md border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 text-center ${statusStyle[order.status] || "text-zinc-400 bg-zinc-800 border-zinc-700"
                            }`}
                        >
                          <option value="جاري التوصيل">جاري التوصيل</option>
                          <option value="تم التوصيل">تم التوصيل</option>
                          <option value="مؤجل">مؤجل</option>
                          <option value="مرجع">مرجع</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      )}
                    </div>
                  </td>

                  {/* أزرار الإجراءات وتوجيه لصفحة التعديل الشاملة */}
                  <td className="px-4 py-4 whitespace-nowrap text-center flex items-center justify-center gap-2">


                    <Link href={`/dashboard/orders/edit/${order.id}`} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-orange-400 inline-flex items-center gap-1 font-semibold text-xs transition-colors">
                      <FiEdit3 />
                      <span>تعديل</span>
                    </Link>
                    <button onClick={() => deleteOrder(order.id)} className="p-2 rounded-lg bg-zinc-800/60 text-zinc-400 hover:text-red-400 inline-flex items-center transition-colors">
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

      {/* ====== جدول الطلبيات غير المدفوعة ====== */}
      {!loading && (() => {
        const unpaidOrders = orders.filter(o => !o.clientPaid && o.status === "تم التوصيل");
        const totalPending = unpaidOrders.reduce((sum, o) => sum + (parseFloat(o.price || "0") || 0), 0);

        if (unpaidOrders.length === 0) return null;

        return (
          <div className="mt-8 bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <div>
                  <h2 className="text-white font-black text-base">⚠️ طلبيات مكتملة — لم يتم استلام المبلغ بعد</h2>
                  <p className="text-amber-400/70 text-xs mt-0.5">{unpaidOrders.length} طلبية بانتظار تسليم المبلغ من صاحب الطلب</p>
                </div>
              </div>
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-4 py-2 text-left">
                <p className="text-amber-300 text-xs font-bold">إجمالي المبالغ المعلقة</p>
                <p className="text-amber-400 text-2xl font-black font-mono">{totalPending.toFixed(0)} ₪</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-right border-collapse">
                <thead className="bg-zinc-950 text-zinc-400 text-xs font-bold border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">محتوى الطلب</th>
                    <th className="px-4 py-3">المسار</th>
                    <th className="px-4 py-3">العميل / المتجر</th>
                    <th className="px-4 py-3">الكابتن</th>
                    <th className="px-4 py-3">التاريخ</th>
                    <th className="px-4 py-3 text-center">المبلغ المعلق</th>
                    <th className="px-4 py-3 text-center">تحديث الاستلام</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-zinc-200 divide-y divide-zinc-800/50">
                  {unpaidOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-500/5 transition-colors border-r-2 border-r-amber-500/40">
                      <td className="px-4 py-3.5 font-semibold text-zinc-100 max-w-[180px] truncate">{order.content}</td>
                      <td className="px-4 py-3.5 text-xs text-zinc-300 whitespace-nowrap">
                        <span className="text-white font-medium">{order.to}</span>
                        <span className="mx-1 text-orange-500">➔</span>
                        <span className="text-zinc-400">{order.from}</span>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-300 whitespace-nowrap">{order.customer?.name || "—"}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {order.captain?.name || "غير معين"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-amber-400 font-black font-mono text-base">
                          {parseFloat(order.price || "0").toFixed(0)} ₪
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          disabled={updatingClientPaidId === order.id}
                          onClick={() => handleToggleClientPaid(order.id, order.clientPaid)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border transition-all inline-flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/25 cursor-pointer disabled:opacity-50"
                        >
                          {updatingClientPaidId === order.id ? (
                            <><FiRefreshCw className="animate-spin" /><span>جاري...</span></>
                          ) : (
                            "✓ تأكيد الاستلام"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
}