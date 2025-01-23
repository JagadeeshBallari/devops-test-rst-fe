'use client'
import React, { useState } from 'react'
import HeaderLogin from '../headerLogin/page'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


const SignUp = () => {

    const router = useRouter()
  
    const [firstName,setFirstName] = useState<string>()
    const [lastName,setlastName] = useState<string>()
    const [role,setRole] = useState<string>()
    const [email,setEmail] = useState<string>()
    const [password,setPassword] = useState<string>()
    const [confirmPassword,setConfirmPassword] = useState<string>()

    const [errorFirstName,setErrorFirstName] = useState<string>()
    const [errorLastName,setErrorLastName] = useState<string>()
    const [errorRole,setErrorRole] = useState<string>()
    const [errorEmail,setErrorEmail] = useState<string>()
    const [errorPassword,setErrorPassword] = useState<string>()
    const [errorConfirmPassword,setErrorConfirmPassword] = useState<string>()

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(event.target.value)) {
            setErrorFirstName('Name should only contain alphabets and spaces');
        } else {
            setErrorFirstName('');
        }
    }

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setlastName(event.target.value);
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(event.target.value)) {
            setErrorLastName('Name should only contain alphabets and spaces');
        } else {
            setErrorLastName('');
        }
    }

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
        if(role===""){
            setErrorRole('Role is required');
        }else{
            setErrorRole('');
        }
        
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(event.target.value)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    }

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
    }

    
        const isValid =  errorFirstName === '' && errorLastName === '' && errorRole === ''  && errorEmail === '' && errorPassword === '' && errorConfirmPassword === '' && firstName && lastName && role  && email && password && confirmPassword
    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName: firstName, lastName: lastName, role: role, email: email, password: password }),
            });
            console.log(JSON.stringify({ firstName, lastName, role, email, password }))
            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                
                router.push('/?registered=true')
                // Handle successful registration (e.g., redirect to login page)
            } else {
                
                console.error('Registration failed');
                // Handle registration failure
            }
        } catch (error) {
            
            console.error('Error during registration:', error);
            // Handle error during registration
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
        <main style={backgroundStyle}>
        <header>
            <HeaderLogin/>
        </header>

        <section>
            <div className="flex flex-col items-center justify-center p-5 ">
                <div className="w-[40%] bg-white rounded-md shadow-md shadow-[#A80023]">
                    <div className="px-12 py-6 space-y-2">
                        <div className='flex flex-col items-center mb-5'>
                            <Image src="/addUser.svg" alt="Logo" width={32} height={32} className='mb-2'/>
                            <h1 className="text-[18px] font-[500]  ">
                                Create an Account
                            </h1>
                        </div>
                        <form className="space-y-3 mx-5">
                        <div className='flex w-full'>
                            <div className='w-1/2 mr-4'>
                                <label htmlFor="firstName" className="block mb-2 text-[14px] font-[500]">First Name <span className="text-[#A80023]">*</span></label>
                                <input type="text" name="firstName" id="firstName" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5" placeholder="First Name" onChange={handleFirstNameChange} value={firstName} required />
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorFirstName}</div>
                            </div>
                            <div className='w-1/2'>
                                <label htmlFor="lastName" className="block mb-2 text-[14px] font-[500]">Last Name <span className="text-[#A80023]">*</span></label>
                                <input type="text" name="lastName" id="lastName" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5" placeholder="Last Name" onChange={handleLastNameChange} value={lastName} required />
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorLastName}</div>
                            </div>
                            </div>
                            <div>
                                <label htmlFor="title" className="block mb-2 text-[14px] font-[500]">Title <span className="text-[#A80023]">*</span></label>
                                <select name="title" id="title" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5"  onChange={handleRoleChange}  value={role} required>
                                    <option className='text-[#00000070] text-[12px]' value="" disabled selected>Select Title</option>
                                    <option value="REVENUE_MANGER">Revenue Manager</option>
                                    <option value="ADMIN">Room Setup Manager</option>
                                </select>
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorRole}</div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-[14px] font-[500]">Company Email Address <span className="text-[#A80023]">*</span></label>
                                <input type="email" name="email" id="email" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5" placeholder="Username@marriott.com" onChange={handleEmailChange} value={email} required />
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorEmail}</div>
                            </div>

                            <div className='flex w-full'>
                            <div className='w-1/2 mr-4'>
                                <label htmlFor="password" className="block mb-2 text-[14px] font-[500]">Password <span className="text-[#A80023]">*</span></label>
                                <input type="password" name="password" id="password" placeholder="••••••" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5" onChange={handlePasswordChange} value={password} required />
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorPassword}</div>
                            </div>
                            <div className='w-1/2'>
                                <label htmlFor="confirm-password" className="block mb-2 text-[14px] font-[500]">Confirm Password <span className="text-[#A80023]">*</span></label>
                                <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••" className="bg-[#F7F7F7]  placeholder:text-[#00000070]  text-[12px] block w-full p-1.5" onChange={handleConfirmPasswordChange} value={confirmPassword} required />
                                <div className='text-[#A80023] text-[12px] mt-0.5'>{errorConfirmPassword}</div>
                            </div>
                            </div>

                            <button type="submit" className="w-full text-white disabled:bg-[#D1CFCF] bg-[#A80023] hover:bg-[#780019] font-[700] rounded-[2px] text-[16px] py-1.5 text-center" onClick={handleSubmit} disabled={!isValid} >Create Account</button>
                            <div className="text-[12px] font-[500] flex">
                                <div className='text-[#00000070]'>Already have an account?&nbsp;</div><Link href={'/'}> <div className="hover:underline text-[#4D61FC] text-[12px]">Sign in</div></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </main>
    </>

  )
}

export default SignUp