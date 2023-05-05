import { useState, useEffect } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';
import { BiDownload } from "react-icons/bi";
import DownloadCsvTable from './toolsComponents/DownloadCsvTable';


export default function ClusteringUrls() {
    const [res, setRes] = useState([])
    const [urls, setUrls] = useState("")
    const cleanurls = urls.split(/\r?\n/)

    const [test,setTest] = useState([])

    
    const [buttonState, setButtonState] = useState("default")

    // const [topics, setTopics] = useState("")
    // const cleanTopics = topics.split(/\r?\n/)
  
  
    // const prompt = `Para el siguiente listado de palabras:${cleanKeywords} asigna la kw a alguna de estas categorías ${cleanTopics}. Habrá una palabra por línea con el formato: topic | keyword. Tu respuesta debe ser sólo una array de objetos con las key exactas:keyword y topic para poder guardar directamente en una variable de este código`
  
const results =[]

function scrapeTitles(){
    fetch('http://localhost:3005/scraper/titles',
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: cleanurls,
        }),
      })
      .then((res)=>console.log(res))
    
}


    function getData() {
      
      fetch('http://localhost:3005/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      })
        .then((res) => res.json())
        // .then((data) => setRes([...data.response]))
        .then((data) =>
          JSON.parse(data.response))
        .then((resultObjt) => {
          setRes(resultObjt);
          console.log(resultObjt)
        })
  
  
        .catch((error) => {
          console.log('Error:', error);
        });
  
  
    }
  
    function hadleReload() {
      window.location.reload()
    }
  
    
  
    return (
      <><p className='text-white'>Hola Mundo</p>
      <textarea placeholder="urls" className="textarea textarea-bordered w-full h-[250px] mb-14 text-white"
          onChange={(e) => setUrls(e.target.value)}
          
        />
        <button className='btn btn-primary' onClick={scrapeTitles}> Extrae los títulos </button>
        
      
      </>

      
    )
  
  }