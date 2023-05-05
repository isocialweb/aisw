import React from 'react'

function Footer() {
  return (
    <div className="mt-auto">
 



     <footer className="w-full p-8">
     <hr className="my-8 border-blue-gray-50" />
       <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 px-10  text-center text-white md:justify-between">
         <img src="https://www.isocialweb.agency/wp-content/uploads/2021/05/iSocialWeb-Agency-Logo.png.webp" width={130} height={130}  />
         <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
           <li
            
               as="a"
               href="'https://www.isocialweb.agency/'"
               color="blue-gray"
               className="font-normal transition-colors hover:text-[#E5408E] focus:text-[#E5408E]"
             >
               IsocialWeb Agency
             
           </li>
           <li
             
               as="a"
               href="https://growwer.com/"
               color="blue-gray"
               className="font-normal transition-colors hover:text-[#E5408E] focus:text-[#E5408E]"
             >
               Growwer
             
           </li>
           <li
             
               as="a"
               href="#"
               color="https://www.newsletter.isocialweb.agency/subscribe"
               className="font-normal transition-colors hover:text-[#E5408E] focus:text-[#E5408E]"
             >
               AISW Newsletter
             
           </li>
          
         </ul>
       </div>
       
       <p className="text-[#E5408E] text-m text-center mt-5">Copyright © 2023 - All right reserved </p>
     </footer>
   
 
    
      
      
      
      
      
      </div>
  )
}

export default Footer