import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

interface Props {
    title: string
    content: string[];
    pathname: string
}
const Accordian : React.FC<Props> = ({title, content=[], pathname}) => {
    
    const [open, setOpen] = useState(true)

    const handleClick = () => {
        setOpen(!open)
    }
    return (
    <>
       
            <div className='mb-2.5  p-2 bg-slate-100 rounded-lg '>
                
                <div className='flex justify-between'>
                <div className='p-2'>
                <div className='flex'>
                    <div className='font-medium text-lg'>{title}</div>
                    <div className='ml-2 mt-1'><Image src='/edit.png' alt='Logo' width={18} height={18} className='hover:cursor-pointer '/></div>
                </div>

                {open === false?
                <div className='text-sm text-red-500 mt-1 underline cursor-pointer' onClick={() => setOpen(true)}>View associated attributes</div>:
                <div className='text-sm text-red-500 mt-1 underline cursor-pointer' onClick={() => setOpen(false)}>Hide associated attributes</div>}
                
                </div>

                {pathname === '/components/confirmInventory' ?
                <div>
                    <Link href={'/components/attributeMapping'}><button className='border border-[#A80023] text-[#A80023] px-4 py-1.5 rounded mr-2 cursor-pointer'>Revise</button></Link>
                    </div>:<div></div>}
                </div>
                <div>
                    
                    {open === true?
                    <div className='ml-3'>
                        <div className='text-sm font-semibold mt-2 '>Shopable Attributes: </div>
                        
                        <div className='text-sm ml-8'>
                            <ul className='list-disc'>
                                {content.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        
                    </div>
                    :
                    <div></div>}
                    
                </div>

                
            </div>
    </>
  )
}

export default Accordian