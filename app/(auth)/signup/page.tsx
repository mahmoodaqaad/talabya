"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus, FiMap } from 'react-icons/fi'
import axios from 'axios'
import Loading from '@/Components/loading'
import { toast } from 'react-toastify'
const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true)
      if (form.password !== form.confirmPassword) return toast.error("Passwords do not match")



      const res = await axios.post("/api/auth/register", form);
      console.log(res.data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error.response);
      toast.error(error.response.data.message||"Registration failed");

    } finally {
      setLoading(false)
    }

  };


  return (
    <div className='min-h-screen bg-zinc-950 grid place-items-center p-4 selection:bg-orange-500 selection:text-white'>

      {/* كرت تسجيل الحساب الاحترافي */}
      <div className='w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden'>

        {/* تأثير إضاءة خلفي خفيف (Glow Effect) */}
        <div className='absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none' />

        {/* الهيدر */}
        <div className='flex flex-col items-center text-center gap-2'>
          <div className='flex items-center gap-2 mb-2'>
            <Image src="/logo.png" alt="Talabya Logo" width={50} height={50} className="object-contain" />
            <span className='text-orange-500 text-3xl font-black uppercase tracking-wider font-mono'>Talabya</span>
          </div>
          <h2 className='text-white text-xl font-bold tracking-tight'>Create Admin Platform</h2>
          <p className='text-zinc-400 text-xs font-semibold'>Register a new management profile into the logistics core</p>
        </div>

        {/* نموذج مدخلات تسجيل حساب جديد */}
        <form className='flex flex-col gap-4 text-right dir-rtl'
          onSubmit={handleSubmit}>

          {/* خانة الاسم الكامل */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs text-zinc-400 font-bold'>الاسم بالكامل / Full Name</label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-lg pointer-events-none'>
                <FiUser />
              </span>
              <input
                type="text"
                value={form.name}
                name='name' required
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="jhon doe"
                className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-medium'
              />
            </div>
          </div>

          {/* خانة البريد الإلكتروني */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs text-zinc-400 font-bold'>البريد الإلكتروني / Email Address</label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-lg pointer-events-none'>
                <FiMail />
              </span>
              <input
                type="email"
                value={form.email}
                required
                name='email'
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono'
              />
            </div>
          </div>

          {/* خانة رقم الجوال */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs text-zinc-400 font-bold'>رقم الهاتف المحمول / Phone</label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-lg pointer-events-none'>
                <FiPhone />
              </span>
              <input
                type="number"
                value={form.phone}
                name='string' required
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+972 59-xxxx-xxx"
                className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono tracking-wide'
                dir='ltr'
              />
            </div>
          </div>
          {/* خانة عنوان الموقع */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs text-zinc-400 font-bold'>عنوان/ Address</label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-lg pointer-events-none'>
                <FiMap />
              </span>
              <input
                type="text"
                value={form.address}
                name='address' required
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, City, Country"
                className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono tracking-wide'
                dir='ltr'
              />
            </div>
          </div>

          {/* خانة كلمة المرور وتأكيدها في شبكة من صفين متناسقين */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-right'>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs text-zinc-400 font-bold'>تأكيد كلمة المرور</label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-sm pointer-events-none'><FiLock /></span>
                <input type="password"
                  value={form.password}
                  name='password'
                  minLength={6} required
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono' />
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs text-zinc-400 font-bold'>كلمة المرور</label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-sm pointer-events-none'><FiLock /></span>
                <input type="password"
                  value={form.confirmPassword}
                  name='confirmPassword'
                  minLength={6}
                  required
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••" className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono' />
              </div>
            </div>

          </div>

          {/* زر إنشاء الحساب */}
          <button type='submit' disabled={loading || !form.name || !form.email || !form.password || !form.confirmPassword} className='w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 text-sm mt-2 active:scale-[0.99] duration-150 hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:bg-orange-500/50 disabled:shadow-none disabled:text-white/70'>
            {
              loading ?
                <Loading w={5} />
                : <>
                  <FiUserPlus className='text-lg' />
                  <span>Create Account Now</span>
                </>
            }
          </button>
        </form>

        {/* الفوتر للعودة لتسجيل الدخول */}
        <div className='text-center border-t border-zinc-800/60 pt-4 text-xs font-semibold text-zinc-500'>
          <span>Already have an account? </span>
          <Link href="/login" className='text-orange-400 hover:underline font-bold'>Sign In</Link>
        </div>

      </div>
    </div>
  )
}

export default Register