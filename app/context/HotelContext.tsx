// HotelContext.tsx
'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface Hotel {
  name: string;
  marsha: string;
  pmsType: string;
  isLoggedIn: boolean;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

interface HotelContextType {
  selectedHotel: Hotel;
  selectHotel: (name: string, marsha: string, pmsType: string, status: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

interface HotelProviderProps {
  children: React.ReactNode;
}

export const HotelProvider: React.FC<HotelProviderProps> = ({ children }) => {
  const initialHotel: Hotel = { name: '', marsha: '', pmsType: '', isLoggedIn: false, email:'', firstName: '', lastName: '', role: '', status: '' };

  // Initialize state with localStorage data or defaults
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(() => {
    if (typeof window !== 'undefined') {
      const storedHotel = localStorage.getItem('selectedHotel');
      return storedHotel ? JSON.parse(storedHotel) : initialHotel;
    }
    return initialHotel;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
    }
    return false;
  });

  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('email') || '';
    }
    return '';
  });

  const [role, setRole] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role') || '';
    }
    return '';
  });

  const [firstName, setFirstName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('firstName') || '';
    }
    return '';
  });

  const [lastName, setLastName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastName') || '';
    }
    return '';
  });

  // Effect to sync state with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedHotel', JSON.stringify(selectedHotel));
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
    }
  }, [selectedHotel, isLoggedIn, email, role, firstName, lastName]);

  const selectHotel = (name: string, marsha: string, pmsType: string, status: string) => {
    const hotel = { name, marsha, pmsType, isLoggedIn: true, email, firstName, lastName, role, status };
    setSelectedHotel(hotel);
  };

  const updateIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <HotelContext.Provider value={{ selectedHotel, selectHotel, role, setRole, isLoggedIn, setIsLoggedIn: updateIsLoggedIn, firstName, setFirstName, lastName, setLastName , email, setEmail }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = (): HotelContextType => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
