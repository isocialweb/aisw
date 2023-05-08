import DownloadCsvTable from './toolsComponents/DownloadCsvTable';
import { useState, useEffect, useRef } from 'react';
import ReactHtmlParser from 'kt-react-html-parser';
import ToolInfo from './toolsComponents/ToolInfo';
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { api } from '@/utils/api';

export default function SerpTitle() {

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [state, setState] = useState('default');
  const [responseTitle, setResponseTitle] = useState([]);
  const [responseHeading, setResponseHeading] = useState("");
  const [responseMetaDescription, setResponseMetaDescription] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [buttonState, setButtonState] = useState('default')
  const [loadSteps, setLoadSteps] = useState('default')
 
  
  const [selectedTitle, setSelectedTitle] = useState("")
  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value)
  }
  const handleTitleSelect = (event) => {
    setSelectedTitle(event.target.value);
  };

  const [selectedMetaDescription, setSelectedMetaDescription] = useState("")

  const handleMetaDesctiptionChange = (event) => {
    setSelectedMetaDescription(event.target.value)
  }
  const handleMetaDescriptionSelect = (event) => {
    setSelectedMetaDescription(event.target.value);
  };


  const promptTitle = `Eres un especialista SEO. Dados los siguientes títulos: ${results.map((r) => r.title)} y los siguientes H1: ${results.map((r) => r.H1)}, genera 5 title SEO de 60 caracteres máximo nuevo, que agrupe las intenciones de búsqueda que atacan. Elimina siempre la marca de la web que puedan tener los títulos proporcionados antes de generar el nuevo título, que generalmente está al final del title. Tu respuesta debe ser únicamente un array de objetos de la siguiente forma: [{"title":"El título propuesto"},{"title":"El título propuesto"}]. No añadas texto al inicio ni al final ni ninguna expliación. Sólo devuelveme la array`
  const promptMetaDescription = `Eres un especialista SEO. Teniendo en cuenta que el título que voy a usar es: ${selectedTitle} para mi artículo, que la Keyword principal es ${query} y que mi competencia usa las meta description siguientes: ${results.map((r) => r.description)}, genera 5 nuevas metadescription (de entre 100 y 160 caracteres máximo) que agrupe las intenciones de búsqueda que atacan y obtenga el mejor CTR. Que no incluyan los nombres de las marcas de los dominios. Tu respuesta debe ser un único p en html con la metaDescription, nada más como esto <p>Aquí irá la metadescription</p>.Tu respuesta debe ser únicamente un array de objetos de la siguiente forma: [{"metadescription":"La metadescription propuesta"},{"metadescription":"La metadescription propuesta}]. No añadas texto al inicio ni al final ni ninguna expliación. Sólo devuelveme la array`
  const promptHeadings = `Eres un especialista SEO. Genera una jerarquía de encabezados para un único artículo de blog sobre ${query} teniendo en cuenta que usaré este título:${selectedTitle} y esta meta descripción: ${selectedMetaDescription}, el conjunto de h1 y h2 que te proporciono como referencia pertenencen a mi compentencia. Siempre y cuando tengan que ver con mi título, meta Description y query, genera unos nuevos, que tengan coherencia en estructura y contenido, y ataquen todas las necesidades. Importante Omite H2 o h3 genéricos como Entradas Recientes, Entradas Relacionadas, Categorías, newsletter, etc.. Por lo que no quiero que me devuelvas ninguno del tipo: Suscribete a newsletter o artículos relacionados. También ten en cuenta que si te paso un número en el título como las 3 mejores X no me puedes devolver encabezados tipo las 7 mejores x, es decir, que tengan coherencia los encabezados con el título y la metadescription que te doy. La jerarquía debe estar optimizada para el SEO y debe contener un máximo de 3 h3 dentro de cada h2 si son necesarios y un únido H1 para el artículo diferente al title. Respeta los className exactos que te proporciono en el ejemplo. No quiero h4 ni elementos que no sean encabezados (por ejemplo ul,li o similares).Omite en tu respuesta cualquier referencia a la marca de los siguientes dominios:${results.map((r) => r.domain)} Tu respuesta sólo deben ser los encabezados, ej: <h1 class="my-5 text-2xl ">El que sea</h1><h2 class="mt-5 text-lg">El que sea</h2><h2 class="mt-5 text-lg">El que sea</h2><h3 class="text-sm">El que sea</h3>Los className tienen que ser los mismos que te doy. Evita repeticiones. Estos son las referencias H1: ${results.map((r) => r.H1)}, H2 ${results.map((r) => r.H2.slice(0, 3))}`


  useEffect(() => {
    if (state === 'Serp_ready') {
      async function fetchResults() {
        try {
          const data = await api("serpscraper/value", "POST", { query });
              // Obtiene los títulos de las páginas en paralelo
          const promises = data.organic_results.map(async (result) => {
          const response = await api('scraper/',"POST", {url:result.link})
          return {
              ...result,
              metaTitle: response.title,
              H1: response.H1,
              H2: response.H2,
              description: response.description
            };
          });

          // Espera a que todas las promesas hayan terminado y actualiza los resultados
          const settledPromises = await Promise.allSettled(promises);
          const validResults = settledPromises
            .filter((result) => result.status === 'fulfilled') // Filtra solo los resultados resueltos
            .map((result) => result.value); // Obtiene los valores de los resultados resueltos

          setResults(validResults);
          setState('title_ready');



        } catch (error) {
          console.error('Error:', error);
          return null
        }
      }
      fetchResults();

    }
  }, [state, query]);

  function handleGetData() {
    setState('Serp_ready');

  }

 
  async function getData(prompt, apiRoute="chat") {
    console.time('fetchData')
    try{const res = await api(apiRoute,"POST", {prompt})
    
    console.timeEnd('fetchData')
    return res; }       
      
      catch(error){console.log('Error:', error);}
        
      }

  
  function getTitleData() {
    setButtonState('loading_title')
    setIsLoading(true)
    getData(promptTitle)
      .then((data) => {
        const parsedData = JSON.parse(data.response);
        setResponseTitle(parsedData);
        setLoadSteps("FirstStep")
        setIsLoading(false)
        setButtonState('default')

      });
  }

  function getHeadingData() {
    setButtonState('loading_heading')
    setIsLoading(true)
    getData(promptHeadings, "chat/gpt4")
      .then((data) => {
        setResponseHeading(data.response);
        setIsLoading(false)
        setButtonState('default')
        setLoadSteps('ThirdStep')

      });
  }

  function getMetaDescriptionData() {
    setButtonState('loading_meta')
    setIsLoading(true)
    getData(promptMetaDescription)
      .then((data) => {
        const parsedData = JSON.parse(data.response);
        setResponseMetaDescription(parsedData);
        setIsLoading(false)
        setButtonState('default')
        setLoadSteps("SecondStep")

      });
      
  }

  console.clear()
  console.log(loadSteps)
  

  return (
    <div className="flex flex-col items-center content-start justify-start gap-5 h-3/5 mb-36">
      <ToolInfo
        title="Title, Meta & Headings Creator"
        description="Esta herramienta nos devuelve del TOP 3 al TOP 5 resultados en las serps para una KW que le pasemos y escrapeará los elementos principales de cada una de las url. Una vez tengamos esos datos, podremos generar, en base a ese TOP, 5 títulos y/o una lógica de encabezados para un artículo nuevo" />
      <input
        type="text"
        placeholder="Introduce la kw a analizar"
        className="w-3/5 text-white input "
        onChange={(e) => setQuery(e.target.value)}
      />



      {isLoading === false && state == "default" ? (

        <button className="btn px-36 hover:text-white hover:bg-[#E5408E] border-[#E5408E] text-[#E5408E] bg-transparent" onClick={handleGetData}>
          Buscar
        </button>
      ) : state == "Serp_ready" ? (

        <button className="btn loading btn-ghost text-[#E5408E]">
          Fetching, please wait.
        </button>
      ) :
        state === 'title_ready' && (

          <>
            
            <div className="overflow-x-auto w-3/5 mt-10">
            <p className='mb-5 text-sm'>Este es el top {results.length} competidores para la query: {query}. Dale a "elaborar informe" para generar sugerencias de title, meta description y jerarquías de encabezados. El sistema te irá guiando por cada uno de los pasos  </p>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th className="text-white">pos</th>
                    <th className="text-white">url</th>
                    <th className="text-white">title</th>
                    <th className="text-white">description</th>


                  </tr>
                </thead>
                <tbody >

                  {results.map((result) => (<tr>
                    <th className="text-white">{result.position}</th>
                    <td className="text-white "><a href={result.link}>{result.domain}</a></td>
                    <td className="text-white">{result.title}</td>
                    <td className="text-white">{result.description}</td>

                  </tr>))}

                </tbody>

              </table>

            </div>

            <div className='flex flex-row gap-5'>
              <button className="btn btn-primary my-6" disabled>Fetch Complete</button>
              {isLoading === false && responseTitle.length == 0 ? (<button className='btn btn-primary my-6' onClick={getTitleData}>Elaborar informe</button>) :
                isLoading === true && responseTitle.length < 1 && buttonState === 'loading_title' ? (<button className="btn btn-primary loading my-6">Buscando títulos</button>) :
                  isLoading === false && responseTitle.length > 0 && (<button className="btn btn-primary my-6" disabled>Títulos Generados</button>)
              }


            </div>
          </>

        )


      }

{state === 'title_ready' ? (
  <ul className="steps">
    <li className={`step step-secondary text-white text-sm`}>
      <p className="px-5">Scraper</p>
    </li>
    <li className={`step ${loadSteps === 'FirstStep' || loadSteps === 'SecondStep' || loadSteps === 'ThirdStep'  ? 'step-secondary' : ''} text-white text-sm`}>
      <p className="px-5">Suggestions</p>
    </li>
    <li className={`step ${loadSteps === 'ThirdStep' || responseHeading > 0 ? 'step-secondary' : ''} text-white text-sm`}>
      <p className="px-5">Inform</p>
    </li>
  </ul>
) : (
  ""
)}


      {state === 'title_ready' ?

        (
          <>
          
           
            {responseTitle && responseTitle.length > 0 && loadSteps === "FirstStep" && isLoading == false ? (


              <div className="my-14" >
                <label className="text-base font-semibold text-white">Sugerencia de títulos</label>
                <p className="text-sm text-gray-300">Aquí tienes 5 sugerencias de títulos para {query}. Elige uno y edítalo si crees que es necesario en el campo de abajo</p>
                <fieldset className="mt-4">
                  <div className="space-y-4">
                    {responseTitle.map((title, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={index}
                          name="notification-method"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-secondary focus:ring-secondary"
                          value={title.title}
                          checked={selectedTitle === title.title}
                          onChange={handleTitleSelect}
                        />
                        <label htmlFor={title.id} className="ml-3 block text-sm font-medium leading-6 text-white">
                          {title.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="title" className="block text-sm  leading-6 text-white mt-10">
                    Edita o Valida el título
                  </label>

                  <div>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="title"
                        id="title"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Esperando título..."
                        value={selectedTitle}
                        onChange={handleTitleChange}
                      />
                    </div>

                    <button
                      type="button" onClick={getMetaDescriptionData} className="rounded-md bg-secondary mt-2 px-2.5  py-1.5 flex  text-sm font-semibold text-white shadow-sm hover:bg-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      Validar Título y Buscar Meta Description
                    </button>
                  </div>
                </div>
              </div>


            ) : ("")}


            {responseMetaDescription && responseMetaDescription.length > 0 && loadSteps === "SecondStep" && isLoading == false ? (

              <div className="my-14" >
                <label className="text-base font-semibold text-white">Sugerencia de Meta Description</label>
                <p className="text-sm text-gray-500 mb-10">Aquí tienes 5 sugerencias de MetaDescription para {query}. Elige uno y edítalo si crees que es necesario en el campo de abajo</p>
                <fieldset className="mt-4">
                  <div className="space-y-4">
                    {responseMetaDescription.map((title, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={index}
                          name="notification-method"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-secondary focus:ring-secondary"
                          value={title.metadescription}
                          checked={selectedMetaDescription === title.metadescription}
                          onChange={handleMetaDescriptionSelect}
                        />
                        <label htmlFor={title.id} className="ml-3 block text-sm font-medium leading-6 text-white">
                          {title.metadescription}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium leading-6 text-white mt-10">
                    Edita o Valida la Meta Description
                  </label>

                  <div>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="title"
                        id="title"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Esperando Metadescription..."
                        value={selectedMetaDescription}
                        onChange={handleMetaDesctiptionChange}
                      />
                    </div>

                    <button
                      type="button" onClick={getHeadingData} className="rounded-md bg-secondary mt-2 px-2.5  py-1.5 flex  text-sm font-semibold text-white shadow-sm hover:bg-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      Validar MetaDescription
                    </button>
                  </div>
                </div>
              </div>



            ) :

              isLoading === true && (<button className="btn loading btn-ghost text-[#E5408E] my-28">
              Loading 
            </button>)
            }



            {responseHeading && responseHeading.length > 0 ? (
              <>


                <div className="bg-slate-700 my-10 p-10 rounded-2xl max-w-6xl">
                  <div className="px-4 my-10 sm:px-0 ">
                    <h3 className="text-base font-semibold leading-7 text-white">Informe:</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-white">{query}</p>
                  </div>
                  <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-white"> H1 de tus competidores</dt>
                        <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{results.map((e)=><p>{e.H1}</p>)}</dd>
                      </div>
                     
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-white">Sugerencia Título IA</dt>
                        <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{selectedTitle}</dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-white"> Sugerencia Meta Description IA</dt>
                        <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{selectedMetaDescription}</dd>
                      </div>
                      

                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-white">Sugerencias de Encabezados IA</dt>
                        <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                          {ReactHtmlParser(responseHeading)}
                        </dd>

                        
                      </div>
                    </dl>
                  </div>
                </div>
              </>
            ) : ("")}
          </>

        )
        : state === "Serp_ready" && (<>


        </>
        )}



    </div>
  );
}
