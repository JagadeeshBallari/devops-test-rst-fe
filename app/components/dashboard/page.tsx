'use client'
import React, { useEffect, useState } from 'react';
import HeaderDashboard from '../headerDashboard/page';
import Image from 'next/image';
import Link from 'next/link';
import { HotelProvider, useHotel } from '@/app/context/HotelContext';
import ModalSortDashboadr from '@/app/elements/modalSortDashboard';

interface Hotel {
  id: string;
  marshaCode: string;
  status: string;
  hotelName: string;
  pmsType: string;
}

interface PropertyListItem {
  id: string;
  marshaCode: string;
  unitOfMesure: string;
  status: string;
  hotelName: string;
  pmsType: string;
}

interface FetchResponse {
  id: string;
  revManagerId: string;
  propertyLists: PropertyListItem[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { selectedHotel, selectHotel, firstName, lastName, email, role } = useHotel();
  const [firstNamePage, setFirstNamePage] = useState<string>('');
  const [lastNamePage, setLastNamePage] = useState<string>('');
  const [emailPage,setEmailPage] = useState<string>('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [dropdown1, setDropdown1] = useState<boolean>(false);
  const [dropdown2, setDropdown2] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (firstName && lastName && email) {
      setFirstNamePage(firstName);
      setLastNamePage(lastName);
      console.log(firstName);
      console.log(lastName);
    }
  }, [firstName, lastName]);

  useEffect(() => {
    
    if (email) {
      const fetchHotels = async () => {
        try {
          const endpoint = role === 'ADMIN'
            ? `http://localhost:8080/api/property/adminhotels?email=${email}`
            : `http://localhost:8080/api/property/listofhotels?email=${email}`;

          const response = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data: Hotel[] = await response.json();
          setHotels(data);
        } catch (error) {
          console.error('Error fetching hotels:', error);
        }
      };

      if (email) {
        fetchHotels();
      }
    }
  }, [email, role]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredHotels = hotels.filter((item) =>
    (item.hotelName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.marshaCode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HotelProvider>
      <main>
        <header >
          <HeaderDashboard />
        </header>

        <div className='px-16 mt-10 relative'>
          <div className='text-[22px] font-[400] text-[#1D1A1A] pb-2'>Welcome, {firstNamePage} {lastNamePage}!</div>
          <div className='text-[18px] font-[400] text-[#1D1A1A] pb-4'>Please select the property for which you would like to setup your Room / Inventory Types.</div>

          <div className='flex justify-between mt-2'>
            <div className='flex bg-[#EEEEEE] w-[40%] rounded-[5px]'>
              <Image src='/search.svg' alt='Search' width={20} height={20} className='ml-4 mr-1' />
              <input
                type="text"
                placeholder="Search by Property Name / MARSHA code"
                value={searchTerm}
                onChange={handleChange}
                className='p-1 w-[80%] text-[14px] bg-[#EEEEEE]'
              />
            </div>

            <div onClick={() => setIsModalOpen(true)} className='text-[14px] font-[500] p-0.5 text-[#A80023] border-2 border-[#A80023] rounded-[5px] cursor-pointer flex px-2'><Image src='/sort.svg' alt='sort' width={20} height={20} className='mr-1'/> SORT & FILTER</div>
          </div>

          <div className='flex justify-between bg-[#EEEEEE] py-3 px-12 mt-10 rounded-[5px]'>
            <div className='text-[18px] font-[500] text-[#1D1A1A]'>COMMUNITY 1</div>
            <div className='flex'>
              <div className='text-[14px] font-[500] p-0.5 text-[#A80023] bg-[#A800230F] flex px-2'>{filteredHotels.length} Properties</div>
              <div className='ml-10 items-center my-auto' onClick={() => setDropdown1(!dropdown1)}>
                <Image src='/arrowDown.svg' alt='down' width={15} height={15} className={`transform transition-transform duration-300 ${dropdown1 ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>

          {dropdown1 && (
            <div className='grid grid-cols-2 mt-2'>
              {filteredHotels.map((hotel, index) => (
                <Link href={`/components/status`} key={index}>
                  <div className='flex flex-row bg-[#F9F9F9] border-2  p-2 m-1.5 rounded-lg border-[#D9D9D9] hover:bg-[#F2F2F2] cursor-pointer' key={hotel.hotelName} onClick={() => selectHotel(hotel.hotelName, hotel.marshaCode, hotel.pmsType, hotel.status)}>
                    <div className='p-1 my-auto mr-2'>
                      <Image
                        src={hotel.status === 'READY FOR SETUP' ? '/warning.svg' : hotel.status === 'IN PROGRESS' ? '/dot.svg' : hotel.status === 'WAITING FOR APPROVAL' ? '/waiting.svg' : hotel.status === 'REVISE' ? '/revise.svg' : '/checked.svg'}
                        alt="Status Icon"
                        width={25}
                        height={25}
                        className="w-[25px] h-[25px] image-full"
                        
                      />
                    </div>
                    <div className='flex flex-col'>
                      <div className='font-[600] text-[14px]'>
                        {hotel.hotelName}
                        <span className='text-[14px] ml-2 text-slate-500'>({hotel.marshaCode})</span>
                      </div>
                      {hotel.status === 'READY FOR SETUP' ? (
                        <div className='text-[#A80023] text-[12px] font-[700]'>READY FOR SETUP</div>
                      ) : hotel.status === 'IN PROGRESS' ? (
                        <div className='text-[#060B86] text-[12px] font-[700]'>IN PROGRESS</div>
                      ) : hotel.status === 'WAITING FOR APPROVAL' ? (
                        <div className='text-[#FC8F2F] text-[12px] font-[700]'>WAITING FOR APPROVAL</div>
                      ) : hotel.status === 'REVISE' ? (
                        <div className='text-[#9747FF] text-[12px] font-[700]'>REVISE</div>
                      ) :(
                        <div className='text-[#2CC11F] text-[12px] font-[700]'>COMPLETE</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className='flex justify-between bg-[#EEEEEE] py-3 px-12 mt-4 rounded-[5px]'>
            <div className='text-[18px] font-[500] text-[#1D1A1A]'>COMMUNITY 2</div>
            <div className='flex'>
              <div className='text-[14px] font-[500] p-0.5 text-[#A80023] bg-[#A800230F] flex px-2'>1 Properties</div>
              <div className='ml-10 items-center my-auto' onClick={() => setDropdown2(!dropdown2)}>
                <Image src='/arrowDown.svg' alt='down' width={15} height={15} className={`transform transition-transform duration-300 ${dropdown2 ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>

          {dropdown2 && (
            <div className='grid grid-cols-2 mt-2'>
                  <div className='flex flex-row bg-[#F9F9F9] border-2  p-2 m-1.5 rounded-lg border-[#D9D9D9] hover:bg-[#F2F2F2] cursor-pointer'  >
                    <div className='p-1 my-auto mr-2'>
                      <Image
                        src= '/banned.svg' 
                        alt="Status Icon"
                        width={25}
                        height={25}
                        className="w-[25px] h-[25px] image-full"
                      />
                    </div>
                    <div className='flex flex-col'>
                      <div className='font-[600] text-[14px] text-[#00000070]'>
                        The Cambry, Autograph Collection 
                        <span className='text-[14px] ml-2 text-[#00000070]'>(PHXAK)</span>
                      </div>
                      <div className='text-[#00000070] text-[12px] font-[700]'>FUTURE COMMUNITY</div>
                    </div>
                  </div>
                
              
            </div>
          )}

          
        </div>
        <ModalSortDashboadr 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
      </main>
    </HotelProvider>
  );
}
