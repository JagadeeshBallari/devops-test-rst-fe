'use client'
import { HotelProvider, useHotel } from '@/app/context/HotelContext';
import React, { useEffect, useState } from 'react'
import Header from '../header/page';
import Image from 'next/image';
import Tooltip from '@/app/elements/Tooltip';
import { getTooltipContentInventoryItemAudit } from '@/utils/tooltipInventoryItemAudit';
import Link from 'next/link'
import MultiSelectDropdown from '@/app/elements/MultiSelectDropdown';
import { MultiValue, ActionMeta } from 'react-select';
import * as XLSX from 'xlsx';

interface Option {
  value: string;
  label: string;
}

const Page = () => {
    
    interface TableData {
        room: string;    
        connectingRoom1: string;
        connectingRoom2: string;
        connectingRoom3: string;    
        buildingNo: string;
        floorNo: string; 
        roomPool: string;
        configuration: string;
        shoppable: string[];
        roomSize: string;
        marsha: string;
        nonShoppable: string[];
    }

    interface TransformedTableData {
        marshaCode: string;
        room: string;    
        connectingRoom1: string;
        connectingRoom2: string;
        connectingRoom3: string;    
        buildingNo: string;
        floorNo: string; 
        roomPool: string;
        configuration: string;
        shoppable: string[];
        roomSize: string;
        nonShoppable: string[]; 
    }

    interface OptionData {
        specialReqs: { code: string, description: string }[];
        categories: { category: string; shoppableAttributes: { attributeDesc: string; shoppable: string[] }[] }[];
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

    const options: Option[] = [
        { value: 'Hearing Impaired', label: 'Hearing Impaired' },
        { value: 'Corner Room', label: 'Corner Room' },
        { value: 'Accessible Bathroom', label: 'Accessible Bathroom' },
        { value: 'Roll-in shower', label: 'Roll-in shower' },
        { value: 'Broadway View', label: 'Broadway View' },
        { value: 'City View', label: 'City View' },
        { value: 'Large room', label: 'Large room' },
      ];
      

    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string | null>(null);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [optionData, setOptionData] = useState<OptionData | null>(null);
    const [consolidatedOptions, setConsolidatedOptions] = useState<Option[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: MultiValue<Option> }>({});
    const [isRotated, setIsRotated] = useState<Boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [roleLevel, setRoleLevel] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);

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
       
       const fetchData = async () => {
        try {
            if (marsha) {
               
            // Fetch inventory data
            const response = await fetch(`http://localhost:8080/api/fspms/inventory?code=${marsha}`);
            const contentType = response.headers.get('Content-Type');
        
            if (response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log('Data:', data);
    
                    // Transform and sort the data
                    const transformedData = data.map((item: TableData): TransformedTableData => ({
                        marshaCode: item.marsha,
                        room: item.room,
                        connectingRoom1: item.connectingRoom1 || '',
                        connectingRoom2: item.connectingRoom2 || '',
                        connectingRoom3: item.connectingRoom3 || '',
                        buildingNo: item.buildingNo,
                        floorNo: item.floorNo,
                        roomPool: item.roomPool,
                        roomSize: item.roomSize,
                        configuration: item.configuration,
                        shoppable: item.shoppable || [],
                        nonShoppable: item.nonShoppable || []
                    }));
    
                    const sortedData = transformedData.sort((a: { room: string; }, b: { room: string; }) => {
                        const roomA = parseInt(a.room, 10);
                        const roomB = parseInt(b.room, 10);
                        return roomA - roomB;
                    });
                  
                    setTableData(sortedData);
    
                    // Fetch existing inventory data
                    const responseExisting = await fetch(`http://localhost:8080/api/fspms/inventorymarsha?code=${marsha}`);
                    if(responseExisting.ok) {
                        const existingData = await responseExisting.json();
                        console.log('Existing Data:', existingData);
    
                        // Wait until `tableData` is updated
                        setTableData(prevData => {
                            const mergeData = prevData.map((item) => {
                                const existingItem = existingData.find((existingItem: { room: string; }) => existingItem.room === item.room);
                                if (existingItem) {
                                    return { ...item, marshaCode: `${marsha}`, connectingRoom1: existingItem.connectingRoom1, connectingRoom2: existingItem.connectingRoom2, connectingRoom3: existingItem.connectingRoom3 };
                                }
                                return item;
                            });
    
                            console.log('Merge Table Data:', mergeData);
                            return mergeData; // Ensure that the state is updated with merged data
                        });
                        console.log('Updated Table Data:', tableData);
    
                        // Map `shoppable` to `Option` type
                        const initialSelectedOptions = data.map((row: { nonShoppable: string[]; }) => {
                            return row.nonShoppable.map((description: string) => ({
                                value: description,
                                label: description
                            }));
                        });
    
                        const selectedOptionsMap = initialSelectedOptions.reduce((acc: { [x: string]: MultiValue<Option>; }, curr: MultiValue<Option>, idx: number) => {
                            acc[idx] = curr;
                            return acc;
                        }, {} as { [key: number]: MultiValue<Option> });
    
                        setSelectedOptions(selectedOptionsMap);
                    }
                    
                } else {
                    console.error('Received non-JSON response:', await response.text());
                }
            } else {
                console.error('Server error:', await response.text());
            }
        }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
      

    useEffect(() => {
        fetchData();
    }, [marsha]);

    useEffect(() => {
        const fetchAttributeData = async () => {
            if (marsha) {
                try {
                    const response = await fetch(`http://localhost:8080/api/fspms/attributemap?code=${marsha}`);
                    const data = await response.json();
                    if (response.ok) {
                        setOptionData(data);
    
                        // Extract shoppable attributes
                        const allOptions: Option[] = [];
                        data.categories.forEach((category: { shoppableAttributes: any[]; }) => {
                            category.shoppableAttributes.forEach((attr: { attributeDesc: string; }) => {
                                const attributeDesc = attr.attributeDesc;
                                const option = { value: attributeDesc, label: attributeDesc };
                                if (!allOptions.some(o => o.value === option.value)) {
                                    allOptions.push(option);
                                }
                            });
                        });
                        setConsolidatedOptions(allOptions);
                        console.log('Attribute Data:', data); // Debugging line to check attribute data
                        console.log('Consolidated Options:', allOptions); // Debugging line to check consolidated options
                    } else {
                        console.error('Error fetching attribute data:', data);
                    }
                } catch (error) {
                    console.error('Error fetching attribute data:', error);
                }
            }
        };
    
        fetchAttributeData();
    }, [marsha]);

    const handleChange = (selected: MultiValue<Option>, rowIndex: number) => {
        setSelectedOptions(prevState => ({
          ...prevState,
          [rowIndex]: selected
        }));
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
            pageName: 'Inventory Item Audit NonShoppable'
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
        const pageName = 'Inventory Item Audit NonShoppable';
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

            <div className='px-16 mt-10 relative ' >
            <div className='font-extrabold text-xl mb-5'>{hotel} - <span >({marsha})</span></div>

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

            <div className='flex mt-5 '>
                <div className='font-bold text-lg  place-content-center'>PHYSICAL GUESTROOM AUDIT NON SHOPPABLE</div>
                
                <div className='ml-4 grid place-content-center'>
                    <Tooltip text={getTooltipContentInventoryItemAudit()} >    
                        <button className='hover:cursor-pointer align-middle'><Image src='/tooltip.png' alt='Logo' width={20} height={20} className='hover:cursor-pointer  '/></button>
                    </Tooltip>
                </div>
            
            </div>

            <div className='flex justify-end mt-4 mb-6'>
                <Link href={'/components/attributeMapping'}>
                <button className="font-semibold border border-[#A80023] mr-4 px-2 py-1 text-[#A80023] center rounded">
                    <div className='flex'>
                        <div className='place-content-center mr-2'><Image src='/arrow.png' alt='Logo' width={7} height={7}/></div>
                        <div className=''>RETURN TO ATTRIBUTE MAPPING</div>
                    </div>
                </button>
                </Link>
            </div>

            <div className='overflow-y-auto max-h-[400px] border border-[#F5F5F5] rounded-lg'>
                <table className=" min-w-full  bg-white border-collapse border border-[#F5F5F5]">
                    <thead className='text-xs'>
                        <tr className="bg-[#A80023] text-white  border-b border-[#F5F5F5]">
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">ROOM NO.</th>
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">CONNECTING ROOM 1</th>
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">CONNECTING ROOM 2</th>
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">CONNECTING ROOM 3</th>
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">ROOM CONFIGURATION</th>
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">SHOPPABLE ATTRIBUTE&apos;S</th>
                            <th className="px-6 py-3 border-r border-[#F5F5F5]">NON SHOPPABLE ATTRIBUTE&apos;S</th>
                            
                        </tr>
                    </thead>

                    <tbody>
                        { tableData.map((item, index) => (

                        <tr key={index} className= "border-b border-[#F5F5F5] text-center">
                            <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">{item.room}</td>
                            <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">
                               {item.connectingRoom1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">
                                {item.connectingRoom2}  
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">
                                {item.connectingRoom3}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">{item.configuration}</td>
                            <td className="px-4 py-3   border-r bg-[#F5F5F5]">
                                {item.shoppable.map((option, idx) => (
                                    <span key={idx}>
                                        {option}
                                        {idx < item.shoppable.length - 1 && ', '}
                                    </span>
                                ))}
                                </td>
                            <td className="px-4 py-3 whitespace-nowrap border-r bg-white">
                            <MultiSelectDropdown
                                options={consolidatedOptions}
                                value={selectedOptions[index] || []} // This should be an array of Option
                                onChange={(selected, actionMeta) => handleChange(selected, index)}
                            />
                            
                            </td>
                        </tr>
                        ))}
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


            <div className='flex justify-between w-full  mt-10'>
                
                <Link href={'/components/inventoryItemAudit'} >
                    <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</div>
                </Link>
                
                <div className='flex gap-2' >
                    <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Save</div>
                    <Link href={'/components/inventoryTypeList'} >
                    <div>
                        <button  className={`text-white rounded-md px-4 py-1.5 bg-[#A80023] hover:bg-[#780019] cursor-pointer}`}>Continue</button>
                    </div>
                    </Link>
                </div>
            </div>

            </div>


        </HotelProvider>
        </div>
    </>
  )
}

export default Page