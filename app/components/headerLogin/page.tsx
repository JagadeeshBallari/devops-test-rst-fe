import Image from 'next/image'
import React from 'react'

const HeaderLogin = () => {
  return (
    <>
        <div className="flex flex-row bg-slate-200 shadow-xl p-3">
          <div className="pr-4">
            <Image priority={true} src="/logo.png" alt="Logo" width={100} height={25} />
          </div>
          <div className="font-medium mt-2">ROOM SETUP TOOL</div>
        </div>
    </>    
)
}

export default HeaderLogin