import React from 'react'

function ToolInfo(props) {
  return (

  <>


<section className="bg-gray-900 text-white ">
  <div
    className="mx-auto max-w-screen-xl px-4 pt-8 sm:py-12 sm:px-6 lg:pt-16 lg:px-8"
  >
    <div className="mx-72 max-w-7xl text-center">
      
      <h1 className="header_gradient">{props.title}</h1>

      <p className="mt-4 text-gray-300">
      {props.description}
      </p>
    </div>
 
  </div>
</section>

</>
   
  )
}

export default ToolInfo