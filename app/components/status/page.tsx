'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../header/page';
import Image from 'next/image';
import { HotelProvider, useHotel } from '@/app/context/HotelContext';
import { useRouter} from 'next/navigation';
import Tooltip from '@/app/elements/Tooltip';
import { getTooltipContentUploadPage } from '@/utils/tooltipUpoladPage';
import Link from 'next/link';



const Status = () => {
  const [hotel, setHotel] = useState<string | null>(null);
  const [marsha, setMarsha] = useState<string | null>(null);
  const [pmsType, setPmsType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [fileData, setFileData] = useState<File | undefined>();
  const [fileDataSpecial, setFileDataSpecial] = useState<File | undefined>();
  const [fileName, setFileName] = useState<string>('No file attached - please attach a file');
  const [fileNameSpecial, setFileNameSpecial] = useState<string>('No file attached - please attach a file');
  const [image, setImage] = useState<string>('/paperclip.svg');
  const [imageSpecial, setImageSpecial] = useState<string>('/paperclip.svg');
  const [time, setTime] = useState<string>('');
  const [timeSpecial, setTimeSpecial] = useState<string>('');
  const [roomFileName, setRoomFileName] = useState<string>('');
  const [roomFileNameSpecial, setRoomFileNameSpecial] = useState<string>('');
  const [postURL, setPostURL] = useState<string>('');

  const { selectedHotel } = useHotel();
  const router = useRouter();


  useEffect(() => {
    if (selectedHotel) {
      setHotel(selectedHotel.name);
      setMarsha(selectedHotel.marsha);
      setPmsType(selectedHotel.pmsType);
      setStatus(selectedHotel.status);
    }
  }, [selectedHotel]);

  useEffect(() => {
    if(pmsType === 'fspms'){
      setPostURL('http://localhost:8080/api/fspms/upload');
      setRoomFileName('ROOM MASTER')
      setRoomFileNameSpecial('SPECIAL REQUEST')
    }
    else if(pmsType === 'fosse'){
      setPostURL('http://localhost:8080/api/fosse/upload');
      setRoomFileName('ROOM MASTER')
      setRoomFileNameSpecial('GLOBAL CODE')
    }  
    else if(pmsType === 'opera'){
      setPostURL('http://localhost:8080/api/opera/upload');
      setRoomFileName('ROOMS')
      setRoomFileNameSpecial('PREFRENCES')
    }
    else if(pmsType === 'lightspeed'){
      setPostURL('http://localhost:8080/api/lightspeed/upload');
      setRoomFileName('ROOMS DEFINITION')
      setRoomFileNameSpecial('CODE DATA BASE')
    }
  }, [pmsType]);

  useEffect(() => {
    if (status === 'READY FOR SETUP' && marsha) {
      const changeStatus = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/property/progress?code=${marsha}&status=IN PROGRESS`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const text = await response.text(); // Get the raw response text
          let data;
      
          try {
            data = JSON.parse(text); // Try to parse as JSON
          } catch {
            data = { message: text }; // Fallback if parsing fails
          }
      
          console.log(data);
        } catch (error) {
          console.error('Error changing status:', error);
        }
      };
      

      changeStatus();
    }
  }, [status, marsha]);
        

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        setFileData(files[0]);
        setFileName(files[0].name);
        setImage('/checked.svg');
        setTime(new Date().toLocaleString());
      } else {
        setFileData(undefined);
        setFileName('No file attached - please attach a file');
        setImage('/paperclip.svg');
        setTime('');
      }
    } catch (error) {
      console.error('Error handling file change:', error);
      setImage('/warning.png');
      setTime('');
    }
  };

  const handleFileChangeSpecial = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        setFileDataSpecial(files[0]);
        setFileNameSpecial(files[0].name);
        setImageSpecial('/checked.svg');
        setTimeSpecial(new Date().toLocaleString());
      } else {
        setFileDataSpecial(undefined);
        setFileNameSpecial('No file attached - please attach a file');
        setImageSpecial('/paperclip.svg');
        setTimeSpecial('');
      }
    } catch (error) {
      console.error('Error handling special file change:', error);
      setImageSpecial('/warning.png');
      setTimeSpecial('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      if (fileData) {
        formData.append('file', fileData);
      }
      if (fileDataSpecial) {
        formData.append('file', fileDataSpecial);
      }
      console.log('Form data:', fileData);
      const response = await fetch(`${postURL}?code=${marsha}`, {
        method: 'POST',
        body: formData,
        
      });

      if (response.ok) {
        console.log('Upload successful');
        router.push('/components/roomPool');

      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

   let disable = fileData === undefined || fileDataSpecial === undefined; 

  return (
    <>
      <div className='bg-[#F9F9F9] min-h-screen'>
      <HotelProvider>
        <header>
          <Header />
        </header>

        <div className='px-16 mt-10 relative'>
          
          
            <div className='font-extrabold text-xl mb-5'>
              {hotel} - <span>({marsha})</span>
            </div>

            <div className='flex justify-evenly mb-4'>
                
              <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-indigo-600 rounded-full">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  </div>
                  <span className="mt-2 text-xs text-[#333333]">UPLOAD PROPERTY DATA</span>
                  <span className="text-xs text-indigo-600">IN PROGRESS</span>
              </div>

              <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

              <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                  <i className="fas fa-circle text-white"></i>
                  </div>
                  <span className="mt-2 text-xs text-[#333333]">INITIAL CONFIGURATION</span>
                  <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
              </div>

              <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

              <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                  <i className="fas fa-circle text-white"></i>
                  </div>
                  <span className="mt-2 text-xs text-[#333333]">GENERATE INVENTORY TYPES</span>
                  <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
              </div>

              <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

              <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                  <i className="fas fa-circle text-white"></i>
                  </div>
                  <span className="mt-2 text-xs text-[#333333]">CONFIRM INVENTORY TYPES</span>
                  <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
              </div>

              <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

              <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                  <i className="fas fa-circle text-white"></i>
                  </div>
                  <span className="mt-2 text-xs text-[#333333]">APPROVAL PROCESS</span>
                  <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
              </div>

              <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

              <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                  <i className="fas fa-circle text-white"></i>
                  </div>
                  <span className="mt-2 text-xs text-[#333333]">FINALIZE INVENTORY TYPES</span>
                  <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
              </div>


            </div> 
          

          <div className='flex'>
            <div className='mb-2 font-[500] text-[18px]'>UPLOAD {roomFileName} LIST</div>
            
            <div className='ml-4 justify-center'>
              <Tooltip text={getTooltipContentUploadPage()}>
                <button className='hover:cursor-pointer align-middle'><Image src='/tooltip.png' alt='Logo' width={20} height={20} className='hover:cursor-pointer '/></button>
              </Tooltip>
            </div>
          </div>

          <div className='flex justify-between bg-[#EEEEEE] rounded-md p-2 mb-10'>
            <div className='flex'>
              <div className='content-center mr-2'>
                <Image src={image} alt='uploadIcon' width={20} height={20} />
              </div>
              <div className='content-center'>
                <div>{fileName}</div>
                <div className='font-light text-[12px]'>{time}</div>
              </div>
            </div>
            <div className='content-center'>
              <button type='button' className='cursor-pointer py-1.5 px-4 bg-[#A80023] text-white rounded-[5px] hover:bg-[#780019]'>
                <label htmlFor='file' className='cursor-pointer'>
                  SELECT FILE
                </label>
              </button>
              <input type='file' id='file' style={{ display: 'none' }} accept=".txt,.xls,.xlsx" onChange={handleFileChange} />
            </div>
          </div>

          <div className='mb-2 font-[500] text-[18px]'>UPLOAD {roomFileNameSpecial} LIST</div>

          <div className='flex justify-between bg-[#EEEEEE] rounded-md p-2 mb-2'>
            <div className='flex'>
              <div className='mr-2 content-center'>
                <Image src={imageSpecial} alt='uploadIcon' width={20} height={20} />
              </div>
              <div className='content-center '>
                <div>{fileNameSpecial}</div>
                <div className='font-light text-[12px]'>{timeSpecial}</div>
              </div>
            </div>
            <div className='content-center'>
              <button type='button' className='cursor-pointer py-1.5 px-4 bg-[#A80023] text-white rounded-[5px] hover:bg-[#780019]'>
                <label htmlFor='fileSpecial' className='cursor-pointer'>
                  SELECT FILE
                </label>
              </button>
              <input type='file' id='fileSpecial'  style={{ display: 'none' }} accept=".txt,.xls,.xlsx" onChange={handleFileChangeSpecial} />
            </div>
          </div>
            
            <div className='flex justify-between mt-10 w-full'>
              
              <Link href={'/components/dashboard'}>
                  <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</div>
              </Link>
              
              <div className='mr-1.5'>
                <button onClick={handleSubmit} type='submit' disabled={disable} className='text-white disabled:bg-[#D1CFCF] bg-[#A80023] rounded-md px-4 py-1.5 hover:bg-[#780019] '>
                  Continue
                </button>
              </div>
            </div>
            
        </div>
      </HotelProvider>
      </div>
    </>
  );
};

export default Status;


            