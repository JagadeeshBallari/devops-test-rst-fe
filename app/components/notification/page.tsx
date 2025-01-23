'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Image from 'next/image'
import { useHotel } from '@/app/context/HotelContext';



interface Notification {
  id: number;
  marshaCode: string;
  description: string;
  notificationDate: string; 
  issue: string;
  read: boolean;
  userId: string;
  title: string;
}


const Page = () => {
  
  const [isRead, setIsRead] = useState(true)
  const [emailId, setEmailId] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {email} = useHotel();

  useEffect(() => {
    if (email) {
      setEmailId(email);
      console.log('email' + email);
    }
  }, [email]);

 

  useEffect(() => {
    const fetchNotifications = async () => {
      
      try{
      const response = await fetch(`http://localhost:8080/api/notifications/${emailId}`);
      const data = await response.json();
      console.log(data);
      if(response.ok){
        setNotifications(data);
        console.log("notification sucessfully fetched");
      }else{
        console.error('Failed to fetch notifications:', data);
      }
      } catch (error) {
        console.error(error);
      }
    };

    if(emailId){
      fetchNotifications();
    }
    
  }, [emailId]);
    
  
  const filteredData: Notification[] = notifications.filter(item => isRead ? item.read : !item.read);

  return (
    <>
      <header>
        <Header/>
      </header>

      <div className='px-16 mt-10 relative'>
        
        <div className='text-[20px] font-[500]  mt-10'>NOTIFICATIONS</div>

        {notifications.length === 0 ? (
          <div className='text-[20px] font-[500] mt-20 flex justify-center'>No Notifications To Be Displayed</div>
          
        ):

        <div>
        <div className='mb-4 mt-5'>
            <div className='flex justify-start p-1 ml-[5%]'>
              <div onClick = {() => setIsRead(!isRead)}  className='text-[16px] font-semibold mb-4 cursor-pointer'>ALL</div>
              <div onClick = {() => setIsRead(!isRead)} className='text-[16px] font-semibold mb-4 cursor-pointer ml-8'>UNREAD</div>
            </div>
            {isRead?
              <div className='bg-[#A80023] w-[5%] mx-[4%] h-[2px]'></div>:
              <div className='bg-[#A80023] w-[8%] mx-[10%] h-[2px]'></div>
            
            }
            <div className='bg-[#D9D9D9] w-[95%] mx-  h-[2px]'></div>
        </div>

        { isRead?
        <div>
        {notifications.map((item, index) => (

        <div className='flex bg-[#EEEEEE] p-4 mb-3 rounded-md ' key={index}>
             {item.issue === 'Review'?
            <div className='my-auto'>
                <div className='flex justify-center bg-[#060B86] h-[48px] w-[48px] rounded-md'>
                <Image src='/review.svg' alt='Logo' width={28} height={28} />
                </div>
            </div>
            :
            item.issue === 'Assistance'?
            <div className='my-auto'>
                <div className='flex justify-center bg-[#A80023] h-[48px] w-[48px] rounded-md'>
                <Image src='/assistance.svg' alt='Logo' width={24} height={24} />
                </div>
            </div>
            :
            item.issue === 'Approved'?
            <div className='my-auto'>
                <div className='flex justify-center bg-[#2CC11F] h-[48px] w-[48px] rounded-md'>
                <Image src='/complete.svg' alt='Logo' width={24} height={24} />
                </div>
            </div>
            :
            <div className='my-auto'>
                <div className='flex justify-center bg-[#A80023] h-[48px] w-[48px] rounded-md'>
                <Image src='/close.svg' alt='Logo' width={24} height={24} />
                </div>
            </div>
            }
            
            <div className='ml-4 w-full'>
              
              {item.read?
              <div className='flex justify-between '>
                <div className='text-[18px] font-[500] '>{item.title}</div>
                <div className='text-[14px] font-[400] opacity-[44%]'>{item.notificationDate}</div>
              </div>
              :
              <div className='flex justify-between text-[#4E5DD3]'>
                <div className='text-[18px] font-[500] '>{item.title}</div>
                <div className='text-[14px] font-[400] opacity-[44%]'>{item.notificationDate}</div>
              </div>
              }
              
              <div className='text-[14px] font-[400]'>{item.description}</div>

            </div>
        </div>
        ))}
        </div>
        :
        <div>
        {filteredData.map((item, index) => (

        <div className='flex bg-[#EEEEEE] p-4 mb-3 rounded-md ' key={index}>
            {item.issue === 'Review'?
            <div className='my-auto'>
                <div className='flex justify-center bg-[#060B86] h-[48px] w-[48px] rounded-md'>
                <Image src='/review.svg' alt='Logo' width={28} height={28} />
                </div>
            </div>
            :
            item.issue === 'Assistance'?
            <div className='my-auto'>
                <div className='flex justify-center bg-[#A80023] h-[48px] w-[48px] rounded-md'>
                <Image src='/assistance.svg' alt='Logo' width={24} height={24} />
                </div>
            </div>
            :
            item.issue === 'Approved'?
            <div className='my-auto'>
                <div className='flex justify-center bg-[#2CC11F] h-[48px] w-[48px] rounded-md'>
                <Image src='/complete.svg' alt='Logo' width={24} height={24} />
                </div>
            </div>
            :
            <div className='my-auto'>
                <div className='flex justify-center bg-[#A80023] h-[48px] w-[48px] rounded-md'>
                <Image src='/close.svg' alt='Logo' width={24} height={24} />
                </div>
            </div>
            }
            
            <div className='ml-4 w-full'>
              
              {item.read?
              <div className='flex justify-between '>
                <div className='text-[18px] font-[500] '>{item.title}</div>
                <div className='text-[14px] font-[400] opacity-[44%]'>{item.notificationDate}</div>
              </div>
              :
              <div className='flex justify-between text-[#4E5DD3]'>
                <div className='text-[18px] font-[500] '>{item.title}</div>
                <div className='text-[14px] font-[400] opacity-[44%]'>{item.notificationDate}</div>
              </div>
              }
              
              <div className='text-[14px] font-[400]'>{item.description}</div>

            </div>
        </div>
        ))}
        </div>
        }
        </div>
      }
      </div>
    </>
  )
}

export default Page