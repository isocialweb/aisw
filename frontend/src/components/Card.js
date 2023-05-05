import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {BsTable, BsCodeSquare, BsReverseListColumnsReverse} from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid';

function Card(props) {

  let Icon;

  switch (props.icon) {
    case 'BsTable':
      Icon = BsTable;
      break;
    case 'BsCodeSquare':
      Icon = BsCodeSquare;
      break;

      case 'BsReverseListColumnsReverse':
        Icon = BsReverseListColumnsReverse;
        break;

   
    default:
      Icon = null;
      break;
  }

  

  return (
    <div>
        
        <Link
  className="block rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-xl sm:p-6 lg:p-8 h-64 transform transition duration-300 hover:scale-105"
  href={props.link}
>

<div className='flex gap-5 items-center justify-between'>

  <div className='flex flex-row gap-5'>

{
    props.tag === "seo" ? (<Image src='/icons/seo.png' width={35} height={30} alt="seo-image" key="seo-image"/>)
    : 
    props.tag === "growwer" ? (<Image src='/icons/growwer.png' width={35} height={30} alt="growwer-image" key="growwer-image"/>)
    :
    props.tag === "ppc" ? (<Image src='/icons/ppc.png' width={35} height={30} alt="ppc-image" key="ppc-image"/>)
    :
    props.tag === "cro" ? (<Image src='/icons/cro.png' width={35} height={30} alt="cro-image" key="cro-image"/>)
    :
    
    ""}
    

    {
    props.tag === "seo" ? (<div className="badge badge-primary mt-2" key="seo-badge" >{props.tag}</div>)
    : 
    props.tag === "ppc" ? (<div className="badge badge-accent mt-2" key="ppc-badge">{props.tag}</div>)
    :
    props.tag === "growwer" ? (<div className="badge badge-warning mt-2" key="growwer-badge">{props.tag}</div>)
    :
    props.tag === "cro" ? (<div className="badge badge-secondary my-3" key="cro-badge">{props.tag}</div>)
    :
    
    
    ""}

</div>
{Icon && <Icon className="text-white" size={20} />}
</div>

<div className='flex flex-row content-center items-center gap-4  '>

  <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
    {props.title}
  </h3>
  
  
   
    </div>

  <p className="mt-4 text-sm text-gray-300">
  {props.description}
  </p>
  
  {/* <Link href={props.link}><button className="text-[#f64600] font-semibold border border-[#f64600] py-2 px-5 rounded-lg mt-5">Generate</button></Link> */}
</Link>



  
</div>
   
  )
}

export default Card