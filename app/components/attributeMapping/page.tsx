'use client'
import { HotelProvider, useHotel } from '@/app/context/HotelContext'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Tooltip from '@/app/elements/Tooltip'
import { getTooltipContentAttributeMapping } from '@/utils/tooltipAttributeMapping'
import ModalAttribute from '@/app/elements/modalAddAttribute'


const Page = () => {
    
    interface PostTableEntry {
        marshaCode: string;
        code: string;
        description: string;
        category: string;
        shoppable: string;
        attributes?: string[]; // Add attributes property if it's optional
    }
    
    type PostTable = PostTableEntry[];
    
    interface existingTableData {
        marshaCode: string;
        code: string;
        description: string;
        category: string;
        shoppable: string;
        attributes: string;
        
    }

    interface TableData {
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
    
    
    
    const [hotel, setHotel] = useState<string | null>(null);
    const [marsha, setMarsha] = useState<string | null>(null);
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [initialTableData, setInitialTableData] = useState<existingTableData[]>([]);
    const [postTable, setPostTable] = useState<PostTable>([]);
    const [existingPostTable, setExistingPostTable] = useState<existingTableData[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<{ [key: number]: string }>({});
    const [filteredAttributes, setFilteredAttributes] = useState<{ [key: number]: { attributeDesc: string; shoppable: string[] }[] }>({});
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: number]: string }>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
    }, [selectedHotel]);

    useEffect(() => {
        const existingTableData = async () => {
            if (marsha) {
                try {
                    const response = await fetch(`http://localhost:8080/api/fspms/attributemarsha?code=${marsha}`);
                    const data = await response.json();
                    if (response.ok) {
                        // Ensure the data matches the ExistingTableData interface
                        const formattedData: existingTableData[] = data.map((entry: any) => ({
                            marshaCode: entry.marshaCode || '',  // Ensure marshaCode is included
                            code: entry.code,
                            description: entry.description,
                            category: entry.category,
                            shoppable: entry.shoppable,
                            attributes: entry.attributes
                        }));
                        setExistingPostTable(formattedData);
                    }
                } catch (error) {
                    console.error('Error fetching existing data:', error);
                }
            }
        };
        existingTableData();
    }, [marsha]);

    useEffect(() => {
        const fetchAttributeData = async () => {
            if (marsha) {
                try {
                    const response = await fetch(`http://localhost:8080/api/fspms/attributemap?code=${marsha}`);
                    const data = await response.json();
                    if (response.ok) {
                        setTableData(data);
                        console.log('Attribute Data:', data); // Debugging line to check attribute data
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

    useEffect(() => {
        if (tableData && existingPostTable) {
            const initializeTableData = (tableData: TableData, existingPostTable: existingTableData[]) => {
                if (!tableData || !existingPostTable) return [];

                return tableData.specialReqs.map(req => {
                    const existingEntry = existingPostTable.find(entry => entry.code === req.code);
                    return {
                        ...req,
                        category: existingEntry ? existingEntry.category : '',
                        attributes: existingEntry ? existingEntry.attributes : '',
                        shoppable: existingEntry ? existingEntry.shoppable : '',
                        marshaCode: existingEntry ? existingEntry.marshaCode : '',
                    };
                });
            };

            const initialData = initializeTableData(tableData, existingPostTable);
            setInitialTableData(initialData);

            const selectedCategoriesTemp: { [key: number]: string } = {};
            const selectedAttributesTemp: { [key: number]: string } = {};
            const filteredAttributesTemp: { [key: number]: { attributeDesc: string; shoppable: string[] }[] } = {};

            initialData.forEach((data, index) => {
                selectedCategoriesTemp[index] = data.category;
                selectedAttributesTemp[index] = data.attributes;

                const category = tableData.categories.find(cat => cat.category === data.category);
                if (category) {
                    filteredAttributesTemp[index] = category.shoppableAttributes.map(attr => ({
                        ...attr,
                        shoppable: Array.isArray(attr.shoppable) ? attr.shoppable : [attr.shoppable]
                    }));
                } else {
                    filteredAttributesTemp[index] = [];
                }
            });

            setSelectedCategories(selectedCategoriesTemp);
            setSelectedAttributes(selectedAttributesTemp);
            setFilteredAttributes(filteredAttributesTemp);
        }
    }, [tableData, existingPostTable]);



    const addAttributeMapping = (newAttribute: { specialReqs: { code: string, description: string }[]; categories: { category: string; shoppableAttributes: { attributeDesc: string; shoppable: string[] }[] }[] }) => {
        setTableData(prevTableData => {
            if (!prevTableData) {
                return newAttribute;
            }
            return {
                specialReqs: [...prevTableData.specialReqs, ...newAttribute.specialReqs],
                categories: [...prevTableData.categories, ...newAttribute.categories]
            };
        });
    };

    const handleCategoryChange = (rowIndex: number, category: string) => {
        setSelectedCategories(prevState => ({
            ...prevState,
            [rowIndex]: category
        }));

        const selectedCategory = tableData?.categories.find(cat => cat.category === category);
        const attributes = selectedCategory ? selectedCategory.shoppableAttributes.map(attr => ({
            ...attr,
            shoppable: Array.isArray(attr.shoppable) ? attr.shoppable : [attr.shoppable] // Convert to array if not already
        })) : [];

        setFilteredAttributes(prevState => ({
            ...prevState,
            [rowIndex]: attributes
        }));

        setSelectedAttributes(prevState => ({
            ...prevState,
            [rowIndex]: ''
        }));
    };

    const handleAttributeChange = (rowIndex: number, attributeDesc: string) => {
        setSelectedAttributes(prevState => ({
            ...prevState,
            [rowIndex]: attributeDesc
        }));

        // Reset shoppable value when attribute changes
        setFilteredAttributes(prevState => ({
            ...prevState,
            [rowIndex]: prevState[rowIndex]?.map(attr => ({
                ...attr,
                shoppable: Array.isArray(attr.shoppable) ? attr.shoppable : [attr.shoppable]
            })) || []
        }));
    };

    const handleShoppableChange = (rowIndex: number, newValue: string) => {
        setFilteredAttributes(prevState => ({
            ...prevState,
            [rowIndex]: prevState[rowIndex]?.map(attr => 
                attr.attributeDesc === selectedAttributes[rowIndex] 
                    ? { ...attr, shoppable: [newValue] } // Update shoppable value for the selected attribute
                    : attr
            ) || []
        }));
    };    


    const onSubmit = async () => {
        try {
            // Transform the data to match the expected format
            const transformedData = tableData?.specialReqs.map((req, index) => {
                const category = selectedCategories[index] || '';
                const attribute = selectedAttributes[index] || '';
                const shoppableValue = filteredAttributes[index]?.find(attr => attr.attributeDesc === attribute)?.shoppable[0] || '';
    
                return {
                    marshaCode: marsha || '',
                    code: req.code,
                    description: req.description,
                    category: category,
                    attributes: attribute,
                    shoppable: shoppableValue
                };
            }) || [];
    
            console.log('Transformed Data:', transformedData); // Log the data for debugging
    
            // Send the request
            const response = await fetch(`http://localhost:8080/api/fspms/attributeaudit?code=${marsha}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transformedData)
            });
    
            // Check response content type
            const contentType = response.headers.get('Content-Type') || '';
            let responseText: string;
    
            if (response.ok) {
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log('Response data:', data);
                } else if (contentType.includes('text/plain')) {
                    // Handle plain text response
                    responseText = await response.text();
                    console.log('Plain text response:', responseText);
                    // You might want to handle this response or show a success message
                } else {
                    // Handle other content types
                    responseText = await response.text();
                    console.error('Unexpected response type:', contentType);
                    console.error('Response text:', responseText);
                    throw new Error(`Unexpected response type: ${contentType}`);
                }
            } else {
                responseText = await response.text();
                console.error('Error response:', responseText);
                throw new Error(`Server error: ${responseText}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
        
        if (!marsha) return;
        
        const requestBody = {
            marshaCode: marsha,
            pageName: 'Attribute Mapping'
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
        const pageName = 'Attribute Mapping';
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
                        <div className='font-bold text-lg place-content-center'>PRODUCT CATALOG ATTRIBUTE MAPPING</div>

                        <div className='ml-4 grid place-content-center'>
                            <Tooltip text={getTooltipContentAttributeMapping()}>
                                <button className='hover:cursor-pointer align-middle'><Image src='/tooltip.png' alt='Logo' width={20} height={20} className='hover:cursor-pointer' /></button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className='flex justify-end mt-4 mb-6'>
                        <button className="font-semibold border border-[#A80023] px-2 py-1 text-[#A80023] rounded" onClick={() => setIsModalOpen(true)}>+ ADD NEW ATTRIBUTE</button>
                    </div>

                    <div className='overflow-y-auto max-h-[400px] border border-[#F5F5F5] rounded-lg'>
                        <table className="min-w-full bg-white border-collapse border border-[#F5F5F5]">
                            <thead>
                                <tr className="bg-[#A80023] text-white border-b border-[#F5F5F5]">
                                    <th className="px-6 py-3 border-r border-[#F5F5F5]">CODE</th>
                                    <th className="px-6 py-3 border-r border-[#F5F5F5]">DESCRIPTION</th>
                                    <th className="px-6 py-3 border-r border-[#F5F5F5]">CATEGORY*</th>
                                    <th className="px-6 py-3 border-r border-[#F5F5F5]">ATTRIBUTE*</th>
                                    <th className="px-6 py-3">SHOPPABLE*</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData && Array.isArray(tableData.specialReqs) && Array.isArray(tableData.categories) && tableData.specialReqs.map((req, index) => (
                                    <tr key={index} className="border-b border-[#F5F5F5] text-left">
                                        <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">{req.code}</td>
                                        <td className="px-4 py-3 whitespace-nowrap border-r bg-[#F5F5F5]">{req.description}</td>
                                        <td className="px-4 py-3 whitespace-nowrap border-r bg-white">
                                            <select
                                                className="w-full h-8 border border-[#F5F5F5] rounded"
                                                onChange={(e) => handleCategoryChange(index, e.target.value)}
                                                value={selectedCategories[index] || ""}
                                            >
                                                <option value="">Select Category</option>
                                                {tableData.categories
                                                    .filter(category => category.category) // Filter out empty categories
                                                    .map((category, catIndex) => (
                                                        <option key={catIndex} value={category.category}>
                                                            {category.category}
                                                        </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap border-r bg-white">
                                            <select
                                                className="w-full h-8 border border-[#F5F5F5] rounded"
                                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                                                value={selectedAttributes[index] || ""}
                                            >
                                                <option value="">Select Attribute</option>
                                                {filteredAttributes[index]?.filter(attr => attr.attributeDesc) // Filter out empty attributes
                                                    .map((attribute, attrIndex) => (
                                                        <option key={attrIndex} value={attribute.attributeDesc}>
                                                            {attribute.attributeDesc}
                                                        </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap border-r bg-white">
                                            {filteredAttributes[index]?.find(attr => attr.attributeDesc === selectedAttributes[index]) ? (
                                                filteredAttributes[index].find(attr => attr.attributeDesc === selectedAttributes[index])!.shoppable.length === 1 ? (
                                                    // Display value as text if only one option
                                                    <span>{filteredAttributes[index].find(attr => attr.attributeDesc === selectedAttributes[index])!.shoppable[0]}</span>
                                                ) : (
                                                    // Display dropdown for multiple options
                                                    <select
                                                        className="w-full h-8 border border-[#F5F5F5] rounded"
                                                        value={filteredAttributes[index].find(attr => attr.attributeDesc === selectedAttributes[index])!.shoppable[0]} // Set current value
                                                        onChange={(e) => handleShoppableChange(index, e.target.value)} // Update state on change
                                                    >
                                                        <option value="">Select Value</option>
                                                        {filteredAttributes[index].find(attr => attr.attributeDesc === selectedAttributes[index])!.shoppable
                                                            .filter(value => value) // Filter out empty shoppable values
                                                            .map((value, valIndex) => (
                                                                <option key={valIndex} value={value}>
                                                                    {value}
                                                                </option>
                                                            ))}
                                                    </select>
                                                )
                                            ) : (
                                                // Dropdown for when no attribute is selected
                                                <select
                                                    className="w-full h-8 border border-[#F5F5F5] rounded"
                                                    value=""
                                                    onChange={(e) => handleShoppableChange(index, e.target.value)} // Update state on change
                                                >
                                                    <option value="">Select Value</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            )}
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

                    <div className='flex justify-between w-full mt-10'>
                        <Link href={'/components/roomPool'}>
                            <div className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Back</div>
                        </Link>

                        <div className='flex gap-2'>
                            <div onClick={onSubmit} className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Save</div>
                            <Link href={'/components/inventoryItemAudit'}>
                                <div>
                                    <button onClick={onSubmit} className={`text-white rounded-md px-4 py-1.5 ${isFormValid ? 'bg-[#A80023] hover:bg-[#780019]' : 'bg-[#D1CFCF] cursor-not-allowed'}`}>Continue</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <ModalAttribute
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={addAttributeMapping}
                    />
                </div>
            </HotelProvider>
            </div>
        </>
    );
};

export default Page;
