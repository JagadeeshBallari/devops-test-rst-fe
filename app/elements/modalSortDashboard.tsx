'use client'
import Image from 'next/image'
import React, { useState } from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Page: React.FC<ModalProps> = ({ isOpen, onClose }) => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedOption(event.target.value);
    };
  
  if (!isOpen) return null;
  
  return (
   
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded-lg w-[40%]'>
            
            <div onClick={onClose} className='flex justify-end cursor-pointer' ><Image src='/cancel.svg' alt='Logo' width={20} height={20} /> </div>
            
            <div>
                <div className='text-[18px]  font-[500]'>Sort & Filter</div>
                <div className='text-[12px] text-[#00000070] font-[400]'>Sort property list by Community, by Property Name or by MARSHA code</div>
            </div>

            <div className='mt-6'>
                <div className='text-[16px] font-[500] mb-3'>Sort (A-Z)</div>
                <div className='grid gap-4 grid-cols-2 grid-rows-2 '>
                    <div>
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input
                            type="radio"
                            value="By Community"
                            checked={selectedOption === 'By Community'}
                            onChange={handleChange}
                            className="hidden peer"
                            />
                            <span className='w-4 h-4 bg-[#E8E8E8] rounded-full flex items-center justify-center mr-2 peer-checked:bg-[#A80023]'>
                                <span className='hidden w-2 h-2 bg-white rounded-full peer-checked:block'></span>
                            </span>
                            By Community
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input
                            type="radio"
                            value="By Property Name"
                            checked={selectedOption === 'By Property Name'}
                            onChange={handleChange}
                            className="hidden peer"
                            />
                            <span className='w-4 h-4 bg-[#E8E8E8] rounded-full flex items-center justify-center mr-2 peer-checked:bg-[#A80023]'>
                                <span className='hidden w-2 h-2 bg-white rounded-full peer-checked:block'></span>
                            </span>
                            By Property Name
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input
                            type="radio"
                            value="By MARSHA Code"
                            checked={selectedOption === 'By MARSHA Code'}
                            onChange={handleChange}
                            className="hidden peer"
                            />
                            <span className='w-4 h-4 bg-[#E8E8E8] rounded-full flex items-center justify-center mr-2 peer-checked:bg-[#A80023]'>
                                <span className='hidden w-2 h-2 bg-white rounded-full peer-checked:block'></span>
                            </span>
                            By MARSHA Code
                        </label>
                    </div>
                </div>
            </div>

            <div className='mt-6'>
                <div className='text-[16px] font-[500] mb-3'>Filter by Room Setup Status</div>
                <div className='grid gap-4 grid-cols-2 grid-rows-3 '>
                    <div >
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input type="checkbox" className="hidden peer" />
                            <span className="w-5 h-5 bg-[#F7F7F7] border-2 border-transparent rounded mr-2 flex items-center justify-center peer-checked:bg-[#A80023]">
                                <span className="hidden w-1.5 h-3 border-white border-l-2 border-b-2 transform rotate-45 "></span>
                            </span>
                            READY FOR SETUP
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input type="checkbox" className="hidden peer" />
                            <span className="w-5 h-5 bg-[#F7F7F7] border-2 border-transparent rounded mr-2 flex items-center justify-center peer-checked:bg-[#A80023]">
                                <span className="hidden w-1.5 h-3 border-white border-l-2 border-b-2 transform rotate-45 "></span>
                            </span>
                            IN PROGRESS
                        </label>
                    </div>

                    <div >
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input type="checkbox" className="hidden peer" />
                            <span className="w-5 h-5 bg-[#F7F7F7] border-2 border-transparent rounded mr-2 flex items-center justify-center peer-checked:bg-[#A80023]">
                                <span className="hidden w-1.5 h-3 border-white border-l-2 border-b-2 transform rotate-45 "></span>
                            </span>
                            WAITING FOR APPROVAL
                        </label>
                    </div>

                    <div >
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input type="checkbox" className="hidden peer" />
                            <span className="w-5 h-5 bg-[#F7F7F7] border-2 border-transparent rounded mr-2 flex items-center justify-center peer-checked:bg-[#A80023]">
                                <span className="hidden w-1.5 h-3 border-white border-l-2 border-b-2 transform rotate-45 "></span>
                            </span>
                            REVISE
                        </label>
                    </div>

                    <div >
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input type="checkbox" className="hidden peer" />
                            <span className="w-5 h-5 bg-[#F7F7F7] border-2 border-transparent rounded mr-2 flex items-center justify-center peer-checked:bg-[#A80023]">
                                <span className="hidden w-1.5 h-3 border-white border-l-2 border-b-2 transform rotate-45 "></span>
                            </span>
                            COMPLETE
                        </label>
                    </div>

                    <div >
                        <label className="flex items-center cursor-pointer text-[14px] font-[400]">
                            <input type="checkbox" className="hidden peer" />
                            <span className="w-5 h-5 bg-[#F7F7F7] border-2 border-transparent rounded mr-2 flex items-center justify-center peer-checked:bg-[#A80023]">
                                <span className="hidden w-1.5 h-3 border-white border-l-2 border-b-2 transform rotate-45 "></span>
                            </span>
                            FUTURE COMMUNITY
                        </label>
                    </div>
                </div>
            </div>

            <div className='flex justify-evenly mt-12'>
                <div className='text-[16px] border border-[#A80023] text-[#A80023] px-4 py-1 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                <div className='text-[16px] text-white bg-[#A80023] px-4 py-1 rounded cursor-pointer'>Save</div>
            </div>

        </div>
    </div>
    
  )
}

export default Page