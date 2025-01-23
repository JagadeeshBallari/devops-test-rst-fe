// components/Modal.tsx
import React, { useEffect } from 'react';
import { useState } from 'react';
import { HotelProvider, useHotel } from '../context/HotelContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attribute: {marshaCode: string, roomPool: string, configuration: string, size: number }) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  
  const [roomPool, setRoomPool] = useState('');
  const [marsha, setMarsha] = useState('');
  const [newAttribute, setNewAttribute] = useState({ marshaCode: '', roomPool: '', configuration: '', size: 0 });
  const { selectedHotel } = useHotel();

    useEffect(() => {
        setMarsha(selectedHotel.marsha);
    }, [selectedHotel]);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomPool(e.target.value)
    setNewAttribute(prev => ({
        ...prev,
        marshaCode: marsha,
        roomPool: e.target.value
    }));
};
  const handleSubmit = () => {
    if ( roomPool) {
      onSubmit(newAttribute);
      onClose();
    } else {
      alert('Please fill in all fields.');
    }
  };

  if (!isOpen) return null;

  return (
    <HotelProvider>
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4 text-[#A80023]'>Add Attribute</h2>
        <div className='mb-4'>
          <label className='block text-black'>ROOM POOL:</label>
          <input
            type='text'
            value={newAttribute.roomPool}
            onChange={(e) => handleChange(e)}
            className='border border-gray-300 rounded p-2 w-full'
          />
        </div>
        <div className='flex justify-end'>
          <button onClick={onClose} className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2'>Cancel</button>
          <button onClick={handleSubmit} className='bg-[#A80023] hover:bg-[#780019] text-white px-4 py-1.5 rounded'>Submit</button>
        </div>
      </div>
    </div>
    </HotelProvider>
  );
};

export default Modal;
