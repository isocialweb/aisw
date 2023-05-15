import { useState, useEffect } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';
import DownloadCsvTable from './toolsComponents/DownloadCsvTable';
import { splitArrayIntoGroups, parseString } from '@/utils/textUtils';
import { api } from '@/utils/api';

export default function BulkTitleMeta() {
  const [response, setResponse] = useState([])


  const [keywords, setKeywords] = useState("")
  const cleanKeywords = keywords.split(/\r?\n/)

  const [buttonState, setButtonState] = useState("default")
  const [finalPrompts, setFinalPrompts] = useState("");
  const [fetchCount, setFetchCount] = useState(0);
  const [fetchIndex, setFetchIndex] = useState(0)

  const GPT4 = '/api/chatGPT4'
  const GPT35 = '/api/chatGPT35_noAuth'


  //Esta función convierte las cleanKeywords en paquetes de n que queramos y luego los mapea para separar los prompts en tantos como larga sea la array de grupos de KW  
  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanKeywords, 10);
    const prompts = groups.map(group => `Eres un especialista SEO. Para el siguiente listado de palabras clave:${group}, devuelve por cada una de las keywords un titulo, una metadescripción y un h1 que sin ser el mismo que el title ataque a la misma intencionalidad de búsqueda y keyword.devuelve la respuesta ESTRICTAMENE en el formato solicitado:  {"keyword":"valor", "title":"valor","metadescription":"valor","H1":"valor",}. El formato de tu respuesta SIEMPRE debe ser un objeto por keyword sin saltos de linea, sin [], sin comas entre }{ ni ninguna información extra como omentarios adicionales`);
    setFetchIndex(prompts.length)
    return prompts;
  }

  //Esta función valida que el índice acumulado sea igual que el largo de prompts. Si es así seteará el resultado en FinalPrompts
  async function processPrompts(index, accumulatedData, prompts) {
    if (index === prompts.length) {
      // console.log("accumulated:",accumulatedData.toString());
      setFinalPrompts(accumulatedData.toString())

      return;
    }


    //Por cada índice del prompt realizaremos un fetch
    const prompt = prompts[index];
    const functionName = 'BulkTitleMeta'
    try {
      const res = await api("chat", "POST", { prompt, fetchIndex: prompts.length, functionName });
      const newData = accumulatedData.concat(res.response);
      setResponse(newData);
      setFetchCount(fetchCount + 1);
      if (index === prompts.length - 1) {
        setButtonState("done");
      }
      processPrompts(index + 1, newData, prompts);
    } catch (error) {
      console.log("Error:", error);
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
    setResponse(parseString(finalPrompts, setButtonState))

  }, [finalPrompts])



  function hadleReload() {
    window.location.reload()
  }



  return (
    <div className="mb-5">

      <div className="flex flex-col gap-5 items-center justify-start h-3/4 content-start">

        <ToolInfo
          title="Bulk Title Meta & H1"
          description={"Analiza las intenciones de búsqueda y la etapa del funnel de tus palabras clave. Solo necesitas introducir un listado de hasta 100 palabras clave en el área de texto y nuestra herramienta clasificará cada palabra por intención de búsqueda y etapa del funnel. Cuando estés listo, haz clic en el botón Analizar.Después de unos segundos, podrás ver los resultados en una tabla fácil de leer. Recuerda que la herramienta clasifica las palabras clave según tres intenciones de búsqueda (Informacional, Transaccional o Navegacional) y tres etapas del funnel (Descubrimiento, Consideración o Conversión)."}
        />

        <textarea placeholder="Introduce un listado de keywords. Debe haber una Kw por linea" className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
          onChange={(e) => setKeywords(e.target.value)}
        />

        <RenderButton state={buttonState} getData={handleProcessPrompts} handleReload={hadleReload} fetchCount={fetchCount} fetchIndex={fetchIndex} />

      </div>


      {buttonState === "done" && response !== null ? (

        <div className="flex items-center flex-col content-center justify-items-center w-4/5 pt-24 mx-auto ">
          <table className="w-full mb-10">
          
            <thead className="bg-slate-800 h-10">
           
              <tr  >
             
                <th className='text-white'>Keyword</th>
                <th className='text-white'>Titulo</th>
                <th className='text-white'>Meta</th>
                <th className='text-white'>h1</th>
              </tr>
              
            </thead>
            
            <tbody >
              {response.map((row) => (<tr>
                <td className='text-white overflow-auto px-10 py-3' key={row.keyword} >{row.keyword}</td>
                <td className='text-white overflow-auto px-10 py-3 ' key={row.title} >{row.title}</td>
                <td className='text-white overflow-auto px-10 py-3' key={row.metadescription} >{row.metadescription}</td>
                <td className='text-white overflow-auto px-10 py-3' key={row.H1} >{row.H1}</td>

              </tr>))}

            </tbody>
          </table>
          <DownloadCsvTable response={response} />




        </div>



      ) : buttonState === "error" && (<div className='flex items-center flex-col content-center justify-items-center w-3/5 pt-24 mx-auto '><div tabindex="0" className="collapse group">
        <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
          Click to see Raw Data
        </div>
        <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
          <p>{finalPrompts}</p>
        </div>
      </div>





      </div>)}





    </div>
  )

}