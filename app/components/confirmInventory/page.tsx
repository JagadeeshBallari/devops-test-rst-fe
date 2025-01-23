'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Image from 'next/image'
import Accordian from '@/app/elements/Accordian'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HotelProvider, useHotel } from '@/app/context/HotelContext'

export interface Comment {
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

interface TableData {
    inventoryCode: string;
    shoppable: string[];
}



const ConfirmInventory = () => {
    const pathname = usePathname();
    console.log(pathname)
    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string | null>(null);
    const [isRotated, setIsRotated] = useState<Boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [roleLevel, setRoleLevel] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [tableData, setTableData] = useState<TableData[]>([]);

    const { selectedHotel, firstName, lastName, role } = useHotel();
    
    
    useEffect(() => {
        setRoleLevel(role);
        setUserName(`${firstName} ${lastName}`);
        console.log(firstName);
        console.log(role);
        
    }, [role,firstName,lastName]);

    useEffect(() => {
        setHotel(selectedHotel.name);
        setMarsha(selectedHotel.marsha);   
       },[])

       const handleClick = () => {
        setIsRotated(prev => !prev);
      };
    
    const extractFirstLetter = (text: string) => {
        return text.charAt(0);
    };

    useEffect(() => {
        existingComments();
    }, [marsha]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8080/api/fspms/approval?code=${marsha}`);
                const data = await response.json();
                
                if(response.ok){
                    console.log(data);
                
                    // Sort data by inventoryCode in ascending order
                    const sortedData = data.sort((a: { inventoryCode: string }, b: { inventoryCode: any }) => {
                        return a.inventoryCode.localeCompare(b.inventoryCode);
                    });

                    setTableData(sortedData);
                }
                else{
                    console.log('Error:' + data);
                }
            }catch(error){
                console.error(error);
            }
        }

        fetchData();
    }, [marsha]);

      const existingComments = async () => {
        const requestBody = {
            marshaCode: marsha,
            pageName: 'Confirm Inventory'
        }
        try{
            const response = await fetch(`http://localhost:8080/api/comment/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            console.log('Existing Comments:', data);
            if (response.ok) {
                // Ensure that data is an array
                if (Array.isArray(data)) {
                    // Define a function to parse dates
                    const parseDate = (dateString: string | number | Date) => {
                        // Use new Date() directly if date strings are in ISO format
                        const date = new Date(dateString);
                        // If date is invalid, try to handle or return a default value
                        return isNaN(date.getTime()) ? new Date(0) : date;
                    };
    
                    const sortedComments = data.sort((a, b) => {
                        const dateA = parseDate(a.commentDate);
                        const dateB = parseDate(b.commentDate);
    
                        // Handle invalid dates
                        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                            console.error('Invalid date found during sorting:', a.commentDate, b.commentDate);
                            return 0; 
                        }
    
                        return dateB.getTime() - dateA.getTime(); 
                    });
    
                    console.log('Sorted Comments:', sortedComments);
                    setComments(sortedComments);
                } else {
                    console.error('Data is not an array:', data);
                }
            }else{
                console.error('Failed to fetch comments:', data);
            }
        }catch(error){
            console.error('Error:', error);
        }
    }  

    const handleCommentSave = async () => {
        const commentDesc = comment;
        const role = roleLevel;
        const pageName = 'Confirm Inventory';
        const marshaCode = marsha;

        const commentBody = {
            firstName: firstName,
            lastName: lastName,
            commentDesc: commentDesc,
            role: role,
            pageName: pageName,
            marshaCode: marshaCode
        }
        try{
            const response = await fetch(`http://localhost:8080/api/comment/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentBody),
            })

            const responseText = await response.text(); 
            if(response.ok){
                console.log('Comment saved successfully:', responseText);
            }else{
                console.error('Failed to save comment:', responseText);
            }
        }catch(error){
            console.error('Error:', error);
        }
    }  
    
    return (
    <>
        <div className='bg-[#F9F9F9] min-h-screen'>
        <HotelProvider>
        <header>
            <Header/>
        </header>

        <div className='px-16 mt-10 relative' >
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
                            <div className="flex items-center justify-center w-6 h-6 border-2 border-indigo-600 rounded-full">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                            </div>
                            <span className="mt-2 text-xs text-[#333333]">CONFIRM INVENTORY TYPES</span>
                            <span className="text-xs text-indigo-600">IN PROGRESS</span>
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

        <div className='font-medium text-lg mb-2 mt-5'>FINALIZE INVENTORY TYPES</div>
        <div className='text-md mb-2'>Review the finalized inventory types</div>

            <div className='overflow-y-auto max-h-[400px]'>
            {tableData.map((item, index) => (
                <Accordian key={item.inventoryCode} title={item.inventoryCode} content={item.shoppable} pathname={pathname}/>
            ))}
            </div>
        

        <div className='mt-10 w-full p-4 bg-white'>
            
            <div className='flex justify-between'>
                <div className='font-[700] text-[16px]'>COMMENTS {!isRotated ? '(' + `${comments.length}` + ')' : ''}</div>
                <div
                    onClick={handleClick}
                    style={{
                    display: 'inline-block',
                    transition: 'transform 0.3s ease',
                    transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                >
                    <Image src='/arrowDown.svg' alt='Arrow Down' width={15} height={25} />
                </div>
            </div>

            <div className='flex w-[80%] border border-[#D9D9D9] radius-[2px] mt-2'>
                <div className='w-[80%]' ><input className='w-full  rounded p-2  placeholder:text-[14px]' value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder='Write a text here'/></div>
                <div className='items-end ml-5'><Image src='/Enter.svg' alt='Enter' width={26} height={28} onClick={handleCommentSave} className='cursor-pointer mt-1.5' /></div>

            </div>
            
            <div>
                {isRotated && 
                    comments.map((comment: any, index: any) => (
                        
                    
                    <div className='mt-2 flex text-[14px]' key={index}>
                        
                        {role==='REVENUE_MANGER'?
                        <div className='p-2 w-[25px] h-[25px] flex items-center justify-center font-semibold mt-2 text-white bg-[#2CC11F] rounded-full '>{extractFirstLetter(comment.firstName)}</div>:
                        <div className='p-2 w-[25px] h-[25px] flex items-center justify-center font-semibold mt-2 text-white bg-[#060B86] rounded-full '>{extractFirstLetter(comment.firstName)}</div>
                        }

                        <div className='p-2'>

                            <div className='flex'>
                                <div className='mr-4'>{comment.firstName} {comment.lastName}</div>
                                <div className='mr-4  text-[#00000070]'>{comment.commentDate}</div>
                                {comment.role==='REVENUE_MANGER'?<div className='text-[#2CC11F]'>Revenue Manager</div>: <div className='text-[#060B86]'>Admin</div>}
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
                    <Link href={'/components/inventoryTypePrimaryAssignment'}>
                    <div><button className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</button></div>
                    </Link>
                </div>
                <div className='flex'>
                    <Link href={'/components/exceptionApproval'}>
                    <div><button className={`text-white rounded-md px-4 py-1.5 bg-[#A80023] hover:bg-[#780019] cursor-pointer}`} >Confirm</button></div>
                    </Link>
                </div>
            </div>

        </div>
        </HotelProvider>
        </div>
    </>
  )
}

export default ConfirmInventory