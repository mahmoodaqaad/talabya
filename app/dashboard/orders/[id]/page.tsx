"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

// ملاحظة: تأكد من تمرير الـ id عبر الـ params
const OrderPage = () => {
    const [order, setOrder] = useState<any>(null);
    const [captainShare, setCaptainShare] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axios.get(`/api/order/${id}`);
            setOrder(res.data);
            // حساب أولي لنصيب الكابتن (مثلاً 65%)
            setCaptainShare(res.data.captainPrice||Math.round(parseFloat(res.data.price) * 0.65));
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div>جاري تحميل بيانات الطلبية...</div>;

    const price = parseFloat(order.price || 0);
    const officeShare = price - captainShare;

    // حساب حصص الشركاء (محمود 40%, رنين 40%, مجد 20%)
    const mahmood = officeShare * 0.4;
    const raneen = officeShare * 0.4;
    const majd = officeShare * 0.2;

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-gray-900 text-white rounded-xl">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">تفاصيل الطلبية: #{order.id.slice(-5)}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="محتوى الطلب" value={order.content} />
                <InfoCard label="سعر الطلبية" value={`${price} ₪`} />
                <InfoCard label="الكابتن" value={order.captain?.name} />
                <InfoCard label="العميل" value={order.customer?.name} />
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h2 className="font-bold mb-2">الحسابات المالية:</h2>
                <div className="flex justify-between">
                    <span>نصيب الكابتن (قابل للتعديل):</span>
                    <input
                        type="number"
                        value={captainShare}
                        onChange={(e) => setCaptainShare(Number(e.target.value))}
                        className="bg-gray-700 w-20 px-2 rounded"
                    />
                </div>
                <p>حصة المكتب: {officeShare} ₪</p>
                <div className="mt-2 text-sm text-gray-400">
                    <p>محمود: {mahmood.toFixed(2)} ₪</p>
                    <p>رنين: {raneen.toFixed(2)} ₪</p>
                    <p>مجد: {majd.toFixed(2)} ₪</p>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <button className={order.clientPaid ? "bg-green-600 p-2" : "bg-red-600 p-2"}>
                    {order.clientPaid ? "تم دفع العميل" : "العميل لم يدفع"}
                </button>
            </div>
        </div>
    );
};

const InfoCard = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-gray-800 p-3 rounded">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="font-bold">{value || "غير متوفر"}</p>
    </div>
);

export default OrderPage;