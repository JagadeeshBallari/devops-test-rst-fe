'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Image from 'next/image'
import Link from 'next/link'
import { useHotel } from '@/app/context/HotelContext'

const Complete = () => {
  
    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string | null>(null);
    const [pmsType, setPmsType] = useState<string | null>(null);
    const [fetchedData, setFetchedData] = useState<string | null>(null);
    const { selectedHotel } = useHotel();

    useEffect(() => {
        setHotel(selectedHotel.name);
        setMarsha(selectedHotel.marsha);
        setPmsType(selectedHotel.pmsType);
    }, [selectedHotel]);

    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const response = await fetch(`http://localhost:8080/api/fspms/export-csv?code=${marsha}`);
                const data = await response.text();

                if(response.ok){
                    setFetchedData(data);
                    console.log(data);
                }
                else{
                    console.log(data);
                }  
            }catch(error){
                console.log(error);
            }            
        }
        fetchData();
    },[marsha])

    const downloadCSV = () => {
        if (!fetchedData) return;

        const blob = new Blob([fetchedData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${marsha} Data Extract.csv`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
  
    return (
    <>
        <div className='bg-[#F9F9F9] min-h-screen'>
        <header>
            <Header/>
        </header>

        <div className='px-16 mt-10 relative'>
        <div className='font-extrabold text-xl mb-5'> {hotel} - <span>({marsha})</span></div>
        
        <div className='flex justify-evenly mb-4'>
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                    <Image src='/check.png' alt='Logo' width={15} height={25} />
                </div>
                <span className="mt-2 text-xs text-[#333333]">UPLOAD ATTRIBUTES</span>
                <span className="text-xs text-[#00b300]">COMPLETE</span>
            </div>

            <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                    <Image src='/check.png' alt='Logo' width={15} height={25} />
                </div>
                <span className="mt-2 text-xs text-[#333333]">INITIAL CONFIGURATION</span>
                <span className="text-xs text-[#00b300]">COMPLETE</span>
            </div>

            <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                    <Image src='/check.png' alt='Logo' width={15} height={25} />
                </div>
                <span className="mt-2 text-xs text-[#333333]">GENERATE INVENTORY TYPES</span>
                <span className="text-xs text-[#00b300]">COMPLETE</span>
            </div>
            

            <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                    <Image src='/check.png' alt='Logo' width={15} height={25} />
                </div>
                <span className="mt-2 text-xs text-[#333333]">CONFIRM INVENTORY TYPES</span>
                <span className="text-xs text-[#00b300]">COMPLETE</span>
            </div>
            
        

            <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                    <Image src='/check.png' alt='Logo' width={15} height={25} />
                </div>
                <span className="mt-2 text-xs text-[#333333]">APPROVAL PROCESS</span>
                <span className="text-xs text-[#00b300]">COMPLETE</span>
            </div>
            
            

            <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                    <Image src='/check.png' alt='Logo' width={15} height={25} />
                </div>
                <span className="mt-2 text-xs text-[#333333]">FINALIZE INVENTORY TYPES</span>
                <span className="text-xs text-[#00b300]">COMPLETE</span>
            </div>
            
        </div>

            <div className='mt-20  text-center  w-full '>
                <div className='flex justify-center mb-2'><Image src='/celebrate.png' alt='success' width={125} height={125}/></div>
                <div className='mt-1 text-xl font-bold'>Success!</div>
                <div className='mt-1 text-sm'>Your Inventory Types are approved.</div>
                
                <div>
                    <Link href='/components/dashboard'>
                        <button className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer' >RETURN TO DASHBOARD</button>
                    </Link>
                    <button className='py-1.5 px-4 mt-3 bg-[#A80023] text-white rounded-md hover:bg-[#780019]' onClick={downloadCSV} >EXTRACT DATA</button>
                </div>
                
            </div>

           
        
        </div>
        </div>
    </>
  )
}

export default Complete