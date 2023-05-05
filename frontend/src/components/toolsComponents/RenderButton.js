import React from 'react'
import { useState } from 'react'

function RenderButton(props) {

    

  return (
    <div>
        {props.state==="default" && (<button className="btn px-36 hover:text-white hover:bg-[#E5408E] border-[#E5408E] text-[#E5408E] bg-transparent" onClick={props.getData}>
        Send Query
      </button>)}
      {props.state==="loading" && (<><button className="btn loading btn-ghost text-[#E5408E]">
        Fetching, please wait. 
      </button>
      {typeof props.fetchCount === 'number' && props.fetchIndex !== null && props.fetchIndex !== undefined && 
      (
      <>
      <p className='text-[#E5408E] font-bold text-l text-center'>STEP {props.fetchCount+1} OF {props.fetchIndex}</p>
      <progress class="progress progress-secondary w-56 bg-[#212d47]" value={props.fetchCount+1} max={props.fetchIndex}></progress>
      </>
      
      )}
      </>)}
      {props.state==="done" && (<div><button className="btn px-14 text-[#F16B4A] bg-transparent border-none hover:bg-transparent hover:cursor-default " >
        BOOM! Fetch Complete!  
      </button> <button className="btn px-16 btn-ghost text-[#E5408E] border-[#E5408E] text-[##E5408E] hover:bg-[#E5408E] hover:text-black" onClick={props.handleReload}>
        Click To Reload and create a new query
      </button></div>)}
      {props.state==="error" && (<div><button className="btn px-24 text-[#F16B4A] bg-transparent border-none hover:bg-transparent hover:cursor-default" >
        Ups! Somethings happens...reload and try again
      </button><button className="btn px-16 btn-ghost text-[#E5408E] border-[#E5408E] text-[##E5408E] hover:bg-[#E5408E] hover:text-black" onClick={props.handleReload}>
        Click To Reload and try again
      </button></div>)}

    </div>
  )
}

export default RenderButton