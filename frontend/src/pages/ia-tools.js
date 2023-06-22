import Card from "@/components/ui/Card"
import NavBar from "@/components/ui/NavBar"
import tools from "../data/tools.json"
import Footer from "@/components/ui/home/Footer"
import { useState } from "react"

function Tools() {
  const [selectedTag, setSelectedTag] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");

  let filteredTools = tools.filter((tool) => tool.available);
  
  if (selectedTag !== "Todos") {
    filteredTools = filteredTools.filter((tool) => tool.tag === selectedTag);
  }

  if (selectedType !== "Todos") {
    filteredTools = filteredTools.filter((tool) => tool.type === selectedType);
  }

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
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
              <h1 className="header_gradient mb-10">Aisw Tools</h1>
            </div>
            <div className="flex justify-end">
                <select
                  id="tagSelect"
                  value={selectedTag}
                  onChange={handleTagChange}
                  className="mt-1.5 w-full max-w-xs rounded-lg bg-[#111827] border-gray-300 text-white sm:text-sm"
                >
                  <option value="Todos">Todos los departamentos</option>
                  {[...new Set(tools.map((tool) => tool.tag))].map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <select
                  id="typeSelect"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="mt-1.5 ml-4 w-full max-w-xs rounded-lg bg-[#111827] border-gray-300 text-white sm:text-sm"
                >
                  <option value="Todos">IA & Not IA Tools</option>
                  <option value="iaTool">IA</option>
                  <option value="noniaTool">No IA</option>
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
                    type={tool.type}
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
