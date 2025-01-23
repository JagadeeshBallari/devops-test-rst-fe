'use client'
import React, { useState } from 'react'
import HeaderLogin from '../headerLogin/page'
import { useRouter } from 'next/navigation';
import  Link  from 'next/link';
import { useHotel } from '@/app/context/HotelContext';
import Image from 'next/image';

const ForgotPassword = () => {
    
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const {isLoggedIn} = useHotel();

    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(event.target.value)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(event.target.value)) {
            setErrorPassword('Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        } else {
            setErrorPassword('');
        }
    }

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        if (event.target.value !== password) {
            setErrorConfirmPassword('Passwords do not match');
        } else {
            setErrorConfirmPassword('');
        }
    };
    
    const isValid = email && password && confirmPassword && errorEmail === '' && errorPassword === '' && errorConfirmPassword === '';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isValid) {
            router.push('/');
        }
    };

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
            <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto mt-10 ">
                <div className="w-[35%] bg-white rounded-md shadow-md shadow-[#A80023]">   
                    <div className="p-12 space-y-4">
                        <div className='flex flex-col items-center mb-8 mt-2'>
                            <Image src="/lock.svg" alt="Logo" width={32} height={32} className='mb-2'/>
                            <h1 className="text-[18px] font-[500]  ">
                                Change Password
                            </h1>
                        </div>
                        <form className="space-y-6" action="submit">
                            <div>
                                <label htmlFor="password" className="block mb-2 text-[14px] font-[500] ">New Password <span className="text-[#A80023]">*</span></label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5 " onChange={handlePasswordChange} value={password} required/>
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorPassword}</div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-[14px] font-[500]">Confirm password <span className="text-[#A80023]">*</span></label>
                                <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5" onChange={handleConfirmPasswordChange} value={confirmPassword} required/>
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorConfirmPassword}</div>
                            </div>
                            
                            
                            <button type="submit" className="w-full text-white disabled:bg-[#D1CFCF] bg-[#A80023] hover:bg-[#780019] font-[700] rounded-[2px] text-[16px] py-1.5 text-center" onClick={handleSubmit}  disabled={!isValid}>Save Passwod</button>
                        
                            
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

export default ForgotPassword