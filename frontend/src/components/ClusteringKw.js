import { useState, useEffect } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';
import { BiDownload } from "react-icons/bi";
import DownloadCsvTable from './toolsComponents/DownloadCsvTable';
import { splitArrayIntoGroups,parseString } from '@/utils/textUtils';
import { api } from '@/utils/api';

export default function Clustering() {
    const [keywords, setKeywords] = useState("")
    const [topics, setTopics] = useState("")
    const cleanTopics = topics.split(/\r?\n/)
    const cleanKeywords = keywords.split(/\r?\n/)


    const [finalPrompts, setFinalPrompts] = useState("");
    const [response, setResponse] = useState([])

    const [buttonState, setButtonState] = useState("default")
    const [fetchCount, setFetchCount] = useState(0);
    const [fetchIndex, setFetchIndex] = useState(0)    
   
   
  //Esta función convierte las cleanKeywords en paquetes de n que queramos y luego los mapea para separar los prompts en tantos como larga sea la array de grupos de KW  
  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanKeywords, 20);
    const prompts = groups.map(group => `Para el siguiente listado de palabras: "${group}", asigna la kw a alguna de estas categorías ${cleanTopics}. Habrá una palabra por línea con el formato: topic | keyword. El formato de tu respuesta SIEMPRE debe ser un objeto por keyword como este {"keyword":"valor","topic":"valor"} sin saltos de linea, sin [], sin comas entre }{ ni ninguna información extra `);
    setFetchIndex(prompts.length)
    return prompts;
  }
  
  //Esta función valida que el índice acumulado sea igual que el largo de prompts. Si es así seteará el resultado en FinalPrompts
  async function processPrompts(index, accumulatedData, prompts) {
    if (index === prompts.length) {
    
      setFinalPrompts(accumulatedData.toString())
      
        return;
    }
   
    //Por cada índice del prompt realizaremos un fetch
    const prompt = prompts[index];
 
  try {
    const res = await api("chat", "POST", { prompt });
    // console.log(`Fetch ${index + 1} result:`, res);
    const newData = accumulatedData.concat(res.response);
    setResponse(newData);
    setFetchCount(fetchCount + 1);
    if (index === prompts.length - 1) {
      setButtonState("done");
    }
    processPrompts(index + 1, newData, prompts);
  } catch (error) {
    
    setButtonState("error");
  }
}

    
    //OnClick principal. Ejecutará create splitPrompts y los procesará para el fetch)
    function handleProcessPrompts() {
      setButtonState("loading")
      createSplitPrompts().then(prompts => processPrompts(0, [], prompts));
    }
    
    // Cuando FinalPrompts renderice parsearemos la String resultate a objeto de JS
    useEffect(() => {
      setResponse(parseString(finalPrompts))
      
    }, [finalPrompts])

    

    function hadleReload() {
      window.location.reload()
    }
  
  

  return (
    <div className='mb-24'>
    <div className="mb-5">

      <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">

        <ToolInfo
          title="Clustering"
          description="Esta herramienta es agrupar las palabras clave en los temas que tú indiques. Sólo necesitas ingresar tus palabras clave en el espacio que proporcionamos. Luego, selecciona los temas que quieres asignarles. La herramienta se encargará de hacer el resto. Una vez que hayas terminado, puedes descargar los resultados y trabajar con ellos como mejor te convenga "
        />

        <textarea placeholder="Introduce un listado de keywords. Debe haber una Kw por linea" className="textarea textarea-bordered w-3/5 h-[250px] mb-5 text-white"
          onChange={(e) => setKeywords(e.target.value)}
        />
        <textarea placeholder="Introduce un listado de topics. Debe haber un topic por linea" className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
          onChange={(e) => setTopics(e.target.value)}
        />


<RenderButton state={buttonState} getData={handleProcessPrompts} handleReload={hadleReload} fetchCount={fetchCount} fetchIndex={fetchIndex} />

      </div>
      </div>

      

      {buttonState === "done" && response !== null ?  (<div className="flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center ">

        
        
       

        <table className="table w-full mx-auto ">
          <thead className='text-center'>
            <tr>
              <th className='tracking-wider text-white'>Topic</th>
              <th className='tracking-wider text-white'>Keyword</th>

            </tr>
          </thead>
          <tbody className='text-center'>
            {response.map((row) => (<tr>
              <td className='text-white ' key={row.keyword}>{row.keyword}</td>
              <td className='text-white ' key={row.topic}>{row.topic}</td>

            </tr>))}

          </tbody>
        </table>
        <DownloadCsvTable response={response}/>
        
      </div>)
      
      :
      buttonState === "error" && (<div className='flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center'><div tabindex="0" className="collapse group">
          <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
            Click to see Raw Data
          </div>
          <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
            <p>{finalPrompts.split(" ")}</p>
          </div>
        </div></div>)


      }
      
     </div>
    
  )

}