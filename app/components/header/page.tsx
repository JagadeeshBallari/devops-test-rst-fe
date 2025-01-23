import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const Header = () => {
  return (
    <div className="flex justify-between bg-slate-200 shadow-xl p-3">
    <div className="flex flex-row">
      <div className="pr-4"><Image src='/logo.png' alt='Logo' width={100} height={25}/></div>
      <div className='font-medium mt-2'>ROOM SETUP TOOL</div>
    </div>
    
    <div className='flex'>
      

      
      <Link href={'/components/dashboard'}>
      <div className='mt-0.5'><Image src='/home.png' alt='Logo' width={25} height={25} className='hover:cursor-pointer hover:opacity-70'/></div>
      </Link>

      <Link href={'/components/notification'}>
      <div className='ml-4 mt-1'><Image src='/Notification.svg' alt='Logo' width={18} height={21} className='hover:cursor-pointer hover:opacity-70'/></div>
      </Link>

      <div className='ml-4 mt-[3px]'><Image src='/Help.svg' alt='Logo' width={25} height={25} className='hover:cursor-pointer hover:opacity-70'/></div>
    
      <div className="dropdown dropdown-bottom dropdown-end mt-1 mr-2">
        <div tabIndex={0} role="button" className='ml-4'><Image src='/profile.png' alt='Logo' width={22} height={22} className='hover:cursor-pointer hover:opacity-70'/></div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 ">
            <Link href={'/components/profile'}>
            <li className='hover:opacity-70 ml-2 mb-2 hover:text-[#A80023]'>My Profile</li>
            </Link>
            <Link href={'/components/dashboard'}>
            <li className='hover:opacity-70 ml-2 mb-2 hover:text-[#A80023]'>My Properties</li>
            </Link>
            <Link href={'/components/forgotPassword'}>
            <li className='hover:opacity-70 ml-2 mb-2 hover:text-[#A80023]'>Reset Password</li>
            </Link>
            <Link href={'/'}>
            <li className='hover:opacity-70 ml-2 mb-2 hover:text-[#A80023]'>Sign Out</li>
            </Link>
          </ul>
      </div>
      
      </div>

    </div>
  )
}

export default Header
