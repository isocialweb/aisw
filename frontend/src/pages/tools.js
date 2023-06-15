import Card from "@/components/Card"
import NavBar from "@/components/NavBar"
import tools from "../data/tools.json"
import Footer from "@/components/ui/home/Footer"
import { useState } from "react"




function Tools() {
  
  const [selectedTag, setSelectedTag] = useState("Todos")

  const filteredTools =
  selectedTag === "Todos"
    ? tools.filter((tool) => tool.available)
    : tools.filter((tool) => tool.available && tool.tag === selectedTag);

    const handleTagChange = (event) => {
      setSelectedTag(event.target.value);
    };
  
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

     
    </div>
    <div className="flex justify-end">
              
    
                <select
                  id="tagSelect"
                  value={selectedTag}
                  onChange={handleTagChange}
                  className="mt-1.5 w-full max-w-xs rounded-lg bg-[#111827] border-gray-300 text-white sm:text-sm"
                >
                  
                  <option value="Todos">Todos</option>
                  {[...new Set(tools.map((tool) => tool.tag))].map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>


    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {filteredTools.map((tool) => (
                <Card
                  link={tool.link}
                  title={tool.title}
                  description={tool.description}
                  tag={tool.tag}
                  icon={tool.icon}
                  key={tool.index}
                />
              ))}

      
    </div>
  </div>
</section>

    </div>
    <Footer/>
    
    </>
  )
}

export default Tools