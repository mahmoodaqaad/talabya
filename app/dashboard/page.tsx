"use client"

import axios from 'axios'
import React, { useEffect } from 'react'
// استيراد الأيقونات المناسبة للمؤشرات والإحصائيات
import { FiPackage, FiTruck, FiUsers, FiTrendingUp, FiActivity, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

const Dashboard = () => {

    useEffect(() => {
axios.get("/api/auth/me").then(res=>console.log(res.data))
.catch(err=>console.log(err))

     }, [])

    // بيانات وهمية للإحصائيات السريعة
    const stats = [
        { id: 1, title: 'Total Orders Today', value: '142', change: '+12% from yesterday', icon: FiPackage, iconColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
        { id: 2, title: 'Active Captains', value: '18 on duty', change: '3 currently delivering', icon: FiTruck, iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
        { id: 3, title: 'Registered Stores', value: '48 Shops', change: '+4 new this week', icon: FiUsers, iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
        { id: 4, title: 'Success Rate', value: '98.4%', change: 'Only 2 orders canceled', icon: FiTrendingUp, iconColor: 'text-green-500 bg-green-500/10 border-green-500/20' },
    ];

    // بيانات وهمية لآخر 3 طلبيات حية في النظام
    const recentOrders = [
        { id: '#TLB-9025', store: 'سوبرماركت البركة', zone: 'وسط البلد', status: 'قيد الانتظار', color: 'text-yellow-400 bg-yellow-500/10' },
        { id: '#TLB-9024', store: 'مكتبة النجاح', zone: 'دير البلح', status: 'جاري التوصيل', color: 'text-blue-400 bg-blue-500/10' },
        { id: '#TLB-9023', store: 'متجر كاندي شوكليت', zone: 'بني سهيلا', status: 'تم التسليم', color: 'text-green-400 bg-green-500/10' },
    ];

    // بيانات وهمية للكباتن المتميزين هذا اليوم
    const topCaptains = [
        { name: 'أحمد القرا', ordersCount: 24, status: 'Active', color: 'bg-green-500' },
        { name: 'بلال أبو مصطفى', ordersCount: 19, status: 'Active', color: 'bg-green-500' },
        { name: 'محمد المصري', ordersCount: 15, status: 'Break', color: 'bg-amber-500' },
    ];

    return (
        <div className='p-6 min-h-screen text-black'>
            {/* هيدر الترحيب العلوي */}
            <div className='mb-8'>
                <h1 className='text-3xl font-black text-black uppercase tracking-wide'>Main Dashboard</h1>
                <p className='text-sm text-black/70 mt-1 font-semibold'>Welcome back, Admin! Here is what&apos;s happening with Talabya today.</p>
            </div>

            {/* 1. شبكة كروت الإحصائيات (Stats Grid) */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
                {stats.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={stat.id} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex items-center justify-between'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>{stat.title}</span>
                                <span className='text-white text-2xl font-black tracking-tight'>{stat.value}</span>
                                <span className='text-zinc-500 text-xs font-medium'>{stat.change}</span>
                            </div>
                            <div className={`p-3 rounded-xl border ${stat.iconColor}`}>
                                <IconComponent className='text-2xl' />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* القسم السفلي: ينقسم إلى جزأين (آخر الطلبيات + الكباتن المتميزين) */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* 2. جدول آخر الحركات والطلبيات الحية (يأخذ مساحة 2/3) */}
                <div className='lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl'>
                    <div className='flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3'>
                        <FiActivity className='text-orange-500 text-lg' />
                        <h2 className='text-white font-bold text-base'>Live Activity Tracker</h2>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-800/60'>
                                    <th className='pb-3'>Order ID</th>
                                    <th className='pb-3 text-right dir-rtl'>Store</th>
                                    <th className='pb-3 text-right dir-rtl'>Destination</th>
                                    <th className='pb-3 text-center'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm text-zinc-300 divide-y divide-zinc-800/40'>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className='hover:bg-zinc-800/20 transition-colors'>
                                        <td className='py-3.5 font-mono font-bold text-orange-400'>{order.id}</td>
                                        <td className='py-3.5 text-right dir-rtl font-medium text-white'>{order.store}</td>
                                        <td className='py-3.5 text-right dir-rtl text-zinc-400'>{order.zone}</td>
                                        <td className='py-3.5 text-center'>
                                            <span className={`px-2 py-0.5 inline-flex text-xs font-bold rounded-md ${order.color}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. قائمة الكباتن الأكثر نشاطاً اليوم (يأخذ مساحة 1/3) */}
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col'>
                    <div className='flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3'>
                        <FiTruck className='text-orange-500 text-lg' />
                        <h2 className='text-white font-bold text-base'>Top Captains Today</h2>
                    </div>

                    <div className='flex flex-col gap-4 flex-1 justify-center'>
                        {topCaptains.map((captain, index) => (
                            <div key={index} className='flex items-center justify-between p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60'>
                                <div className='flex items-center gap-3'>
                                    {/* شارة الحالة الملونة بجانب الكابتن */}
                                    <span className={`w-2.5 h-2.5 rounded-full ${captain.color}`} />
                                    <span className='text-white font-bold text-sm text-right dir-rtl'>{captain.name}</span>
                                </div>
                                <div className='text-left'>
                                    <span className='text-orange-400 font-mono font-bold'>{captain.ordersCount}</span>
                                    <span className='text-zinc-500 text-xs font-medium ml-1'>Orders</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
