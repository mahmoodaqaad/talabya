
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import axios from 'axios'
import Loading from '@/Components/loading'

const Login = () => {
    const [form, setForm] = useState({
        email: '', password: ''
    })
    const [loading, setLoading] = useState(false)
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axios.post("/api/auth/login", form);
            console.log(res.data);

        } catch (error) {
            console.log(error);

        }
        finally {
            setLoading(false) 
            
        }
    };

    return (
        <div className='min-h-screen bg-zinc-950 grid place-items-center p-4 selection:bg-orange-500 selection:text-white'>

            {/* كرت تسجيل الدخول الاحترافي */}
            <div className='w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden'>

                {/* تأثير إضاءة خلفي خفيف (Glow Effect) */}
                <div className='absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none' />

                {/* الهيدر: اللوجو والبراند */}
                <div className='flex flex-col items-center text-center gap-2'>
                    <div className='flex items-center gap-2 mb-2'>
                        <Image src="/logo.png" alt="Talabya Logo" width={50} height={50} className="object-contain" />
                        <span className='text-orange-500 text-3xl font-black uppercase tracking-wider font-mono'>Talabya</span>
                    </div>
                    <h2 className='text-white text-xl font-bold tracking-tight'>Welcome Back Admin!</h2>
                    <p className='text-zinc-400 text-xs font-semibold'>Enter your credentials to access the central gateway</p>
                </div>

                {/* نموذج مدخلات تسجيل الدخول */}
                <form className='flex flex-col gap-4 text-right dir-rtl' onSubmit={handleSubmit}>

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
                                name='email'
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="name@example.com"
                                className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono'
                            />
                        </div>
                    </div>


                    <div className='flex flex-col gap-1.5'>
                        <div className='flex justify-between items-center mb-0.5'>
                            <Link href="#" className='text-[11px] text-orange-400 hover:underline font-bold font-mono tracking-tight' dir='ltr'>Forgot Password?</Link>
                            <label className='text-xs text-zinc-400 font-bold'>كلمة المرور / Password</label>
                        </div>
                        <div className='relative'>
                            <span className='absolute inset-y-0 left-4 flex items-center text-zinc-500 text-lg pointer-events-none'>
                                <FiLock />
                            </span>
                            <input
                                type="password"
                                value={form.password}
                                name='password'
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className='w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono tracking-wide'
                            />
                        </div>
                    </div>

                    {/* خيار تذكرني */}
                    <div className='flex items-center justify-end gap-2 mt-1 cursor-pointer select-none'>
                        <span className='text-xs text-zinc-400 font-semibold'>تذكر تسجيل دخولي في هذا المتصفح</span>
                        <input type="checkbox" className='w-4 h-4 accent-orange-500 rounded border-zinc-800 cursor-pointer bg-zinc-950' />
                    </div>

                    {/* زر تسجيل الدخول الرئيسي بفخامة نيون برتقالي */}
                    <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 text-sm mt-2 active:scale-[0.99] duration-150  hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:bg-orange-500/50 disabled:shadow-none disabled:text-white/70'>
                        {

                            loading ?
                                <Loading w={5} />
                                : <>
                                    <FiLogIn className='text-lg' />
                                    <span>Sign In to System</span>
                                </>
                        }
                    </button>

                 
                </form>

                {/* الفوتر للتحويل لصفحة التسجيل */}
                <div className='text-center border-t border-zinc-800/60 pt-4 text-xs font-semibold text-zinc-500'>
                    <span>Don{"'"}t have an admin account? </span>
                    <Link href="/signup" className='text-orange-400 hover:underline font-bold'>Create Account</Link>
                </div>

            </div>
        </div>
    )
}

export default Login