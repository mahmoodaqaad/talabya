"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiActivity, FiAlertTriangle, FiDollarSign,  FiTrash2, FiTrendingUp } from "react-icons/fi";
import { RiLoader2Fill, RiWallet2Fill } from "react-icons/ri";

type Order = {
  id: string;
  status: string;
  price: string;
  clientPaid: boolean;
  captainPaid: boolean;
  from: string;
  to: string;
  createdAt: string;
  customer?: { name: string; StoreName?: string | null } | null;
  captain?: { name: string } | null;
  captainPrice:number;
};

type Expense = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
};

export default function FinancialsDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, expensesRes] = await Promise.all([
        axios.get("/api/order"),
        axios.get("/api/expenses"),
      ]);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : []);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: expenseTitle, amount: parseFloat(expenseAmount) }),
      });
      if (res.ok) {
        setExpenseTitle("");
        setExpenseAmount("");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add expense", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete expense", error);
    }
  };

  const CAPTAIN_RATIO = 0.65;
  const completedOrders = orders.filter(o => o.status === "تم التوصيل");
  const receivedOrders = completedOrders.filter(o => o.clientPaid);
  const pendingPaymentOrders = completedOrders.filter(o => !o.clientPaid);

  const calcShares = (ordersGroup: typeof completedOrders) => {
    let revenue = 0, adminBox = 0, captainDues = 0;
    ordersGroup.forEach(o => {
      const price = parseFloat(o.price || "0") || 0;
      if (price > 0) {
        revenue += price;
        const captainShare = o.captainPrice||Math.round(price * CAPTAIN_RATIO);
        captainDues += captainShare;
        adminBox += price - captainShare;
      }
    });
    return { revenue, adminBox, captainDues };
  };

  const real = calcShares(receivedOrders);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const realNetProfit = real.adminBox - totalExpenses;
  const realMahmoud = realNetProfit * 0.40;
  const realRaneen = realNetProfit * 0.40;
  const realMajd = realNetProfit * 0.20;

  const estimated = calcShares(completedOrders);
  const estimatedNetProfit = estimated.adminBox - totalExpenses;

  const totalGrossRevenue = estimated.revenue;
  const totalCaptainDues = estimated.captainDues;
  const mahmoudShare = realMahmoud;
  const raneenShare = realRaneen;
  const majdShare = realMajd;
