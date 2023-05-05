import Card from "@/components/Card"
import NavBar from "@/components/NavBar"
import tools from "../data/tools.json"
import Footer from "@/components/ui/home/Footer"




function Tools() {
  const availableTools = tools.filter(tool=>tool.available)
  
return (
    <>
    <div > 
    <NavBar></NavBar>

    <section className="bg-gray-900 text-white min-h-s">
  <div
    className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8"
  >
    <div className="mx-auto max-w-lg text-center">
      <h1 className="header_gradient">Aisw Tools</h1>

      <p className="mt-4 text-gray-300">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur
        aliquam doloribus nesciunt eos fugiat. Vitae aperiam fugit consequuntur
        saepe laborum.
      </p>
    </div>

    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {availableTools.map(tool=>(<Card link={tool.link} title={tool.title} description={tool.description} tag={tool.tag} icon={tool.icon}  key={tool.index} />))}

      
    </div>
  </div>
</section>

    </div>
    <Footer/>
    
    </>
  )
}

export default Tools