// components/Modal.tsx
import React from 'react';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attribute: { specialReqs: { code: string, description: string }[]; categories: { category: string; shoppableAttributes: { attributeDesc: string; shoppable: string[] }[] }[] }) => void;
}

const ModalAttribute: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [attribute, setAttribute] = useState('');
    const [shoppable, setShoppable] = useState('');
  


  const handleSubmit = () => {
    if (code && description) {
      onSubmit({ specialReqs: [{ code, description }], categories: [{ category, shoppableAttributes: [{ attributeDesc: attribute, shoppable: [shoppable] }] }] });
      onClose();
    } else {
      alert('Please fill in all fields.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-100 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg w-[60%]'>
        <h2 className='text-xl font-bold mb-4 text-[#A80023]'>ADD ATTRIBUTE</h2>
        <div className='mb-4'>
          <label className='block text-black'>CODE:</label>
          <input
            type='text'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className='border border-gray-300 rounded p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-black'>DESCRIPTION:</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border border-gray-300 rounded p-2 w-full'
          />
        </div>
        
        <div className='flex justify-end'>
          <button onClick={onClose} className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2'>Cancel</button>
          <button onClick={handleSubmit} className='bg-[#A80023] hover:bg-[#780019] text-white px-4 py-1.5 rounded'>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAttribute;
