import { useState } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';

export default function OpportunityKw() {

const [res, setRes] = useState("")
const [keywords,setKeywords] = useState ("")
const cleanKeywords = keywords.split(/\r?\n/)
const [url, setUrl] = useState("")
const [buttonState, setButtonState] = useState("default")

const prompt = `Dime si puedo aprovechar alguna de estas Palabras clave:${cleanKeywords}, para mejorar 
el contenido de ${url} Manteniendo el contenido original, reescribe 
las partes que creas interesantes pensando en el posicionamiento orgánico y dime el número de párrafo donde sugieres el cambio. Sólo utiliza aquellas que no se encuentren en el texto y que puedan ayudar a posicionarlo mejor.  Devuelveme la respuesta en formato HTML con saltos de linea para cada párrafo y usando encabezados cuyo className sea text-2xl font-bold mb-5 mt-5. También ten en cuenta que si muestras una numeración tipo 1.'texto' 2.'texto' tienes que ser devuelta en una ol li `



function getData() {
    setButtonState("loading")
    fetch('/api/chatGPT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRes(data.response)
        console.log(data)
        setButtonState("done")
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  function hadleReload(){
    window.location.reload()
  }


  return (
    <div className='mb-20'>
    <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">
      
        <ToolInfo
        title="Keywords de oportunidad"
        description="Esta función mejora el contenido de un post en base a un listado de KW de oportunidad que le demos. Introduce el listado de KW y después la url del post a analizar"/>
      
      <textarea placeholder="Introduce un listado de keywords. Las kw deben ser una por linea" className="w-3/5 text-white textarea textarea-bordered"
        onChange={(e) => setKeywords(e.target.value)}
      />
      <input type="text" placeholder="Introduce la URL a analizar" className="w-3/5 text-white input input-bordered" onChange={(e) => setUrl(e.target.value)}/>

     <RenderButton state={buttonState} getData={getData} handleReload={hadleReload}/>

     {buttonState==="done" ?(<div className="w-3/5 p-8 text-white rounded-md bg-slate-700 mt-14 " ><div dangerouslySetInnerHTML={{ __html: res }} /></div>):("")}          
      </div>


  
  </div>
  
  )
  

}