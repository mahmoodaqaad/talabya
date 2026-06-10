import React from 'react'
import { FiSettings, FiSliders, FiShield, FiBell, FiSave, FiMapPin, FiTruck } from 'react-icons/fi'

const Settings = () => {
  return (
    <div className='p-6 min-h-screen text-black'>
      {/* هيدر الصفحة */}
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-black text-black uppercase tracking-wide flex items-center gap-2'>
            <FiSettings className='text-orange-500' /> System Settings
          </h1>
          <p className='text-sm text-black/70 mt-1 font-semibold'>Configure application rules, zones tariffs, and administrator controls</p>
        </div>

        {/* زر الحفظ العائم المميز */}
        <button className='bg-black hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2 text-sm'>
          <FiSave className='text-lg' />
          <span>Save Configuration</span>
        </button>
      </div>

      {/* شبكة مدخلات الإعدادات */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        {/* 1. كرت إعدادات النظام العامة والبراندينج */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4'>
          <h3 className='text-white font-bold text-base border-b border-zinc-800 pb-3 flex items-center gap-2'>
            <FiSliders className='text-orange-500' /> Platform Identity
          </h3>

          <div className='flex flex-col gap-1 text-right dir-rtl'>
            <label className='text-xs text-zinc-400 font-bold mb-1'>اسم المنصة الإدارية</label>
            <input type="text" defaultValue="طلبية لتوصيل الطلبات" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors' />
          </div>

          <div className='grid grid-cols-2 gap-4 text-right dir-rtl'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-zinc-400 font-bold mb-1'>لغة النظام الافتراضية</label>
              <select className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer'>
                <option>English (US)</option>
                <option>العربية (Arabic)</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-zinc-400 font-bold mb-1'>نطاق العمل الأساسي</label>
              <input type="text" defaultValue="قطاع غزة" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors' />
            </div>
          </div>
        </div>

        {/* 2. كرت تسعيرة التوصيل والقواعد التشغيلية المخصصة لـ طلبية */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4'>
          <h3 className='text-white font-bold text-base border-b border-zinc-800 pb-3 flex items-center gap-2'>
            <FiTruck className='text-orange-500' /> Delivery & Tariffs (التسعير والتشغيل)
          </h3>

          <div className='grid grid-cols-2 gap-4 text-right dir-rtl'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-zinc-400 font-bold mb-1'>سعر التوصيل الداخلي (₪)</label>
              <input type="number" defaultValue="5" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono' />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-zinc-400 font-bold mb-1'>سعر التوصيل الخارجي/بين المدن (₪)</label>
              <input type="number" defaultValue="10" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono' />
            </div>
          </div>

          <div className='flex flex-col gap-1 text-right dir-rtl'>
            <label className='text-xs text-zinc-400 font-bold mb-1'>وسيلة النقل الافتراضية المعتمدة</label>
            <select className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer'>
              <option>دراجة كهربائية (Electric Bicycle)</option>
              <option>دراجة نارية (Motorcycle)</option>
              <option>سيارة نقل خفيف (Car)</option>
            </select>
          </div>
        </div>

        {/* 3. كرت الأمان والوصول للحساب الإداري */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4'>
          <h3 className='text-white font-bold text-base border-b border-zinc-800 pb-3 flex items-center gap-2'>
            <FiShield className='text-orange-500' /> Security & Admin Credentials
          </h3>

          <div className='flex flex-col gap-1 text-right dir-rtl'>
            <label className='text-xs text-zinc-400 font-bold mb-1'>البريد الإلكتروني للآدمن</label>
            <input type="email" defaultValue="admin@talabya.com" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400 focus:outline-none cursor-not-allowed font-mono' disabled />
          </div>

          <div className='grid grid-cols-2 gap-4 text-right dir-rtl'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-zinc-400 font-bold mb-1'>كلمة المرور الجديدة</label>
              <input type="password" placeholder="••••••••" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors' />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-zinc-400 font-bold mb-1'>تأكيد كلمة المرور</label>
              <input type="password" placeholder="••••••••" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors' />
            </div>
          </div>
        </div>

        {/* 4. كرت الإشعارات والتحكم في التنبيهات الحية */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between'>
          <div>
            <h3 className='text-white font-bold text-base border-b border-zinc-800 pb-3 flex items-center gap-2'>
              <FiBell className='text-orange-500' /> Notification Preferences
            </h3>

            <div className='mt-4 flex flex-col gap-4'>
              <div className='flex items-center justify-between p-2 bg-zinc-950/30 rounded-xl border border-zinc-800/40'>
                <span className='text-zinc-400 text-xs font-semibold'>صوت تنبيه عند دخول طلبية جديدة من المتاجر</span>
                <input type="checkbox" defaultChecked className='w-4 h-4 accent-orange-500 cursor-pointer' />
              </div>
              <div className='flex items-center justify-between p-2 bg-zinc-950/30 rounded-xl border border-zinc-800/40'>
                <span className='text-zinc-400 text-xs font-semibold'>إرسال إشعار فوري عند إلغاء أي كابتن للمهمة</span>
                <input type="checkbox" defaultChecked className='w-4 h-4 accent-orange-500 cursor-pointer' />
              </div>
              <div className='flex items-center justify-between p-2 bg-zinc-950/30 rounded-xl border border-zinc-800/40'>
                <span className='text-zinc-400 text-xs font-semibold'>تحديث تلقائي لحالة كابتن الدراجة الذكية على الخريطة</span>
                <input type="checkbox" className='w-4 h-4 accent-orange-500 cursor-pointer' />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Settings