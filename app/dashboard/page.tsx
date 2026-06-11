"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    FiPackage, FiTruck, FiUsers, FiTrendingUp, FiActivity,
    FiCheckCircle, FiClock, FiAlertCircle, FiDollarSign,
    FiArrowUpRight, FiRefreshCw, FiShoppingBag
} from 'react-icons/fi'

type OrderStatus = 'تم التوصيل' | 'جاري التوصيل' | 'معلق' | 'ملغي' | string;

type Order = {
    id: string;
    from: string;
    to: string;
    status: OrderStatus;
    price: string;
    createdAt: string;
    captainPaid: boolean;
    clientPaid: boolean;
    customer: { name: string; StoreName: string | null };
    captain: { name: string } | null;
    captainPrice: number;
}

type Captain = {
    id: string;
    name: string;
    Orders: { id: string }[];
}

type Customer = {
    id: string;
    name: string;
    orderCount: number;
}

const CAPTAIN_RATIO = 0.65;
const ADMIN_RATIO = 0.35;

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    'تم التوصيل': { label: 'تم التوصيل', color: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20', icon: FiCheckCircle },
    'جاري التوصيل': { label: 'جاري التوصيل', color: 'text-blue-400 bg-blue-500/10 border border-blue-500/20', icon: FiTruck },
    'معلق': { label: 'معلق', color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20', icon: FiClock },
    'ملغي': { label: 'ملغي', color: 'text-red-400 bg-red-500/10 border border-red-500/20', icon: FiAlertCircle },
}

const Dashboard = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [captains, setCaptains] = useState<Captain[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [lastRefreshed, setLastRefreshed] = useState(new Date())

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [ordersRes, captainsRes, customersRes] = await Promise.all([
                fetch('/api/order'),
                fetch('/api/captain'),
                fetch('/api/customers'),
            ])
            const ordersData = await ordersRes.json()
            const captainsData = await captainsRes.json()
            const customersData = await customersRes.json()

            setOrders(Array.isArray(ordersData) ? ordersData : [])
            setCaptains(Array.isArray(captainsData) ? captainsData : [])
            setCustomers(Array.isArray(customersData) ? customersData : [])
            setLastRefreshed(new Date())
        } catch (e) {
            console.error('Dashboard fetch error', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAll()
    }, [])

    // --- Calculations ---
    const completedOrders = orders.filter(o => o.status === 'تم التوصيل')
    const activeOrders = orders.filter(o => o.status === 'جاري التوصيل')
    const pendingOrders = orders.filter(o => o.status === 'معلق')

    let totalRevenue = 0
    let totalAdminBox = 0
    let totalCaptainDues = 0

    completedOrders.forEach(order => {
        const price = parseFloat(order.price || '0')
        if (!isNaN(price) && price > 0) {
            totalRevenue += price
            const captainShare =order.captainPrice|| Math.round(price * CAPTAIN_RATIO)
            totalCaptainDues += captainShare
            totalAdminBox += price - captainShare
        }
    })

    const successRate = orders.length > 0
        ? ((completedOrders.length / orders.length) * 100).toFixed(1)
        : '0.0'

    // Top captains by order count (from orders data)
    const captainOrderMap: Record<string, { name: string; count: number }> = {}
    orders.forEach(order => {
        if (order.captain) {
            const key = order.captain.name
            if (!captainOrderMap[key]) captainOrderMap[key] = { name: key, count: 0 }
            captainOrderMap[key].count++
        }
    })
    const topCaptains = Object.values(captainOrderMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    // Today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today)

    const stats = [
        {
            id: 1,
            title: 'طلبيات اليوم',
            value: todayOrders.length.toString(),
            sub: `${activeOrders.length} جاري التوصيل الآن`,
            icon: FiPackage,
            iconColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        },
        {
            id: 2,
            title: 'الكباتن المسجلين',
            value: captains.length.toString(),
            sub: `${topCaptains.length} نشطين بطلبات`,
            icon: FiTruck,
            iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        },
        {
            id: 3,
            title: 'العملاء المسجلين',
            value: customers.length.toString(),
            sub: `إجمالي ${orders.length} طلبية في النظام`,
            icon: FiUsers,
            iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        },
        {
            id: 4,
            title: 'نسبة الإنجاز',
            value: `${successRate}%`,
            sub: `${completedOrders.length} طلبية مكتملة`,
            icon: FiTrendingUp,
            iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        },
    ]

    const recentOrders = orders.slice(0, 8)

    return (
        <div className='p-6 min-h-screen text-black' dir='rtl'>

            {/* Header */}
            <div className='mb-8 flex items-center justify-between flex-wrap gap-4'>
                <div>
                    <h1 className='text-3xl font-black text-black uppercase tracking-wide'>لوحة التحكم الرئيسية</h1>
                    <p className='text-sm text-black/60 mt-1 font-semibold'>
                        مرحباً بك — آخر تحديث: {lastRefreshed.toLocaleTimeString('ar-EG')}
                    </p>
                </div>
                <button
                    onClick={fetchAll}
                    disabled={loading}
                    className='flex items-center gap-2 bg-zinc-900 text-white text-sm font-bold px-4 py-2 rounded-xl border border-zinc-700 hover:border-orange-500 transition-all disabled:opacity-50'
                >
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    تحديث البيانات
                </button>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
                {stats.map((stat) => {
                    const IconComponent = stat.icon
                    return (
                        <div key={stat.id} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex items-center justify-between hover:border-zinc-600 transition-all'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>{stat.title}</span>
                                <span className='text-white text-2xl font-black tracking-tight'>
                                    {loading ? <span className='inline-block w-16 h-6 bg-zinc-700 animate-pulse rounded' /> : stat.value}
                                </span>
                                <span className='text-zinc-500 text-xs font-medium'>{stat.sub}</span>
                            </div>
                            <div className={`p-3 rounded-xl border ${stat.iconColor}`}>
                                <IconComponent className='text-2xl' />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Financial Summary Row */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl'>
                    <div className='flex items-center gap-2 mb-3'>
                        <FiDollarSign className='text-emerald-400 text-lg' />
                        <span className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>إجمالي الإيرادات</span>
                    </div>
                    <p className='text-white text-3xl font-black'>
                        {loading ? <span className='inline-block w-24 h-7 bg-zinc-700 animate-pulse rounded' /> : `${totalRevenue.toFixed(0)} ₪`}
                    </p>
                    <p className='text-zinc-500 text-xs mt-1'>من {completedOrders.length} طلبية مكتملة</p>
                </div>
                <div className='bg-zinc-900 border border-amber-500/20 rounded-2xl p-5 shadow-xl'>
                    <div className='flex items-center gap-2 mb-3'>
                        <FiTruck className='text-amber-400 text-lg' />
                        <span className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>مستحقات الكباتن</span>
                    </div>
                    <p className='text-amber-400 text-3xl font-black'>
                        {loading ? <span className='inline-block w-24 h-7 bg-zinc-700 animate-pulse rounded' /> : `${totalCaptainDues.toFixed(0)} ₪`}
                    </p>
                    <p className='text-zinc-500 text-xs mt-1'>65% من إجمالي الإيرادات</p>
                </div>
                <div className='bg-zinc-900 border border-emerald-500/20 rounded-2xl p-5 shadow-xl'>
                    <div className='flex items-center gap-2 mb-3'>
                        <FiTrendingUp className='text-emerald-400 text-lg' />
                        <span className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>حصة الإدارة (قبل المصاريف)</span>
                    </div>
                    <p className='text-emerald-400 text-3xl font-black'>
                        {loading ? <span className='inline-block w-24 h-7 bg-zinc-700 animate-pulse rounded' /> : `${totalAdminBox.toFixed(0)} ₪`}
                    </p>
                    <p className='text-zinc-500 text-xs mt-1'>35% من إجمالي الإيرادات</p>
                </div>
            </div>

            {/* Bottom Grid: Recent Orders + Top Captains */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* Recent Orders Table */}
                <div className='lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl'>
                    <div className='flex items-center justify-between mb-4 border-b border-zinc-800 pb-3'>
                        <div className='flex items-center gap-2'>
                            <FiActivity className='text-orange-500 text-lg' />
                            <h2 className='text-white font-bold text-base'>آخر الطلبيات الحية</h2>
                        </div>
                        <Link href='/dashboard/orders' className='text-orange-400 text-xs font-bold flex items-center gap-1 hover:text-orange-300 transition-colors'>
                            عرض الكل <FiArrowUpRight />
                        </Link>
                    </div>

                    {loading ? (
                        <div className='space-y-3'>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className='h-10 bg-zinc-800 animate-pulse rounded-lg' />
                            ))}
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-12 text-zinc-500'>
                            <FiShoppingBag className='text-5xl mb-3 text-zinc-700' />
                            <p className='font-bold'>لا توجد طلبيات بعد</p>
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-right border-collapse'>
                                <thead>
                                    <tr className='text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-800/60'>
                                        <th className='pb-3'>المتجر / العميل</th>
                                        <th className='pb-3'>الوجهة</th>
                                        <th className='pb-3 text-center'>السعر</th>
                                        <th className='pb-3 text-center'>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm text-zinc-300 divide-y divide-zinc-800/40'>
                                    {recentOrders.map((order) => {
                                        const sc = statusConfig[order.status] || { label: order.status, color: 'text-zinc-400 bg-zinc-500/10', icon: FiClock }
                                        const StatusIcon = sc.icon
                                        return (
                                            <tr key={order.id} className='hover:bg-zinc-800/30 transition-colors'>
                                                <td className='py-3 font-bold text-white'>
                                                    {order.customer?.StoreName || order.customer?.name || '—'}
                                                    {order.captain && (
                                                        <span className='block text-xs text-zinc-500 font-normal'>
                                                            {order.captain.name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='py-3 text-zinc-400 text-xs'>{order.to}</td>
                                                <td className='py-3 text-center font-mono font-bold text-orange-400'>
                                                    {order.price ? `${order.price} ₪` : '—'}
                                                </td>
                                                <td className='py-3 text-center'>
                                                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs font-bold rounded-lg ${sc.color}`}>
                                                        <StatusIcon className='text-xs' />
                                                        {sc.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Top Captains + Quick Status */}
                <div className='flex flex-col gap-5'>

                    {/* Top Captains */}
                    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex-1'>
                        <div className='flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3'>
                            <FiTruck className='text-orange-500 text-lg' />
                            <h2 className='text-white font-bold text-base'>أنشط الكباتن</h2>
                        </div>

                        {loading ? (
                            <div className='space-y-3'>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className='h-12 bg-zinc-800 animate-pulse rounded-xl' />
                                ))}
                            </div>
                        ) : topCaptains.length === 0 ? (
                            <p className='text-zinc-500 text-sm text-center py-6'>لا توجد بيانات</p>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                {topCaptains.map((captain, index) => {
                                    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500']
                                    return (
                                        <div key={captain.name} className='flex items-center justify-between p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60 hover:border-zinc-600 transition-all'>
                                            <div className='flex items-center gap-3'>
                                                <span className={`w-6 h-6 rounded-full ${colors[index]} flex items-center justify-center text-white text-xs font-black`}>
                                                    {index + 1}
                                                </span>
                                                <span className='text-white font-bold text-sm'>{captain.name}</span>
                                            </div>
                                            <div className='text-left'>
                                                <span className='text-orange-400 font-mono font-black'>{captain.count}</span>
                                                <span className='text-zinc-500 text-xs font-medium mr-1'>طلب</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Status Summary */}
                    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl'>
                        <h2 className='text-white font-bold text-base mb-4 border-b border-zinc-800 pb-3'>ملخص الحالات</h2>
                        <div className='space-y-3'>
                            <div className='flex justify-between items-center'>
                                <span className='text-zinc-400 text-sm flex items-center gap-2'>
                                    <FiCheckCircle className='text-emerald-400' /> تم التوصيل
                                </span>
                                <span className='text-emerald-400 font-black font-mono'>{completedOrders.length}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-zinc-400 text-sm flex items-center gap-2'>
                                    <FiTruck className='text-blue-400' /> جاري التوصيل
                                </span>
                                <span className='text-blue-400 font-black font-mono'>{activeOrders.length}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-zinc-400 text-sm flex items-center gap-2'>
                                    <FiClock className='text-amber-400' /> معلق
                                </span>
                                <span className='text-amber-400 font-black font-mono'>{pendingOrders.length}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-zinc-400 text-sm flex items-center gap-2'>
                                    <FiPackage className='text-zinc-400' /> إجمالي
                                </span>
                                <span className='text-white font-black font-mono'>{orders.length}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ===== ملخص الطلبيات غير المدفوعة ===== */}
            {(() => {
                const unpaidCompleted = orders.filter(o => o.status === 'تم التوصيل' && !o.clientPaid)
                const totalUnpaid = unpaidCompleted.reduce((sum, o) => sum + (parseFloat(o.price || '0') || 0), 0)
                if (unpaidCompleted.length === 0) return null
                return (
                    <div className='mt-6 bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-xl overflow-hidden'>
                        <div className='flex items-center justify-between p-4 border-b border-amber-500/20 bg-amber-500/10'>
                            <div className='flex items-center gap-3'>
                                <span className='w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse' />
                                <div>
                                    <h2 className='text-white font-black text-sm'>⚠️ طلبيات مكتملة — لم يُستلم مبلغها بعد</h2>
                                    <p className='text-amber-400/70 text-xs'>{unpaidCompleted.length} طلبية بانتظار استلام المبلغ من صاحب الطلب</p>
                                </div>
                            </div>
                            <div className='text-left'>
                                <p className='text-amber-300 text-xs font-semibold'>إجمالي المعلق</p>
                                <p className='text-amber-400 text-xl font-black font-mono'>{totalUnpaid.toFixed(0)} ₪</p>
                            </div>
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-right text-sm'>
                                <thead className='bg-zinc-950 text-zinc-500 text-xs border-b border-zinc-800'>
                                    <tr>
                                        <th className='px-4 py-3'>العميل / المتجر</th>
                                        <th className='px-4 py-3'>الكابتن</th>
                                        <th className='px-4 py-3'>الوجهة</th>
                                        <th className='px-4 py-3'>التاريخ</th>
                                        <th className='px-4 py-3 text-center'>المبلغ المعلق</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-zinc-800/50 text-zinc-300'>
                                    {unpaidCompleted.map(order => (
                                        <tr key={order.id} className='hover:bg-amber-500/5 transition-colors border-r-2 border-r-amber-500/40'>
                                            <td className='px-4 py-3 font-bold text-white'>
                                                {order.customer?.StoreName || order.customer?.name || '—'}
                                            </td>
                                            <td className='px-4 py-3 text-xs'>
                                                <span className='px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-md font-semibold'>
                                                    {order.captain?.name || 'غير معين'}
                                                </span>
                                            </td>
                                            <td className='px-4 py-3 text-zinc-400 text-xs'>{order.to}</td>
                                            <td className='px-4 py-3 text-zinc-500 text-xs'>
                                                {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className='px-4 py-3 text-center font-black font-mono text-amber-400 text-base'>
                                                {parseFloat(order.price || '0').toFixed(0)} ₪
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })()}

        </div>
    )
}

export default Dashboard
