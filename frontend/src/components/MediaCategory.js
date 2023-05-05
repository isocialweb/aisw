import { useState, useEffect } from 'react';
import RenderButton from './toolsComponents/RenderButton';
import ToolInfo from './toolsComponents/ToolInfo';
import DownloadCsvTable from './toolsComponents/DownloadCsvTable';
import { splitArrayIntoGroups, parseString } from '@/utils/textUtils';
import { api } from '@/utils/api';
export default function MediaCategory() {
  //Variables principales (keywords, topics, urls, etc..)
  const [domains, setDomains] = useState("")
  const categories = ["Bebés y Maternidad",
    "Mascotas y Naturaleza",
    "Motor",
    "Belleza y Moda",
    "Apuestas y Casinos",
    "Inmobiliaria",
    "Legal",
    "Relaciones y amor",
    "Salud",
    "Humor y Ocio",
    "Generalista",
    "Ecología y Ciencia",
    "Gastronomía y Restauración",
    "Cannabis y drogas ",
    "Contenido Adulto +18 ",
    "Transporte y logística",
    "Ingeniería e Industrial",
    "Tecnología ",
    "Gaming y Videoconsolas",
    "Marketing y SEO",
    "Deportes",
    "TV y Musica",
    "Economía y Empleo",
    "Educación e Idiomas",
    "Viajes y Turismo",
    "Psicología y psiquiatría",
    "Tarot y Videncia",
    "Hogar y bricolaje ",


  ]

  //Variables de la lógica
  const cleanDomains = domains.split(/\r?\n/)
  const [finalPrompts, setFinalPrompts] = useState("");
  const [response, setResponse] = useState([])
  const [buttonState, setButtonState] = useState("default")
  const GPT4 = '/api/chatGPT4'
  const GPT35 = '/api/chatGPT35_noAuth'

  //Variables counter
  const [fetchCount, setFetchCount] = useState(0);
  const [fetchIndex, setFetchIndex] = useState(0)


  //Esta función convierte las cleanKeywords en paquetes de n que queramos y luego los mapea para separar los prompts en tantos como larga sea la array de grupos de KW  
  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanDomains, 20);
    const prompts = groups.map(group => `Clasifica SOLO en informacional (periodicos, magazines, revistas, blogs, medios de comunicación) o SOLO transaccional (ecommerce, servicios, alquiler...)(esta clave se llamará type) las siguientes webs "${group}". Con la clasificación anterior, asigna alguna de estas categorías (esta clave se llamará category) ${categories} a cada tipo. Tu respuesta debe tener el porcentaje de seguridad en que tu respuesta es correcta, por ejemplo elpais.com al 80% seguro que es un medio generalista. Si tu seguridad de respuesta es inferior al 70%, clasifíca como duda el type o category según donde tengas la duda (esta clave ser llamará accuracy). Si tu seguridad es 83% dilo, no redondees a 80% u 85%. El formato de tu respuesta SIEMPRE y UNICAMENTE debe ser un objeto por web como estos: {"web": "valor", "type":"valor", "category":"valor", "accuracy":"valor" }{"web": "valor", "type":"valor", "category":"valor", "accuracy":"valor(siempre con %)" } sin saltos de linea, sin [], sin comas entre }{ NO ME DEVUELVAS NADA QUE NO SEA ESTE FORMATO `);
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
    
    try {
      const res = await api("chat", "POST", { prompt });
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
    <div className='mb-24'>
      <div className="mb-5">

        <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">

          <ToolInfo
            title="Media Category"
            description="Esta tool clasifica una web en informacional o transaccional y su topic principal con % de acierto."
          />

          <textarea placeholder="Introduce un listado de dominios. Debe haber una dominio por linea" className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
            onChange={(e) => setDomains(e.target.value)}
          />

          <RenderButton state={buttonState} getData={handleProcessPrompts} handleReload={hadleReload} fetchCount={fetchCount} fetchIndex={fetchIndex} />




        </div>
      </div>



      {buttonState === "done" && response !== null ? (<div className="flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center ">



        <table className="table w-full mx-auto ">
          <thead className='text-center'>
            <tr>
              <th className='tracking-wider text-white'>Web</th>
              <th className='tracking-wider text-white'>Tipo</th>
              <th className='tracking-wider text-white'>Categoria</th>
              <th className='tracking-wider text-white'>%</th>
              {/* <th className='tracking-wider text-white'>bar</th> */}

            </tr>
          </thead>
          <tbody className='text-center'>

            {response.map((row) => (<tr>
              <td className='text-white ' key={row.web}>{row.web}</td>
              <td className='text-white ' key={row.type}>{row.type}</td>
              <td className='text-white ' key={row.category}>{row.category}</td>
              <td className='text-white ' key={row.accuracy}>{row.accuracy}</td>
              {/* <td className='text-white ' key={row.accuracy}> <progress className="progress progress-accent w-32" value={parseFloat(row?.accuracy?.replace("%", ""))} max="100"></progress></td> */}



            </tr>))} */

          </tbody>
        </table>
        <DownloadCsvTable response={response} />
        

      </div>)
      : buttonState === "error" && (<div className='flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center'><div tabindex="0" className="collapse group">
          <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
            Click to see Raw Data
          </div>
          <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
            <p>{finalPrompts.split(" ")}</p>
          </div>
        </div></div>)}

    </div>

  )

}