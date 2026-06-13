import React from 'react'
import { FiBell, FiUser } from 'react-icons/fi'
import { RiSideBarLine, RiSideBarFill } from 'react-icons/ri'

const NavBar = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
    return (
        <div className='p-1'>
            <div className='bg-zinc-900 text-orange-200 text-2xl font-extrabold uppercase px-1 w-full p-4 rounded-xl'>
                <div className='flex justify-between items-center'>

                    <p 
                        onClick={toggleSidebar}
                        className='p-2 text-3xl cursor-pointer w-fit transition-all hover:text-orange-400 lg:hidden'
                    >
                        <RiSideBarFill />
                    </p>
                    {/* <RiSideBarLine /> */}

                    <div>
                        {/* <div className='flex items-center gap-6 pe-3'>

                            <FiUser className='text-3xl cursor-pointer hover:text-orange-400 transition-all' />
                            <div className='relative'>

                                <FiBell className='text-3xl cursor-pointer hover:text-orange-400 transition-all' />
                            
                            <span className='absolute -top-2 -right-1 bg-red-500 text-white text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center'>5</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar
