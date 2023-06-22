import Link from "next/link"
import NavBar from "@/components/ui/NavBar"

export default function Custom404() {
    return (
    <>
    <NavBar></NavBar>
    <div className="h-screen w-full bg-[url('/404.png')] bg-no-repeat bg-cover flex content-center items-center "  >
        
        <div className="ml-40">
        <h1 className="text-white text-3xl font-light pb-2"> Sorry I think it isn't your world...</h1>
        <p className="text-white font-light">Come back to yours to be safe</p>
        <Link href='/tools'><button className=" btn mt-8 hover:text-white hover:bg-[#f64600] border-[#f64600] text-[#f64600] bg-transparent">Please, come back</button></Link>
        </div>

    </div>
    </>)
    
    
  }