console.log("realNetProfit ",realNetProfit);

  const totalPendingAmount = pendingPaymentOrders.reduce((sum, o) => sum + (parseFloat(o.price || "0") || 0), 0);
  const totalReceivedAmount = receivedOrders.reduce((sum, o) => sum + (parseFloat(o.price || "0") || 0), 0);
  const captainUnpaidOrders = completedOrders.filter(o => !o.captainPaid);
  const captainPaidOrders = completedOrders.filter(o => o.captainPaid);
  const captainUnpaidAmount = captainUnpaidOrders.reduce((sum, o) => sum + (Number(o.captainPrice)|| Math.round((parseFloat(o.price || "0") || 0)*CAPTAIN_RATIO)), 0);
  const captainPaidAmount = captainPaidOrders.reduce((sum, o) => sum + (Number(o.captainPrice)||Math.round((parseFloat(o.price || "0") || 0) *CAPTAIN_RATIO)), 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 rounded-2xl" dir="rtl">
        <RiLoader2Fill className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 rounded-xl" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-8">

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <FiActivity className="h-8 w-8 text-blue-500" />
            لوحة الإدارة المالية والمحاسبة
          </h1>
          <p className="mt-2 text-gray-400 text-sm">إدارة إيرادات التوصيل، المصروفات المشتركة، وحصص الشركاء بشكل آلي.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "إجمالي الإيرادات", val: totalGrossRevenue, color: "text-blue-400", bg: "bg-blue-900/30", icon: FiDollarSign },
            { title: "مستحقات الكباتن", val: totalCaptainDues, color: "text-amber-400", bg: "bg-amber-900/30", icon: FiAlertTriangle },
            { title: "إجمالي المصروفات", val: totalExpenses, color: "text-red-400", bg: "bg-red-900/30", icon: RiWallet2Fill },
            { title: "مبالغ لم تُستلم", val: totalPendingAmount, color: "text-orange-400", bg: "bg-orange-900/30", icon: FiAlertTriangle },
            { title: "الربح الحقيقي", val: realNetProfit, color: "text-emerald-400", bg: "bg-emerald-900/30", icon: FiTrendingUp },
            { title: "الربح التقديري", val: estimatedNetProfit, color: "text-sky-400", bg: "bg-sky-900/30", icon: FiTrendingUp },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-800 bg-gray-800 p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full ${item.bg} p-3`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">{item.title}</p>
                  <p className="text-2xl font-bold text-white">{item.val.toFixed(1)} ₪</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-gray-600 bg-gray-800 shadow-sm overflow-hidden">
            <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
              <h2 className="text-lg font-bold text-white">توزيع حصص الشركاء</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-right text-sm">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">الشريك</th>
                  <th className="px-6 py-4 font-medium text-left">الحصة المستحقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[
                  { name: "محمود", val: mahmoudShare },
                  { name: "رنين", val: raneenShare },
                  { name: "مجد", val: majdShare },
                ].map((s, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-bold text-white">{s.name}</td>
                    <td className="px-6 py-4 text-left font-bold text-emerald-400">{s.val.toFixed(2)} ₪</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-800 p-6">
              <h2 className="text-lg font-bold mb-4 text-white">إضافة مصروف</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <input type="text" placeholder="الوصف" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-white" />
                <input type="number" placeholder="المبلغ" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-white" />
                <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg text-white font-bold">تسجيل</button>
              </form>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-800 shadow-sm flex-1 flex flex-col overflow-hidden max-h-[400px]">
              <div className="border-b border-gray-700 bg-gray-900/50 px-6 py-4">
                <h2 className="text-lg font-bold">سجل المصروفات</h2>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    لا توجد مصروفات مسجلة حتى الآن.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {expenses.map((expense) => (
                      <li
                        key={expense.id}
                        className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-700/30 p-3 hover:bg-gray-700/60 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{expense.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(expense.createdAt).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-red-400 text-sm whitespace-nowrap">
                            - {expense.amount.toFixed(1)} ₪
                          </span>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                            title="حذف"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ====== قسم المدفوعات المعلقة والمستلمة ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* مبالغ العملاء المعلقة */}
          <div className="rounded-2xl border border-amber-900/50 bg-gray-800 shadow-sm overflow-hidden">
            <div className="border-b border-amber-900/50 bg-amber-900/20 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
                  <FiAlertTriangle className="h-5 w-5 text-amber-400" />
                  مبالغ العملاء — معلقة لم تُستلم
                </h2>
                <p className="text-xs text-amber-600 mt-1">{pendingPaymentOrders.length} طلبية مكتملة بانتظار التسليم</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-amber-400 font-mono">{totalPendingAmount.toFixed(0)} ₪</p>
                <p className="text-xs text-amber-600">مستلم: {totalReceivedAmount.toFixed(0)} ₪</p>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[320px]">
              {pendingPaymentOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">✅ تم استلام جميع المبالغ</div>
              ) : (
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-900/50 text-gray-400 text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">العميل</th>
                      <th className="px-4 py-3 font-medium">الكابتن</th>
                      <th className="px-4 py-3 font-medium">التاريخ</th>
                      <th className="px-4 py-3 font-medium text-left">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {pendingPaymentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-amber-900/10 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          {order.customer?.StoreName || order.customer?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{order.captain?.name || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="px-4 py-3 text-left font-black text-amber-400 font-mono">
                          {parseFloat(order.price || "0").toFixed(0)} ₪
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* مستحقات الكباتن المعلقة */}
          <div className="rounded-2xl border border-orange-900/50 bg-gray-800 shadow-sm overflow-hidden">
            <div className="border-b border-orange-900/50 bg-orange-900/20 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5 text-orange-400" />
                  مستحقات الكباتن — لم تُدفع بعد
                </h2>
                <p className="text-xs text-orange-600 mt-1">{captainUnpaidOrders.length} طلبية بانتظار تسوية الكابتن</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-orange-400 font-mono">{captainUnpaidAmount.toFixed(0)} ₪</p>
                <p className="text-xs text-orange-600">تم دفعه: {captainPaidAmount.toFixed(0)} ₪</p>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[320px]">
              {captainUnpaidOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">✅ تم تسوية جميع الكباتن</div>
              ) : (
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-900/50 text-gray-400 text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">الكابتن</th>
                      <th className="px-4 py-3 font-medium">العميل</th>
                      <th className="px-4 py-3 font-medium">التاريخ</th>
                      <th className="px-4 py-3 font-medium text-left">حصته (65%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {captainUnpaidOrders.map(order => {
                      const price = parseFloat(order.price || "0") || 0;
                      const captainCut = order.captainPrice||Math.round(price * 0.65);
                      return (
                        <tr key={order.id} className="hover:bg-orange-900/10 transition-colors">
                          <td className="px-4 py-3 font-medium">{order.captain?.name || "—"}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                            {order.customer?.StoreName || order.customer?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                          </td>
                          <td className="px-4 py-3 text-left font-black text-orange-600 dark:text-orange-400 font-mono">
                            {captainCut} ₪
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}