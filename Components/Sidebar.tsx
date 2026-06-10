import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiHome, FiShoppingBag, FiUserCheck, FiUsers, FiMap, FiBarChart2, FiSettings, FiPlus } from 'react-icons/fi'



const Sidebar = () => {
  return (
    <div className='w-[210px] flex-shrink-0 h-screen bg-zinc-900 py-5 border-r border-zinc-800/50'>
      <h1 className='text-orange-500 text-2xl font-extrabold uppercase px-4 mb-6'>
        <div className='flex items-center gap-2'>
          <Image src="/logo.png" alt="Logo" width={45} height={45} className="object-contain" />
          <p className="tracking-wider">طلبية</p>
        </div>
      </h1>
      <div>
        <ul className='text-white text-lg font-medium p-4'>
          <Link href="/dashboard" className='flex items-center mb-4 cursor-pointer hover:text-orange-500'>
            <FiHome className='me-3 text-xl' />
            <p>الرئيسية</p>
          </Link>
          <Link href="/dashboard/orders" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiShoppingBag className='me-3 text-xl' />
            <p>الطلبات</p>
          </Link>
          <Link href="/dashboard/orders/add" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiPlus className='me-3 text-xl' />
            <p>اضافة طلب</p>
          </Link>
          <Link href="/dashboard/captain" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiUserCheck className='me-3 text-xl' />
            <p>الكابتن</p>
          </Link>
          <Link href="/dashboard/captain/add" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiPlus className='me-3 text-xl' />
            <p>اضافة كابتن</p>
          </Link>
          <Link href="/dashboard/customers" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiUsers className='me-3 text-xl' />
            <p>العملاء</p>
          </Link>
          <Link href="/dashboard/customers/add" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiPlus className='me-3 text-xl' />
            <p>اضافة عميل</p>
          </Link>
          <Link href="/dashboard/maps" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiMap className='me-3 text-xl' />
            <p>الخرائط</p>
          </Link>
          <Link href="/dashboard/reports" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiBarChart2 className='me-3 text-xl' />
            <p>التقارير</p>
          </Link>
          <Link href="/dashboard/settings" className='flex items-center mb-4 cursor-pointer hover:text-orange-400'>
            <FiSettings className='me-3 text-xl' />
            <p>الاعدادات</p>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
