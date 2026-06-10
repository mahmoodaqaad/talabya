import React from 'react'
import { FiBarChart2, FiCalendar, FiDownload, FiDollarSign, FiPackage, FiClock, FiCheckCircle, FiArrowUpRight } from 'react-icons/fi'
import { RiStoreLine } from 'react-icons/ri';
const Reports = () => {
  // بيانات وهمية لإحصائيات التقارير
  const reportStats = [
    { title: 'Net Revenue (صافي الأرباح)', value: '₪8,420', change: '+14.2%', icon: FiDollarSign, color: 'text-green-400' },
    { title: 'Completed Deliveries', value: '1,240', change: '+8.6%', icon: FiPackage, color: 'text-orange-400' },
    { title: 'Avg. Delivery Time', value: '24 Min', change: '-4 Min', icon: FiClock, color: 'text-blue-400' },
    { title: 'Success Rate', value: '99.1%', change: '+0.3%', icon: FiCheckCircle, color: 'text-purple-400' },
  ];

  // بيانات وهمية للرسم البياني (أيام الأسبوع)
  const chartData = [
    { day: 'Sat', count: 120, height: 'h-32' },
    { day: 'Sun', count: 150, height: 'h-40' },
    { day: 'Mon', count: 95, height: 'h-24' },
    { day: 'Tue', count: 180, height: 'h-48' },
    { day: 'Wed', count: 140, height: 'h-36' },
    { day: 'Thu', count: 210, height: 'h-56' }, // أعلى يوم ضغط طلبيات
    { day: 'Fri', count: 80, height: 'h-20' },
  ];

  return (
    <div className='p-6 min-h-screen text-black'>
      {/* الهيدر العلوي وصفحة التحكم الزمنية */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-black text-black uppercase tracking-wide flex items-center gap-2'>
            <FiBarChart2 className='text-orange-500' /> System Analytics
          </h1>
          <p className='text-sm text-black/70 mt-1 font-semibold'>Track financials, delivery performance, and platform growth</p>
        </div>

        {/* أدوات الفلترة وتصدير البيانات */}
        <div className='flex items-center gap-3 w-full sm:w-auto text-white text-sm'>
          <div className='flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2'>
            <FiCalendar className='text-orange-500' />
            <select className='bg-transparent focus:outline-none cursor-pointer text-xs font-semibold'>
              <option>This Month (الشهر الحالي)</option>
              <option>Last Week (الأسبوع الماضي)</option>
              <option>Custom Range (مخصص)</option>
            </select>
          </div>
          <button className='bg-black hover:bg-zinc-800 font-bold px-4 py-2 rounded-xl transition-all shadow-lg flex items-center gap-2 text-xs'>
            <FiDownload />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* كروت الأداء المالي والتكتيكي */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
        {reportStats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex items-center justify-between'>
              <div className='flex flex-col gap-1'>
                <span className='text-zinc-400 text-xs font-bold uppercase tracking-wider'>{item.title}</span>
                <span className='text-white text-2xl font-black tracking-tight'>{item.value}</span>
                <span className={`${item.color} text-xs font-bold flex items-center gap-1 mt-1`}>
                  <FiArrowUpRight /> {item.change}
                </span>
              </div>
              <div className='p-3 rounded-xl bg-zinc-950 text-xl border border-zinc-800/80 text-orange-500'>
                <Icon />
              </div>
            </div>
          )
        })}
      </div>

      {/* قسم الإحصائيات المتقدمة والرسم البياني */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* هيدر الرسم البياني الأسبوعي للطلبات */}
        <div className='lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between'>
          <div>
            <h3 className='text-white font-bold text-base mb-1'>Weekly Order Volume</h3>
            <p className='text-xs text-zinc-400 font-medium mb-6'>Overview of processed deliveries across the week</p>
          </div>

          {/* محاكاة تشارت ذكي متناسق بالأعمدة التيلويند */}
          <div className='flex items-end justify-between h-64 px-4 border-b border-zinc-800 pb-2 gap-2'>
            {chartData.map((bar, index) => (
              <div key={index} className='flex flex-col items-center gap-2 w-full group cursor-pointer'>
                {/* التولتيب الذي يظهر عند الهوفر فوق العمود ليعرض عدد الطلبات */}
                <span className='opacity-0 group-hover:opacity-100 transition-opacity bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 font-mono'>
                  {bar.count}
                </span>
                <div className={`w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all duration-300 group-hover:from-orange-500 group-hover:to-orange-300 ${bar.height}`} />
                <span className='text-zinc-500 text-xs font-bold uppercase mt-1'>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* كرت المتاجر الأكثر نشاطاً طلباً للخدمة */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl'>
          <h3 className='text-white font-bold text-base mb-1 flex items-center gap-2'>
            <RiStoreLine className='text-orange-500' /> Top Requesting Stores
          </h3>
          <p className='text-xs text-zinc-400 font-medium mb-6'>Stores with the highest order creation rates</p>

          <div className='flex flex-col gap-4'>
            {[
              { name: 'متجر كاندي شوكليت', area: 'القرارة', orders: 342 },
              { name: 'سوبرماركت البركة', area: 'السطر', orders: 289 },
              { name: 'مطعم برشلونة', area: 'البلد', orders: 215 },
              { name: 'مكتبة النجاح', area: 'البلد', orders: 154 }
            ].map((store, i) => (
              <div key={i} className='flex items-center justify-between p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60'>
                <div className='text-right dir-rtl'>
                  <h4 className='text-white font-bold text-sm'>{store.name}</h4>
                  <span className='text-zinc-500 text-xs'>{store.area}</span>
                </div>
                <div className='text-left font-mono'>
                  <span className='text-orange-400 font-bold text-sm'>{store.orders}</span>
                  <span className='text-zinc-500 text-xs ml-1'>Reqs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Reports