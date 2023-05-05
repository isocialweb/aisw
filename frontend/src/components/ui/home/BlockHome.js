import React from 'react'

import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import tools from "../../../data/tools.json"



const availableSeoTools = tools.filter(tool=>tool.tag == 'seo')



export default function BlockHome() {
  return (

    <>

    <div className="relative isolate overflow-hidden py-24 sm:py-32 h-screen mx-10 mb-10 rounded-3xl">
      <img
        src="/background_block.png"
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
      />


      <div className="mx-auto max-w-7xl px-10 py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">What are you <span className="text-[#E5408E]">looking for?</span></h2>
          <p className="mt-6 text-lg leading-6 text-gray-300">
          AiSocialWeb is your ultimate solution for all your SEO and marketing needs. With the power of artificial intelligence at your fingertips, you can now streamline your daily tasks and achieve maximum results with minimum effort. Our cutting-edge tools are designed to make your work easier, faster, and more efficient, so you can focus on what really matters - growing your business.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">

          <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">IA Tools</dt>
                <dd className="text-3xl font-bold leading-9 tracking-tight text-[#E5408E]">{tools.filter(tool=>tool.available).length}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">SEO Tools</dt>
                <dd className="text-3xl font-bold leading-9 tracking-tight text-[#E5408E]">{tools.filter(tool=>tool.available && tool.tag == 'seo').length}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">Growwer Tools</dt>
                <dd className="text-3xl font-bold leading-9 tracking-tight text-[#E5408E]">{tools.filter(tool=>tool.available && tool.tag == 'growwer').length}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">Tools in progress</dt>
                <dd className="text-3xl font-bold leading-9 tracking-tight text-[#E5408E]">New</dd>
              </div>
              
            
          </dl>
        </div>
      </div>
    </div>
    </>
  )
}
