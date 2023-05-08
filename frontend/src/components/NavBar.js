import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { logout } from '@/utils/localStorageUtils'
import { tokenDecoder } from '@/utils/localStorageUtils'
import { api } from '@/utils/api'


function NavBar() {

const [data,setData] =  useState([])

const id = tokenDecoder()



useEffect(() => {
  async function getData() {
  const response = await api(`user/${id}`)
 
  setData (response)

}
 getData()
}, [])


  return (
    <div className=" navbar  bg-clip-padding backdrop-filter backdrop-blur-sm
    px-10 z-50 ">
  <div className="flex-1">
    <Link href="/tools">
    <Image src="/aisw.png"
     alt="AISW Logo"
     width={90}
     height={90}
     className="w-24 h-auto"
      
      />
      </Link>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1 font-medium text-white bg-transparent">
      <li><Link href="/tools">Tools</Link></li>
      <li><Link href="/suggestions">Suggestions</Link></li>
      <li><a>Prompts</a></li>
      <li></li>
      
    </ul>
  </div>
  <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src="https://res.cloudinary.com/dkxlwv844/image/upload/v1683029159/hero_3_ql64bf.png" width={20} height={20} />
        </div>
      </label>
      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-slate-500 rounded-box w-52">
        <p className='pl-4 py-3 text-black font-bold text-xs'>Hola {data.name}</p>
       
        <li><a onClick={logout}>Logout</a></li>
      </ul>
    </div>
</div>
  )
}

export default NavBar