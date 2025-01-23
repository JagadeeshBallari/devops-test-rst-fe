// components/ConfirmationModal.tsx
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg w-1/3'>
        <p className='text-lg mb-4'>{message}</p>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2'
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className='bg-[#A80023] hover:bg-[#780019] text-white px-4 py-1.5 rounded'
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
