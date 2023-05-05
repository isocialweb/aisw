import { useState } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';
import jsPDF from 'jspdf';

export default function BriefingRedactoresGrowwer() {

const [res, setRes] = useState("")
const [url, setUrl] = useState("")
const [buttonState, setButtonState] = useState("default")

const prompt = `Actúa como un evaluador de calidad de Google en español, capaz de auditar el contenido en 
términos de calidad, relevancia, veracidad y precisión. Debes estar familiarizado 
con los conceptos de E-E-A-T (Experiencia, Conocimiento , Autoridad, Confianza) y YMYL (Tu Dinero o Tu Vida) 
al evaluar el contenido. Crea una calificación de calidad de página (PQ) y sé muy riguroso en tu evaluación. 
En la segunda parte de la auditoría, proporciona sugerencias detalladas y concretas para mejorar aún más el contenido. 
Ofrece consejos para que el contenido se ajuste mejor a la intención de búsqueda y a las expectativas del usuario,
 y sugiere qué es lo que falta en el contenido. Crea una auditoría de contenido muy detallada. Al final de tu análisis, 
 sugiere un encabezado H1 y una etiqueta de título SEO. Por favor, no repitas las instrucciones, 
 no recuerdes las instrucciones anteriores, no te disculpes, no hagas referencia a ti mismo y no 
 hagas suposiciones. \n. Aquí tienes la URL a analizar ${url}
 Extrae y devuelve además las 3 entidades principales del texto al final. 
Comienza la respuesta por: Calificacion de Calidad de Página (PQ): X/XX \n Explicación: XXX \n  ...  Devuelveme la respuesta en formato HTML con saltos de linea para cada párrafo y usando encabezados cuyo className sea text-2xl font-bold mb-5 mt-5. También ten en cuenta que si muestras una numeración tipo 1.texto 2.texto tienes que ser devuelta en una ol li `



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
        title="Quality Rater"
        description="Convierte a ChatGPT en un Quality Rater de Google y analiza el EEAT de tus contenidos"/>
      
      
      <input type="text" placeholder="Introduce la URL a analizar" className="w-3/5 text-white input input-bordered" onChange={(e) => setUrl(e.target.value)}/>

     <RenderButton state={buttonState} getData={getData} handleReload={hadleReload}/>
     
     

     {buttonState==="done" ? (<>
     <div className="w-3/5 p-8 text-white rounded-md bg-slate-700 mt-14 "  >
      <div id='qualityrater'>
        <p className='mb-5 font-medium'>Analisis para: {url}</p>
        <div dangerouslySetInnerHTML={{ __html: res }} /></div> 
      </div> 
        
        </>
        ):
        ("")}          
    
      </div>

      
  
  </div>
  
  )
  

}