'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Link from 'next/link'
import { HotelProvider, useHotel } from '@/app/context/HotelContext'
import Image from 'next/image'
import Tooltip from '@/app/elements/Tooltip'
import { getTooltipContent } from '@/utils/tooltipRoomPool'
import ConfirmationModal from '@/app/elements/modalRoomPoolConfirmation'
import { useRouter } from 'next/navigation'

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

const RoomPoolConfiguration = () => {
    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string>('');
    const [pmsType, setPmsType] = useState<string>('');
    const [unitOfMeasure, setUnitOfMeasure] = useState<string>('option1');
    const [tableData, setTableData] = useState<{ marshaCode: string; roomPool: string; configuration: string; size: number }[]>([]);
    const [existingTableData, setExistingTableData] = useState<{ marshaCode: string; pool: string; configuration: string; roomSize: number;  }[]>([]);
    const [dataApi, setDataApi] = useState<{ roomPool: string; configuration: string; unitOfMesure: string}[]>([]);
    const [configOptions, setConfigOptions] = useState<string[]>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
    const [configuration, setConfiguration] = useState<string>('');
    const [size, setSize] = useState<number>(0);
    const [isRotated, setIsRotated] = useState<Boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [roleLevel, setRoleLevel] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);
   
    const router = useRouter();
  
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
        setPmsType(selectedHotel.pmsType);
    }, [selectedHotel]);

    useEffect(() => {
        validateForm();
    }, [tableData, unitOfMeasure]);

    useEffect(() => {
        const fetchExistingData = async () => {
            if (marsha) {
                try {
                    const response = await fetch(`http://localhost:8080/api/fspms/roomsetupmarsha?code=${marsha}`);
                    const data = await response.json();
                    setExistingTableData(data);
                    console.log('Existing Data:', data); // Debugging line to check existing data
                } catch (error) {
                    console.error('Error fetching existing data:', error);
                }
            }
        };
        fetchExistingData();
    }, [marsha]);

    useEffect(() => {
        const fetchRoomPoolData = async () => {
            if (marsha) {
                try {
                    const response = await fetch(`http://localhost:8080/api/fspms/roomsetupconfig?code=${marsha}`);
                    const data = await response.json();
                    
                    console.log('Fetched Data:', data); // Debugging line to check fetched data

                    // Ensure dataApi is an array before setting it
                    if (Array.isArray(data.roomPool) && Array.isArray(data.configuration)) {
                        setDataApi(data.roomPool.map((pool: any) => ({
                            roomPool: pool,
                        })));
                        setConfigOptions(data.configuration);
                        setUnitOfMeasure(data.unitOfMesure); // Set unit of measure
                    } else {
                        console.error('Invalid data format:', data);
                    }
                } catch (error) {
                    console.error('Error fetching room pool data:', error);
                }
            } else {
                console.error('Marsha is not defined');
            }
        };

        fetchRoomPoolData();
    }, [marsha]);

    useEffect(() => {
        if (Array.isArray(dataApi) && dataApi.length > 0) {
            const initialData = dataApi.map(data => ({
                marshaCode: marsha,
                roomPool: data.roomPool,
                configuration: existingTableData.find(item => item.pool === data.roomPool)?.configuration || '',
                size: existingTableData.find(item => item.pool === data.roomPool)?.roomSize || 0
            }));
            setTableData(initialData);
        }
    }, [dataApi]);

    const handleRoomConfigChange = (index: number, newValue: string) => {
        setTableData(prevTableData => {
            const updatedData = [...prevTableData];
            if (index >= 0 && index < updatedData.length) {
                updatedData[index] = { ...updatedData[index], configuration: newValue };
            }
            return updatedData;
        });
    };
    
    const handleSizeChange = (index: number, newValue: number) => {
        setTableData(prevTableData => {
            const updatedData = [...prevTableData];
            if (index >= 0 && index < updatedData.length) {
                updatedData[index] = { ...updatedData[index], size: newValue };
            }
            return updatedData;
        });
    };
    

    const handleUnitOfMeasureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUnitOfMeasure(event.target.value);
    };

    const handleSubmit = () => {
        const invalidConfigurations = tableData.filter(item =>
            item.configuration === 'Room' || 
            item.configuration === 'Tent' ||
            item.configuration === 'Studio Suite'
        );

        if (invalidConfigurations.length === 0) {
            setIsConfirmationOpen(true);
        } else {
            handleSave();
            router.push('/components/attributeMapping');
            console.log(tableData);
        }

        console.log('Form submitted successfully!');
    };

    const handleConfirm = () => {
        handleSave();
        router.push('/components/attributeMapping');
        console.log(tableData);
    };

    const handleCancel = () => {
        setIsConfirmationOpen(false);
    };

    const validateForm = () => {
        const isValid = tableData.every(item => item.configuration && item.size > 0) && unitOfMeasure !== '';
        setIsFormValid(isValid);
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
            pageName: 'Room Pool'
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
        const pageName = 'Room Pool';
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

    const handleSave = async () => {
        const formattedData = tableData.map(item => ({
            marshaCode: item.marshaCode,
            pool: item.roomPool, // Ensure this matches the expected field name
            configuration: item.configuration,
            roomSize: item.size.toString() // Convert number to string
        }));
    
        console.log("Formatted Data:", formattedData);
    
        try {
            const response = await fetch(`http://localhost:8080/api/fspms/upload/roompool?code=${marsha}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
    
            const responseText = await response.text(); // Read response as text
            console.log('Response text:', responseText);
    
            if (response.ok) {
                // Handle plain text response
                console.log('Data saved successfully:', responseText);
            } else {
                console.error('Failed to save data:', responseText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    return (
        <>
            <div className='bg-[#F9F9F9] min-h-screen'>
            <HotelProvider>
                <header>
                    <Header/>
                </header>
                
                <div className='px-16 mt-10 relative '>
                    
                    <div className='font-extrabold text-xl mb-5 '>{hotel} - <span>({marsha})</span></div>

                    <div className='flex justify-evenly mb-4 '>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-6 h-6 bg-[#00b300] rounded-full">
                                <Image src='/check.png' alt='Logo' width={15} height={25}/>
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
                        <div className='font-bold text-lg place-content-center'>LEGACY ROOM POOL CONFIGURATION & ROOM SIZE</div>
                        
                        <div className='ml-4 grid place-content-center'>
                            <Tooltip text={getTooltipContent()}>
                                <button className='hover:cursor-pointer align-middle'><Image src='/tooltip.png' alt='Logo' width={20} height={20} className='hover:cursor-pointer '/></button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Room Pool Table */}
                    <div className="mt-4 w-full mx-auto flex flex-col justify-center">
                        <div className='flex gap-2 justify-end mb-4'>
                            <div className='mb-2'>
                                <span className="font-bold">Unit of Measure : </span>
                                <select className="px-2 py-1.5 border border-[#D1CFCF] rounded" value={unitOfMeasure} onChange={handleUnitOfMeasureChange}>
                                    <option disabled key={'option 1'} value={'option1'} className='text-[#D1CFCF]'>Select Unit</option>
                                    <option key={'sqft'} value={'sqft'}>Square Feet (sqft)</option>
                                    <option key={'sqmt'} value={'sqmt'}>Square Meters (sqmt)</option>
                                </select>
                            </div>
                        </div>

                        <div className='overflow-y-auto max-h-[400px] border border-[#F5F5F5] rounded-lg'>
                            <table className="min-w-full bg-white border-collapse border border-[#F5F5F5]">
                                <thead>
                                    <tr className="bg-[#A80023] text-white border-b border-[#F5F5F5]">
                                        <th className="px-6 py-3 border-r border-[#F5F5F5]">ROOM POOL</th>
                                        <th className="px-6 py-3 border-r border-[#F5F5F5]">ROOM CONFIGURATION*</th>
                                        <th className="px-6 py-3">SIZE*</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(tableData) && tableData.map((row, index) => (
                                        <tr key={index} className="border-b border-[#F5F5F5] text-center">
                                            <td className="px-4 py-3 whitespace-nowrap border-r bg-[#EEEEEE]">{row.roomPool}</td>
                                            <td className="px-4 py-3 whitespace-nowrap border-r border-[#F5F5F5]">
                                                <select
                                                    className="px-2 py-1 border border-[#D1CFCF] rounded"
                                                    value={row.configuration}
                                                    onChange={(e) => handleRoomConfigChange(index, e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled>Select Room Configuration</option>
                                                    {configOptions.map((config, index1) => (
                                                        <option key={index1} value={config}>{config}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 content-center">
                                                <input
                                                    type="number"
                                                    className="px-2 py-1 border border-[#F5F5F5] rounded"
                                                    value={row.size}
                                                    onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
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
                        <Link href={'/components/status'}>
                            <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</div>
                        </Link>
                        <div className='flex gap-2'>
                            <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer' onClick={handleSave}>Save</div>
                            <div>
                                <button onClick={handleSubmit} disabled={!isFormValid} className={`text-white rounded-md px-4 py-1.5 ${isFormValid ? 'bg-[#A80023] hover:bg-[#780019]' : 'bg-[#D1CFCF] cursor-not-allowed'}`}>Continue</button>
                            </div>
                        </div>
                    </div>

                   
                    <ConfirmationModal
                        isOpen={isConfirmationOpen}
                        message="Are you sure you want to submit an All Suite Room Configuration?"
                        onClose={handleCancel}
                        onConfirm={handleConfirm}
                    />
                </div>
            </HotelProvider>
            </div>
        </>
    );
}

export default RoomPoolConfiguration;
