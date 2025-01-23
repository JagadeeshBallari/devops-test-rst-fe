import React from 'react'
import Header from '../header/page'
import Link from 'next/link'

const Profile = () => {
  return (
    <>
        <header>
            <Header/>
        </header>

        <section >
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-10  lg:py-0">
            <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
                <div className="p-4 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl ">
                        My Profile
                    </h1>
                
                    <div className='flex justify-around'>

                        <div className='flex flex-col font-bold text-[#A80023]'>
                            <div className='mb-2'>First Name :</div>
                            <div className='mb-2'>Last Name :</div>
                            <div className='mb-2'>Title :</div>
                            <div className='mb-2'>Email Address:</div>    
                        </div>

                        <div className='flex flex-col mb-6 '>
                            <div className='mb-2'>Toby</div>
                            <div className='mb-2'>Toby</div>
                            <div className='mb-2'>Manager</div>
                            <div className='mb-2'>Toby@company.com</div>    
                        </div>

                    </div>
                    
                    <Link href={'/components/dashboard'}>
                        <button type="submit" className="w-full mt-3 text-white bg-[#A80023] hover:bg-[#780019] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Return to Dashboard</button>
                    </Link>

                </div>
            </div>
            </div>
        </section>
    </>
  )
}

export default Profile