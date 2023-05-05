import {useState, useEffect} from 'react'
import { splitArrayIntoGroups } from '@/utils/textUtils'
import DownloadCsvTable from './toolsComponents/DownloadCsvTable'
import RenderButton from './toolsComponents/RenderButton'

function BatchTest() {

    const [keywords, setKeywords] = useState("")
    
    const [topics, setTopics] = useState("")
    const [finalPrompts, setFinalPrompts] = useState("");
    const [response, setResponse] = useState([])
    const [buttonState, setButtonState] = useState("default")
    const [fetchCount, setFetchCount] = useState(0);
    
    const cleanTopics = topics.split(/\r?\n/)
    const cleanKeywords = keywords.split(/\r?\n/)
    
    const GPT4 = '/api/chatGPT4'
    const GPT35 = '/api/chatGPT35'
    

  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanKeywords, 20);
    const prompts = groups.map(group => `Para el siguiente listado de palabras: "${group}", asigna la kw a alguna de estas categorías ${cleanTopics}. Habrá una palabra por línea con el formato: topic | keyword. El formato de tu respuesta SIEMPRE debe ser un objeto por keyword como este {"keyword":"valor","topic":"valor"} sin saltos de linea, sin [], sin comas entre }{ ni ninguna información extra `);
    return prompts;
  }
  
  function parseString(data) {
    const firstregex = /},/g;
    const a = data.replace(firstregex, "}");
    const secondRegex = /}/g;
    const b = a.replace(secondRegex, "},");
    const c = b.replace(/,$/g, "");
    const d = c.replace(/^/g, "[");
    const final = d.replace(/$/g, "]");
    
    return JSON.parse(final);
    
    
  }
  


  
  function processPrompts(index, accumulatedData, prompts) {
    if (index === prompts.length) {
      
      console.log("accumulated:",accumulatedData.toString());
      setFinalPrompts(accumulatedData.toString())
      
        return;
    }

   
    
    const prompt = prompts[index];
    console.time(`Fetch ${index+1}`)
    fetch(GPT35, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.timeEnd(`Fetch ${index+1}`)
      const newData = accumulatedData.concat(data.response);
      setResponse(newData);
      setFetchCount(fetchCount + 1);
      if (index === prompts.length - 1) {
        setButtonState("done"); // cambiamos el estado del botón a done cuando se completen todos los fetch
      }
      processPrompts(index + 1, newData, prompts);
      
      
      })
      .catch((error) => {
        console.log('Error:', error);
        setButtonState("error")
      });
      
    }
    
    function handleProcessPrompts() {
      setButtonState("loading")
      createSplitPrompts().then(prompts => processPrompts(0, [], prompts));
    }
    
    useEffect(() => {
      setResponse(parseString(finalPrompts))
      // response!== null && setButtonState("done")
      console.log()
    }, [finalPrompts])

    

    function hadleReload() {
      window.location.reload()
    }
  
    
    return (
      <div>
        
        <textarea placeholder="Introduce un listado de keywords. Debe haber una Kw por linea" className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
    onChange={(e) => setKeywords(e.target.value)}
    />
  <textarea placeholder="Introduce un listado de topics. Debe haber un topic por linea" className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
    onChange={(e) => setTopics(e.target.value)}
    />
  <RenderButton state={buttonState} getData={handleProcessPrompts} handleReload={hadleReload} />
 

  <p>{finalPrompts}</p>


  {buttonState !=="done" ? (""): (<div className="flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center ">

        
    
       

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

</div>) }    

  
  </div>
  )
}

export default BatchTest