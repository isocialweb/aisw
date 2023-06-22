import React from 'react'

import NavBar from '@/components/ui/NavBar'
import Footer from '@/components/ui/home/Footer'
import PromptsUi from '@/components/prompts/PromptsUi'


function prompts() {

  return (
    <div>
        <NavBar/>
        <PromptsUi/>
        
        <Footer/>
    </div>
  )
}

export default prompts