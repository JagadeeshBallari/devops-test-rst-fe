// components/Modal.tsx
import Image from 'next/image';
import React from 'react';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCompositeType: (compositeType: string, roomPool: string, shoppableAttributes: string, roomNumbers: string) => void;
  onSubmitCompositeRoom: (compositeType1: string, roomPool1: string, virtualRoom1: string, roomNumber1: string) => void;
}

const ModalCompositeRoom: React.FC<ModalProps> = ({ isOpen, onClose, onSubmitCompositeType, onSubmitCompositeRoom }) => {

    const [typeCheck, setTypeCheck] = useState(true);
    const [compositeType, setCompositeType] = useState<string>('');
    const [roomPool, setRoomPool] = useState<string>('');
    const [shoppableAttributes, setShoppableAttributes] = useState<string>('');
    const [roomNumber, setRoomNumber] = useState<string>('');
    const [compositeType1, setCompositeType1] = useState<string>('');
    const [roomPool1, setRoomPool1] = useState<string>('');
    const [virtualRoom1, setVirtualRoom1] = useState<string>('');
    const [roomNumber1, setRoomNumber1] = useState<string>('');



    const handleSubmitCompositeType = () => {
        if (compositeType && roomPool && shoppableAttributes && roomNumber) {
        onSubmitCompositeType( compositeType, roomPool, shoppableAttributes, roomNumber );
        
        } else {
        alert('Please fill in all fields.');
        }
    };

    const handleSubmitCompositeRoom = () => {
        if (compositeType1 && roomPool1 && virtualRoom1 && roomNumber1) {
        onSubmitCompositeRoom( compositeType1, roomPool1, virtualRoom1, roomNumber1 );
        } else {
        alert('Please fill in all fields.');
        }
    };

    if (!isOpen) return null;

    return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
        <div className='bg-white p-6 rounded-lg w-[60%]'>
            <div className='flex justify-end cursor-pointer' onClick={onClose}><Image src='/cancel.svg' alt='Logo' width={20} height={20} /> </div>
            
            <div className='mb-4'>
                <div className='flex  justify-evenly p-1'>
                    <div onClick={() => setTypeCheck(!typeCheck)} className='text-[16px] font-semibold mb-4 cursor-pointer'>ADD COMPOSITE TYPE</div>
                    <div onClick={() => setTypeCheck(!typeCheck)} className='text-[16px] font-semibold mb-4 cursor-pointer'>ADD COMPOSITE ROOM</div>
                </div>

                {typeCheck?<div className='bg-[#A80023] w-[20%] mx-[16%] h-[2px]'></div>:
                <div className='bg-[#A80023] w-[20%] mx-[63%] h-[2px]'></div>}
                <div className='bg-[#D9D9D9] w-[85%] mx-auto  h-[2px]'></div>

            </div>
            {typeCheck ?
                <div>
                    <div className='flex justify-around mb-6'>
                        <div className='w-[45%]'>
                            <div className='mb-6 '>
                                <label className=' block text-[14px] font-semibold mb-2 text-black'>COMPOSITE TYPE <span className='text-red-500'>*</span></label>
                                <input type='text' value={compositeType} onChange={(e) => setCompositeType(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Enter Composite Type' />
                            </div>
                            <div>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>SHOPPABLE ATTRIBUTES <span className='text-red-500'>*</span></label>
                                <input type='text' value={shoppableAttributes} onChange={(e) => setShoppableAttributes(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Enter attributes separated by commas' />
                            </div>
                        </div>

                        <div className='w-[45%]'>
                            <div className='mb-6 '>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>LEGACY COMPOSITE ROOM POOL <span className='text-red-500'>*</span></label>
                                <input type='text' value={roomPool} onChange={(e) => setRoomPool(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Enter legacy composite room pool' />
                            </div>
                            <div>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>ROOM NUMBER <span className='text-red-500'>*</span></label>
                                <input type='text'  value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Enter room number separated by commas' />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <button onClick={handleSubmitCompositeType} className='bg-[#A80023] hover:bg-[#780019] text-white text-[14px] font-semibold px-4 py-1.5 rounded mx-3 mt-4 '>ADD COMPOSITE TYPE</button>
                    </div>
                </div>
            :
                <div>
                    <div className='flex justify-around mb-6'>
                        <div className='w-[45%]'>
                            <div className='mb-6 '>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>COMPOSITE TYPE <span className='text-red-500'>*</span></label>
                                <input type='text' value={compositeType1} onChange={(e) => setCompositeType1(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Select Composite Type' />
                            </div>
                            <div>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>ROOM NUMBER <span className='text-red-500'>*</span></label>
                                <input type='text' value={roomNumber1} onChange={(e) => setRoomNumber1(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Enter room number separated by commas' />
                            </div>
                        </div>

                        <div className='w-[45%]'>
                            <div className='mb-6 '>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>LEGACY COMPOSITE ROOM POOL <span className='text-red-500'>*</span></label>
                                <input type='text' value={roomPool1} onChange={(e) => setRoomPool1(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Select legacy composite room pool' />
                            </div>
                            <div>
                                <label className='block text-[14px] font-semibold mb-2 text-black'>VIRTUAL ROOM <span className='text-red-500'>*</span></label>
                                <input type='text' value={virtualRoom1} onChange={(e) => setVirtualRoom1(e.target.value)} className=' bg-[#F7F7F7] rounded p-1 w-full placeholder:text-[#00000070] textarea-xs' placeholder='Select virtual room' />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <button onClick={handleSubmitCompositeRoom} className='bg-[#A80023] hover:bg-[#780019] text-[14px] font-semibold text-white px-4 py-1.5 rounded mx-3 mt-4 '>ADD COMPOSITE ROOM</button>
                    </div>
                </div>
            }
            
            
        
        </div>
      </div>
    </>
  );
};

export default ModalCompositeRoom;
