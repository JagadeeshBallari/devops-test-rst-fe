import Image from 'next/image'
import React from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Page: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  
  if (!isOpen) return null;
  
  return (
   
      <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg w-[40%]'>
            
            <div onClick={onClose} className='flex justify-end cursor-pointer' ><Image src='/cancel.svg' alt='Logo' width={20} height={20} /> </div>
            
            
            <div className='mb-4'>
                <div className='flex justify-start p-1 ml-[5%]'>
                  <div  className='text-[16px] font-semibold mb-4 cursor-pointer'>REPORT ISSUE</div>
                </div>

                <div className='bg-[#A80023] w-[30%] mx-[5%] h-[2px]'></div>
                
                <div className='bg-[#D9D9D9] w-[95%] mx-auto  h-[2px]'></div>

            </div>
           
                <div>
                    <div className='flex flex-col justify-around mb-6'>
                        <div className='flex flex-row justify-between'>
                            <div className='mb-6 w-[45%]'>
                                <label className=' block text-[14px] font-semibold mb-2 text-black'>ISSUE <span className='text-red-500'>*</span></label>
                                <select className='bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs'>
                                  <option value='' disabled selected>Select Issue</option>
                                  <option value='Add Missing Property'>Add Missing Property</option>
                                  <option value='Remove Incorrect Property'>Remove Incorrect Property</option>
                                  <option value='Revise Property Status'>Revise Property Status</option>
                                  <option value='Other Issues'>Other Issues</option>
                                </select>
                            </div>

                            <div className='mb-6 w-[45%]'>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>MARSHA CODE <span className='text-red-500'>*</span></label>
                                <input type='text'  className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Enter MARSHA code' />
                            </div>
 
                        </div>

                        <div>
                          <div>
                              <label className='block text-[14px] font-semibold mb-2 text-black'>DESCRIPTION <span className='text-red-500'>*</span></label>
                              <textarea className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs h-20' placeholder='Enter issue description'/>
                          </div>
                        </div>

                        
                    </div>

                    <div className='flex justify-center'>
                        <button className='bg-[#A80023] hover:bg-[#780019] text-white text-[14px] font-semibold px-4 py-1.5 rounded mx-3 mt-4 '>SUBMIT</button>
                    </div>
                </div>

        </div>
      </div>
    
  )
}

export default Page