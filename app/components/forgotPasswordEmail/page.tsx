'use client'
import React, { useState } from 'react'
import HeaderLogin from '../headerLogin/page'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ForgotPasswordEmail = () => {
    
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(event.target.value)) {
            setError('Invalid email address');
        } else {
            setError('');
        }
    };

    const isValid = email && error === '';

    const handleSubmit =  (event: React.FormEvent) => {
        event.preventDefault();
        if (isValid) {
            router.push('/');
        }

    }

    const backgroundStyle = {
        backgroundImage: 'url(/signBg.svg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      };

    return (
    <>
        <div style={backgroundStyle}>
        <header>
            <HeaderLogin/>
        </header>

        <section >
            <div className="flex flex-col items-center justify-center px-6 py-4  mt-10">
                
                <div className="w-[35%] bg-white rounded-md shadow-md shadow-[#A80023]">
                    <div className="p-12 space-y-4">
                        <div className='flex flex-col items-center mb-8 mt-2'>
                            <Image src="/lock.svg" alt="Logo" width={32} height={32} className='mb-2'/>
                            <h1 className="text-[18px] font-[500]  ">
                                Reset Password
                            </h1>
                        </div>
                        <div className='text-[12px] font-[400] '>An email will be sent to your company email address with a link to reset your password.</div>
                        
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-[14px] font-[500]">Company Email Address <span className="text-[#A80023]">*</span></label>
                                <input type="email" name="email" id="email" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-2.5" placeholder="Username@marriott.com" onChange={handleEmailChange} value={email} required />
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{error}</div>
                            </div>
                            
                            
                            <button type="submit" disabled={!isValid} onClick={handleSubmit} className="w-full text-white disabled:bg-[#D1CFCF] bg-[#A80023] hover:bg-[#780019] font-[700] rounded-[2px] text-[16px] py-1.5 text-center ">Reset Passwod</button>
                            
                            <Link href={'/'}>
                            <button type="submit" className="hover:underline text-[#4D61FC] text-[12px] mt-4">Back to Sign In</button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </div>
    </>
  )
}

export default ForgotPasswordEmail