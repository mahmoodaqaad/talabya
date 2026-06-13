import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiHome, FiShoppingBag, FiUserCheck, FiUsers, FiMap, FiBarChart2, FiSettings, FiPlus, FiDollarSign, FiX } from 'react-icons/fi'

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 right-0 z-50 w-[210px] flex-shrink-0 h-screen bg-zinc-900 py-5 border-l border-zinc-800/50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 mb-6">
          <h1 className='text-orange-500 text-2xl font-extrabold uppercase'>
            <div className='flex items-center gap-2'>
              <Image src="/logo.png" alt="Logo" width={45} height={45} className="object-contain" />
              <p className="tracking-wider">طلبية</p>
            </div>
          </h1>
          <button onClick={() => setIsOpen && setIsOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
            <FiX className="text-2xl" />
          </button>
        </div>
      <div>
        <ul className='text-white text-lg font-medium p-4'>
          {[
            { href: "/dashboard", icon: FiHome, label: "الرئيسية" },
            { href: "/dashboard/orders", icon: FiShoppingBag, label: "الطلبات" },
            { href: "/dashboard/orders/add", icon: FiPlus, label: "اضافة طلب" },
            { href: "/dashboard/captain", icon: FiUserCheck, label: "الكابتن" },
            { href: "/dashboard/captain/add", icon: FiPlus, label: "اضافة كابتن" },
            { href: "/dashboard/customers", icon: FiUsers, label: "العملاء" },
            { href: "/dashboard/customers/add", icon: FiPlus, label: "اضافة عميل" },
            { href: "/dashboard/financials", icon: FiDollarSign, label: "المالية" },
            { href: "/dashboard/maps", icon: FiMap, label: "الخرائط" },
            { href: "/dashboard/reports", icon: FiBarChart2, label: "التقارير" },
            { href: "/dashboard/settings", icon: FiSettings, label: "الاعدادات" },
          ].map((link, idx) => (
            <Link key={idx} href={link.href} onClick={() => setIsOpen && setIsOpen(false)} className='flex items-center mb-4 cursor-pointer hover:text-orange-400 transition-colors'>
              <link.icon className='me-3 text-xl' />
              <p>{link.label}</p>
            </Link>
          ))}
        </ul>
      </div>
    </div>
    </>
  )
}

export default Sidebar
