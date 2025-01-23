'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Image from 'next/image'
import Accordian from '@/app/elements/Accordian'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HotelProvider, useHotel } from '@/app/context/HotelContext'
import { useRouter } from 'next/navigation'

interface Comment {
  id: number;
  firstName: string;
  lastName: string;
  commentDesc: string;
  role: string;
  commentDate: string;
  pageName: string;
  marshaCode: string;
  read: boolean;
}

interface Notification {
  id: number;
  marshaCode: string;
  issue: string;
  notificationDate: string;
  title: string;
  description: string;
  read: boolean;
  userId: string;
  status: string;
}

const Page = () => {
    const pathname = usePathname();
    console.log(pathname)
    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string | null>(null);
    const [pmsType, setPmsType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [toggle,setToggle] = useState<boolean>(false)
    const [emailId, setEmailId] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [isRotated, setIsRotated] = useState<Boolean>(false);
    const [waitingForApproval, setWaitingForApproval] = useState<Notification[]>([]);
    const [approved, setApproved] = useState<Notification[]>([]);
    const [rejected, setRejected] = useState<Notification[]>([]);
    const {selectedHotel, role, email} = useHotel();


    const router = useRouter();

    useEffect(() => {
        setEmailId(email);
    },[email])

    useEffect(() => {
        setHotel(selectedHotel.name);
        setMarsha(selectedHotel.marsha);  
        setPmsType(selectedHotel.pmsType);
        setStatus(selectedHotel.status); 
       },[])

      function getFormattedDateTime(): string {
      
      const currentDateTime = new Date();
      const formattedDate = currentDateTime.toLocaleDateString('en-US');
      const options: Intl.DateTimeFormatOptions = { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
      };
      const formattedTime = currentDateTime.toLocaleTimeString('en-US', options);
      return `${formattedDate} ${formattedTime}`;
      }

       const changeStatus = async () => {
        const marshaCode = marsha;
        const issue = 'Review';
        const notificationDate = getFormattedDateTime();
        const title = `Property Review Request Submitted - ${marsha}`;
        const userId = emailId;
        const description = `${hotel} property is sent for approval.`
        
        
        try {
          const response = await fetch(`http://localhost:8080/api/property/sendforapproval?code=${marsha}&status=WAITING FOR APPROVAL`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({marshaCode, issue, notificationDate, description, userId, title}),
          });
      
          if (response.ok) {
            setStatus('WAITING FOR APPROVAL');
            router.push('/components/dashboard')
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

      const changeStatusApprove = async () => {
        const marshaCode = marsha;
        const issue = 'Approved';
        const notificationDate = getFormattedDateTime();
        const title = `Property Review Approved - ${marsha}`;
        const userId = emailId;
        const description = `Your inventory types for the property ${hotel} are approved.`

        try {
          const response = await fetch(`http://localhost:8080/api/property/approveproperty?code=${marsha}&status=COMPLETE`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({marshaCode, issue, notificationDate, description, userId, title}),
          });
      
          if (response.ok) {
            setStatus('COMPLETE');
            router.push('/components/complete')
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

      const changeStatusRevise = async () => {
        
        const marshaCode = marsha;
        const issue = 'Rejected';
        const notificationDate = getFormattedDateTime();
        const title = `Property Review Rejected - ${marsha}`;
        const userId = emailId;
        const description = `Your inventory types for the property ${hotel} are rejected.`

        try {
          const response = await fetch(`http://localhost:8080/api/property/approveproperty?code=${marsha}&status=REVISE`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({marshaCode, issue, notificationDate, description, userId, title}),
          });
      
          if (response.ok) {
            setStatus('REVISE');
            router.push('/components/dashboard')
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

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/comment/marshacomments?code=${marsha}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ }),

            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
              setComments(data);
            }else{
              console.error('Failed to fetch comments:', data);
            }
          } catch (error) {
            console.error('Error fetching comments:', error);
          }
        }

        fetchComments();
      }, [marsha]);

      const handleClick = () => {
        setIsRotated(prev => !prev);
      };
    
    const extractFirstLetter = (text: string) => {
        return text.charAt(0);
    };
    
    return (
    <>
        <div className='bg-[#F9F9F9] min-h-screen'>
        <HotelProvider>
          <header>
              <Header/>
          </header>

          <div className='px-16 mt-10 relative ' >
              <div className='font-extrabold text-xl mb-5'>{hotel} - <span >({marsha})</span></div>

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
                              <div className="flex items-center justify-center w-6 h-6 border-2 border-indigo-600 rounded-full">
                                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                              </div>
                              <span className="mt-2 text-xs text-[#333333]">APPROVAL PROCESS</span>
                              <span className="text-xs text-indigo-600">IN PROGRESS</span>
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

          <div className='font-medium text-lg mb-2 mt-5'>APPROVAL PROCESS</div>
          <div className='text-md mb-2'>Marriott needs to approve your Inventory Types. You will receive a notification when you can proceed to the next step.</div>

            <div className='mt-2 w-full p-4 '>
            <div className='flex justify-between bg-[#EEEEEE] py-3 px-12 mt-5 rounded-[5px]'>
              <div className='flex'>
                <div className='mr-4'><Image src='/approve.svg' alt='approve' width={32} height={32} /></div>
                <div className='text-[18px] font-[500] text-[#1D1A1A]'>APPROVAL PROCESS</div>
              </div>
                
              <div className='ml-10 items-center my-auto' onClick={() => setToggle(!toggle)}>
                <Image src='/arrowDown.svg' alt='down' width={15} height={15} className={`transform transition-transform duration-300 ${toggle ? 'rotate-180' : ''}`} />
              </div>
              
            </div>
            </div>
            
            {toggle === true ?
              <div >
              { status === 'IN PROGRESS' ? 
                <div className='flex w-full mt-10'>
                    <div className='flex place-content-center mx-auto justify-center mb-4 w-2/3 '>
                    
                    <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                            <i className="fas fa-circle text-white"></i>
                        </div>
                        <span className="mt-2 text-xs text-[#333333]">APPROVAL REQUESTED</span>
                        <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
                    </div>

                    <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

                    <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                            <i className="fas fa-circle text-white"></i>
                        </div>
                        <span className="mt-2 text-xs text-[#333333]">MARRIOTT REVIEW</span>
                        <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
                    </div>

                    <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

                    <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                            <i className="fas fa-circle text-white"></i>
                        </div>
                        <span className="mt-2 text-xs text-[#333333]">PROCESS COMPLETE</span>
                        <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
                    </div>
                    </div>
                </div> 
              : 
                status === 'COMPLETE' ?
                <div className='flex w-full mt-10'>
                <div className='flex place-content-center mx-auto justify-center mb-4 w-2/3 '>
                
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                        <Image src='/check.png' alt='Logo' width={15} height={25} />
                    </div>
                    <span className="mt-2 text-xs text-[#333333]">APPROVAL REQUESTED</span>
                    <span className="text-xs text-[#00b300]">COMPLETE</span>
                </div>
                
                <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                        <Image src='/check.png' alt='Logo' width={15} height={25} />
                    </div>
                    <span className="mt-2 text-xs text-[#333333]">MARRIOTT REVIEW</span>
                    <span className="text-xs text-[#00b300]">COMPLETE</span>
                </div>
                
                <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                        <Image src='/check.png' alt='Logo' width={15} height={25} />
                    </div>
                    <span className="mt-2 text-xs text-[#333333]">PROCESS COMPLETE</span>
                    <span className="text-xs text-[#00b300]">COMPLETE</span>
                </div>

                </div>
                </div>
              :
                <div className='flex w-full mt-10'>
                  <div className='flex place-content-center mx-auto justify-center mb-4 w-2/3 '>
                  
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                          <Image src='/check.png' alt='Logo' width={15} height={25} />
                      </div>
                      <span className="mt-2 text-xs text-[#333333]">APPROVAL REQUESTED</span>
                      <span className="text-xs text-[#00b300]">COMPLETE</span>
                  </div>

                  <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-6 h-6 border-2 border-indigo-600 rounded-full">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      </div>
                      <span className="mt-2 text-xs text-[#333333]">MARRIOTT REVIEW</span>
                      <span className="text-xs text-indigo-600">IN PROGRESS</span>
                  </div>

                  <div className="flex-1 h-[2px] bg-[#d3d3d3] mx-2 mt-4"></div>

                  <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#d3d3d3] rounded-full">
                          <i className="fas fa-circle text-white"></i>
                      </div>
                      <span className="mt-2 text-xs text-[#333333]">PROCESS COMPLETE</span>
                      <span className="text-xs text-[#d3d3d3]">NOT STARTED</span>
                  </div>
                  </div>
                </div> 
              }
              </div>
            :
              <div></div>
            }


              <div className=' w-full p-4 '>
                          
                          <div className='flex justify-between bg-[#EEEEEE] py-3 px-12 mt-5 rounded-[5px]'>
                            <div className='flex'>
                              <div className='mr-4'><Image src='/comment.svg' alt='comment' width={28} height={30} /></div>
                              <div className='text-[18px] font-[500] text-[#1D1A1A]'>COMMENT SUMMARY</div>
                            </div>
                              
                            <div className='ml-10 items-center my-auto' onClick={() => setIsRotated(!isRotated)}>
                              <Image src='/arrowDown.svg' alt='down' width={15} height={15} className={`transform transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`} />
                            </div>
                            
                          </div>

                          
                          
                          <div className='mx-12'>
                              {isRotated && 
                                  comments.map((comment: any, index: any) => (
                                      
                                  
                                  <div className='mt-2 flex text-[14px]' key={index}>
                                      
                                      {role==='REVENUE_MANGER'?
                                      <div className='p-2 w-[25px] h-[25px] flex items-center justify-center font-semibold mt-2 text-white bg-[#2CC11F] rounded-full '>{extractFirstLetter(comment.firstName)}</div>:
                                      <div className='p-2 w-[25px] h-[25px] flex items-center justify-center font-semibold mt-2 text-white bg-[#060B86] rounded-full '>{extractFirstLetter(comment.firstName)}</div>
                                      }

                                      <div className='p-2'>

                                          <div className='flex'>
                                              <div className='mr-6'>{comment.firstName} {comment.lastName}</div>
                                              <div className='mr-6  text-[#00000070]'>{comment.commentDate}</div>
                                              {comment.role==='REVENUE_MANGER'?<div className='text-[#2CC11F]'>Revenue Manager</div>: <div className='text-[#060B86]'>Admin</div>}
                                              <div className='text-[#4D61FC] text-[14px] ml-6'>{comment.pageName}</div>
                                          </div>

                                          <div className='text-[#00000070] mt-1'>{comment.commentDesc}</div>
                                      </div>

                                  </div>

                                  ))
                              }
                          </div>
                      </div>
                      
              <div className='flex justify-between mt-9'>
                  <div className='flex'>
                      <Link href={'/components/confirmInventory'}>
                      <div><button className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</button></div>
                      </Link>
                  </div>
                  { (status === 'IN PROGRESS' || status === 'REVISE' || status === 'READY FOR SETUP') && role === 'REVENUE_MANGER' ? 
                      <div className='flex'>
                          <div><button className={`text-white rounded-md px-4 py-1.5 bg-[#A80023] hover:bg-[#780019] cursor-pointer}`} onClick={()=>changeStatus()} >SEND FOR MARRIOTT APPROVAL</button></div>
                      </div>  
                    : 
                    (status === 'WAITING FOR APPROVAL' || status === 'REVISE') && role === 'ADMIN' ?
                      <div className='flex'>
                          <div><button className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer' onClick={()=>changeStatusRevise()} >REVISE</button></div>
                          <div><button className={`text-white rounded-md px-4 py-1.5 bg-[#A80023] hover:bg-[#780019] cursor-pointer`} onClick={()=>changeStatusApprove()} >APPROVE</button></div>
                      </div>
                    :
                    (status === 'COMPLETE') && role === 'ADMIN' || role === 'REVENUE_MANGER' ?
                      <Link href={'/components/complete'}>
                        <div><button className={`text-white rounded-md px-4 py-1.5 bg-[#A80023] hover:bg-[#780019] cursor-pointer`}>CONTINUE</button></div>
                      </Link>
                    :
                      <div></div>
                  }
              </div>
              

              
          </div>
        </HotelProvider>
        </div>
    </>
  )
}

export default Page