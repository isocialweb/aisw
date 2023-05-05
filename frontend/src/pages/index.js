import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Login from '../components/ui/home/login'
import BlockHome from '../components/ui/home/BlockHome'
import Footer from '@/components/ui/home/Footer'
function Home() {
  return (
    <div className='bg-black'>
    <Login/>
    <BlockHome/>
    <Footer/>
    
</div>
    
  )
}

export default Home