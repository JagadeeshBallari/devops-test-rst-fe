'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import HeaderLogin from './components/headerLogin/page';
import Link from 'next/link';
import { HotelProvider, useHotel } from '@/app/context/HotelContext';

  

const Home: React.FC = () => {
  const [email1, setEmail1] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
      const registered = new URLSearchParams(window.location.search).get('registered') === 'true';
      setShowSuccessMessage(registered);

      if (registered) {
        router.replace('/');
      }
    }, []);


  const {setFirstName, setLastName, setEmail, setIsLoggedIn, setRole} = useHotel();

 
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail1(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email1, password: password, firstName: '', lastName: '' }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Authentication successful:', data);

        setEmail(data.data.userName);
        setFirstName(data.data.firstName);
        setLastName(data.data.lastName);  
        setIsLoggedIn(true);
        setRole(data.data.role);
        
        router.push(`/components/dashboard`);
        // Handle successful authentication (e.g., store token in localStorage)
      } else {
        setError('Invalid email or password');
        console.error('Authentication failed');
        // Handle authentication failure
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      // Handle error during authentication
    }
  };

  var isValid = email1 !== '' && password !== '';

  const backgroundStyle = {
    backgroundImage: 'url(/signBg.svg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <main style={backgroundStyle}>
      <header>
        <HeaderLogin/>
      </header>
      <div>
        <section>
          <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto mt-10 ">
            <div className="w-[35%] bg-white rounded-md shadow-md shadow-[#A80023]">
              <div className="p-12 space-y-4">
                <div className='flex flex-col items-center mb-8 mt-2'>
                  <Image src="/signIn.svg" alt="Logo" width={32} height={32} className='mb-2'/>
                  <h1 className="text-[18px] font-[500]  ">
                    Sign in to Your Account
                  </h1>
                </div>
                {showSuccessMessage && (
                    <div className="text-[14px] font-[500] text-[#2CC11F]">
                      <Image src="/checked.svg" alt="Success" width={16} height={16} className='inline-block mr-2' /> Account created successfully.
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block mb-2 text-[14px] font-[500]">Company Email Address <span className="text-[#A80023]">*</span></label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5"
                      placeholder="Username@marriott.com"
                      value={email1}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[14px] font-[500]">Password <span className="text-[#A80023]">*</span></label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-[#F7F7F7]  placeholder:text-[#00000070] text-[12px] block w-full p-1.5"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid}
                    className="w-full text-white disabled:bg-[#D1CFCF] bg-[#A80023] hover:bg-[#780019] font-[700] rounded-[2px] text-[16px] py-1.5 text-center"
                    onClick={handleSubmit}
                  >
                    Sign In
                  </button>
                  <div className='text-[#A80023] text-[14px]'>{error}</div>

                  <div className='flex justify-between'>
                    <Link href={'/components/signUp'}>
                    <div className='hover:underline text-[#4D61FC] text-[12px]'>Create an Account</div>
                    </Link>
                    <Link href={'/components/forgotPasswordEmail'}>
                    <div className='text-[#A80023] hover:underline text-[12px]'>Forgot Password?</div>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
