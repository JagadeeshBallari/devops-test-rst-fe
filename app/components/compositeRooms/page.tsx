'use client';
import { HotelProvider, useHotel } from '@/app/context/HotelContext';
import React, { useEffect, useState } from 'react';
import Header from '../header/page';
import Image from 'next/image';
import Tooltip from '@/app/elements/Tooltip';
import { getTooltipContentInventoryItemAudit } from '@/utils/tooltipInventoryItemAudit';
import Link from 'next/link';
import ModalCompositeRoom from '@/app/elements/modalCompositeRoom';

interface VirtualRoom {
    virtualRoom: string;
    roomNumbers: number[];
}

interface TableData {
    compositeType: number;
    roomPool: string;
    shoppableAttributes: string[];
    virtualRooms: VirtualRoom[];
}

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




const Page = () => {
    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string | null>(null);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isRotated, setIsRotated] = useState<Boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [roleLevel, setRoleLevel] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);


    const [newRow, setNewRow] = useState<TableData>({
        compositeType: 0,
        roomPool: '',
        shoppableAttributes: [],
        virtualRooms: [],
    });

    const { selectedHotel, firstName, lastName, role } = useHotel();
    
    
    useEffect(() => {
        setRoleLevel(role);
        setUserName(`${firstName} ${lastName}`);
        console.log(firstName);
        console.log(role);
        
    }, [role,firstName,lastName]);

    useEffect(() => {
        if (selectedHotel) {
            setHotel(selectedHotel.name);
            setMarsha(selectedHotel.marsha);
        }
    }, [selectedHotel]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/fspms/compositeroomtype?code=${marsha}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: TableData[] = await response.json();
            console.log('Data fetched successfully:', data);
            
            // Sort data by virtual rooms
            const sortedData = data.map(item => ({
                ...item,
                virtualRooms: item.virtualRooms.sort((a, b) => 
                    a.virtualRoom.localeCompare(b.virtualRoom)
                )
            }));
            
            setTableData(sortedData);
            const convertedData = convertDataFormat(sortedData);
            console.log('Converted Data:', convertedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    useEffect(() => {
        if (marsha) {
            fetchData();
        }
    }, [marsha]);

    const handleRoomPoolChange = (index: number, newValue: string) => {
        setTableData(prevData => {
            const updatedData = [...prevData];
            updatedData[index].roomPool = newValue;
            return updatedData;
        });
    };

    const handleShoppableAttributesChange = (index: number, newValue: string) => {
        setTableData(prevData => {
            const updatedData = [...prevData];
            updatedData[index].shoppableAttributes = newValue.split(',').map(attr => attr.trim());
            return updatedData;
        });
    };


    const handleRoomNumberChange = (itemIndex: number, virtualRoomIndex: number, roomNumberIndex: number, newValue: string) => {
        setTableData(prevData => {
            const updatedData = [...prevData];
            const newRoomNumbers = [...updatedData[itemIndex].virtualRooms[virtualRoomIndex].roomNumbers];
            newRoomNumbers[roomNumberIndex] = parseInt(newValue, 10) || 0; 
            updatedData[itemIndex].virtualRooms[virtualRoomIndex].roomNumbers = newRoomNumbers;
            return updatedData;
        });
    };

    const convertDataFormat = (data: TableData[]): any[] => {
        return data.flatMap(item =>
            item.virtualRooms.map(virtualRoom => ({
                marshaCode: marsha,
                compositeType: item.compositeType,
                roomPool: item.roomPool,
                virtualRoom: virtualRoom.virtualRoom,
                shoppableAttributes: item.shoppableAttributes,
                roomNumbers: virtualRoom.roomNumbers,
            }))
        );
    };

    const handleAddRow = async (compositeType: string, roomPool: string, shoppableAttributes: string, roomNum: string) => {
            const roomNumbers = roomNum.split(',').map((roomNum) => parseInt(roomNum, 10));
            try{
                const response = await fetch(`http://localhost:8080/api/fspms/compositetype?code=${marsha}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ compositeType, roomPool, shoppableAttributes, roomNumbers }),
                })
                if (response.ok) {
                    console.log('Data saved successfully');
                    setIsModalOpen(false);
                    fetchData();
                } else {
                    console.error('Error saving data:', response.statusText);
                }
            }catch(error){
                console.error('Error saving data:', error);
            }
        }

    const handleAddRoom = async (compositeType: string, roomPool: string, virtualRoom: string, roomNum: string) => {
        const roomNumber = roomNum;
        try{
            const response = await fetch(`http://localhost:8080/api/fspms/compositeroom?code=${marsha}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ compositeType, roomPool, virtualRoom, roomNumber }),
            })
                if(response.ok){
                    console.log('Data saved successfully');
                    setIsModalOpen(false);
                    fetchData();
                }else{
                    console.error('Error saving data:', response.statusText);
                }
            }catch(error){
        console.error('Error saving data:', error);
    }
    }
        

    const onSave = async () => {
        const convertedData = convertDataFormat(tableData);
        console.log('Converted Data:', convertedData);
        try {
            const response = await fetch(`http://localhost:8080/api/fspms/composite?code=${marsha}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convertedData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleClick = () => {
        setIsRotated(prev => !prev);
      };
    
    const extractFirstLetter = (text: string) => {
        return text.charAt(0);
    };

    useEffect(() => {
        existingComments();
    }, [marsha]);


      const existingComments = async () => {
        const requestBody = {
            marshaCode: marsha,
            pageName: 'Composite Rooms'
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
                            return 0; // Maintain original order if dates are invalid
                        }
    
                        return dateB.getTime() - dateA.getTime(); // Sort descending
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
        const pageName = 'Composite Rooms';
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
                    <Header />
                </header>

                <div className='px-16 mt-10 relative'>
                    <div className='font-extrabold text-xl mb-5'>{hotel} - <span>({marsha})</span></div>

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
                            <div className="flex items-center justify-center w-6 h-6 border-2 border-indigo-600 rounded-full">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                            </div>
                            <span className="mt-2 text-xs text-[#333333]">INITIAL CONFIGURATION</span>
                            <span className="text-xs text-indigo-600">IN PROGRESS</span>
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

                    <div className='flex mt-5'>
                        <div className='font-bold text-lg place-content-center'>COMPOSITE ROOMS</div>
                        <div className='ml-4 grid place-content-center'>
                            <Tooltip text={getTooltipContentInventoryItemAudit()}>
                                <button aria-label="Tooltip Info" className='hover:cursor-pointer align-middle'>
                                    <Image src='/tooltip.png' alt='Tooltip' width={20} height={20} />
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className='flex justify-end mt-4 mb-6'>
                        <button onClick={() => setIsModalOpen(true)} aria-label="Add Composite Data" className="font-semibold border border-[#A80023] mr-4 px-2 py-1 text-[#A80023] center rounded">
                            <div className='flex'>
                                <div className='place-content-center mr-2'>
                                    <Image src='/add.png' alt='Add' width={23} height={23} />
                                </div>
                                <div>ADD COMPOSITE DATA</div>
                            </div>
                        </button>
                    </div>

                    <div className='overflow-y-auto max-h-[400px] border border-[#F5F5F5] rounded-lg'>
                        <table className="min-w-full bg-white border-collapse border border-[#F5F5F5]">
                            <thead className='text-xs'>
                                <tr className="bg-[#A80023] text-white border-b border-[#F5F5F5]">
                                    <th className="px-6 py-3 w-[20%] border-r border-[#F5F5F5]">COMPOSITE TYPE</th>
                                    <th className="px-6 py-3 w-[20%] border-r border-[#F5F5F5]">LEGACY COMPOSITE ROOM POOL*</th>
                                    <th className="px-6 py-3 w-[10%] border-r border-[#F5F5F5]">SHOPPABLE ATTRIBUTES*</th>
                                    <th className="px-6 py-3 w-[30%] border-r border-[#F5F5F5]">VIRTUAL ROOM</th>
                                    <th className="px-6 py-3 w-[20%] border-r border-[#F5F5F5]">ROOM NUMBER*</th>
                                </tr>
                            </thead>
                           
                            <tbody>
                                {tableData
                                    .map(item => ({
                                        ...item,
                                        virtualRooms: item.virtualRooms.sort((a, b) =>
                                            a.virtualRoom.localeCompare(b.virtualRoom)
                                        )
                                    }))
                                    .flatMap((item, index) =>
                                        item.virtualRooms.flatMap((data, ind) =>
                                            data.roomNumbers.map((roomNumber, numIndex) => (
                                                <tr key={`${index}-${ind}-${numIndex}`} className='border-b border-[#D1CFCF]'>
                                                    {numIndex === 0 && ind === 0 && (
                                                        <>
                                                            <td rowSpan={item.virtualRooms.reduce((sum, vr) => sum + vr.roomNumbers.length, 0)} className="px-6 py-3 border-r border-[#D1CFCF] bg-[#F5F5F5]">{item.compositeType}</td>
                                                            <td rowSpan={item.virtualRooms.reduce((sum, vr) => sum + vr.roomNumbers.length, 0)} className="px-6 py-3 border-r border-[#D1CFCF] ">
                                                                <input
                                                                    type='text'
                                                                    value={item.roomPool}
                                                                    onChange={(e) => handleRoomPoolChange(index, e.target.value)}
                                                                    className=' rounded p-2'
                                                                />
                                                            </td>
                                                            <td rowSpan={item.virtualRooms.reduce((sum, vr) => sum + vr.roomNumbers.length, 0)} className="px-6 py-3 border-r border-[#D1CFCF]">
                                                                <input
                                                                    type='text'
                                                                    value={item.shoppableAttributes.join(', ')}
                                                                    onChange={(e) => handleShoppableAttributesChange(index, e.target.value)}
                                                                    className=' rounded p-2 '
                                                                />
                                                            </td>
                                                        </>
                                                    )}
                                                    {numIndex === 0 && (
                                                        <td rowSpan={data.roomNumbers.length} className="px-6 py-3 border-r border-[#D1CFCF] bg-[#F5F5F5]">{data.virtualRoom}</td>
                                                    )}
                                                    <td className="px-6 py-3 border-r border-[#D1CFCF]">
                                                        <input
                                                            type='number'
                                                            value={roomNumber}
                                                            onChange={(e) => handleRoomNumberChange(index, ind, numIndex, e.target.value)}
                                                            className=' rounded w-full '
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    )}
                            </tbody>







                        </table>
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

                    <div className='flex justify-between w-full mt-10'>
                        <Link href='/components/inventoryItemAuditNonShoppable'>
                            <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</div>
                        </Link>
                        <div className='flex gap-2'>
                            <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer' onClick={onSave}>Save</div>
                            <Link href='/components/inventoryTypeList'>
                                <div>
                                    <button className='text-white rounded-md px-4 py-1.5 bg-[#A80023] hover:bg-[#780019] cursor-pointer'>Continue</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <ModalCompositeRoom 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmitCompositeType={handleAddRow}
                        onSubmitCompositeRoom={handleAddRoom} 
                    />
                </div>
            </HotelProvider>
            </div>
        </>
    );
};

export default Page;
