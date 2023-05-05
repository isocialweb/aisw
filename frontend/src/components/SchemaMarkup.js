import { useState, useEffect } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';
import jsPDF from 'jspdf';
import { AiFillCopy } from "react-icons/ai";
import { api } from '@/utils/api';


export default function SchemaMarkup() {

const [res, setRes] = useState("")
const [questions, setQuestions] = useState("")
const [buttonState, setButtonState] = useState("default")

const prompt = `Generar el marcado FAQ Page (preguntas Frecuentes o FAQ) Schema para las siguientes preguntas y respuestas:${questions}. Recuerda que el resultado tiene que tener el formato <script type="application/ld+json> { "@context":"https://schema.org". "@type":"FAQPage". "mainEntity":[{"@type":"Question", name....}]} y separado con saltos de linea`

function copyToClipboard() {
  const code = res
  navigator.clipboard.writeText(code)
    .then(() => {
      alert('Código copiado al portapapeles!')
    })
    .catch((error) => {
      console.error('Error al copiar al portapapeles:', error)
    })
}



async function getData() {
    console.time(`Fetch Time`)
    setButtonState("loading")
    try{
    const res = await api("chat", "POST", { prompt });
    console.timeEnd(`Fetch Time`)
    setRes(res.response.replace((/([\}\]\>])/g, '$1\n')))
    console.log(res)
    setButtonState("done")
      }
      catch(error) {
  console.log('Error:', error);
}
  }

  function hadleReload(){
    window.location.reload()
  }

 

 
  


  return (
    <div className='mb-20'>
    <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">
      
        <ToolInfo
        title="Schema Markup"
        description="Construye un schema de marcado de datos extructurados para una FAQ page"/>
      
      
      <textarea type="text" placeholder="Introduce las preguntas para crear el Schema" className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white" onChange={(e) => setQuestions(e.target.value)}/>

     <RenderButton state={buttonState} getData={getData} handleReload={hadleReload}/>
     
     

     {buttonState==="done" ? (<>
     
     
     <div className=" mockup-code w-2/5 mt-10 px-8 text-white rounded-md bg-[#201E1E]">
      <div className="flex justify-end"><button onClick={copyToClipboard} className=" flex flex-row gap-5 align-center justify-center content-center px-4 mb-1 text-[#F16B4A] rounded hover:text-[#E5408E] ">
      Copiar código <AiFillCopy className='text-xl mt-0.5'/>
      </button></div>
     
     
      <div className="" >
      
        <pre >
          <code style={{whiteSpace: 'pre-wrap', color: '#fff'}}>
            {res}
          </code>
        </pre>
 
        </div>
        
        
      </div> 
     
        
        </>
        ):
        ("")}          
    
      </div>

      
  
  </div>
  
  )
  

}