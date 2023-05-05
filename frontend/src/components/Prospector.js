import { useState, useEffect } from 'react'
import ToolInfo from './toolsComponents/ToolInfo'
import { api } from '@/utils/api'

function Prospector() {

  const [urls, setUrls] = useState([])
  const [query, setQuery] = useState("")
  const [state, setState] = useState("default")
  const [controlState, setControlState] = useState("default")
  const [queries, setQueries] = useState([]);
  const [finalUrls, setFinalUrls] = useState([])


  async function getData() {
    console.time("news")
    setControlState("searchingNews")
    setState('loading')

    try {
      const response = await api("serpscraper/news", "POST", { query: query })
      setUrls(response)
      setState('done')
      setControlState('newsFind')
      console.timeEnd("news")

    } catch (err) {
      setControlState('error')
      console.log(err)
    }


  }

  useEffect(() => {
    if (controlState === 'newsFind') {
      console.time("first_ppaa")
      setState('loading')
      api("serpscraper/ppaa", "POST", {
        query,
      })
        .then((data) => {
          setQueries(data);
          setState('done')
          setControlState('first_ppaa_ready');
          console.timeEnd("first_ppaa")
        });
    }
  }, [controlState]);

  useEffect(() => {
    if (controlState === 'first_ppaa_ready') {
      setState('loading');
      setControlState('all_ppaa');
      console.time('all_ppaa');

      const fetchQueries = async () => {
        const newQueries = [];
        const selectedQueries = queries.slice(0, 4);

        for (const q of selectedQueries) {
          try {
            const data = await api('serpscraper/ppaa', 'POST', {
              query: q,
            });

            newQueries.push(...data);
          } catch (error) {
            setControlState('error')
            console.error(`Error en fetchQueries: ${error.status} ${error.statusText}`);

          }
        }
        const uniqueQueries = [...new Set(newQueries)];
        setQueries(uniqueQueries);
        setState('done');
        setControlState('all_ppaa_ready');
        console.timeEnd('all_ppaa');
      };

      fetchQueries();
    }
  }, [controlState, queries]);


  useEffect(() => {
    if (controlState === 'all_ppaa_ready') {
      console.time("all_organic_urls")
      setState('loading')
      setControlState("start_querys_organic")
      const fetchQuestions = async () => {
        const selectedQueries = queries.slice(0, 7);
        const newResults = [];

        // Divide la array de queries en sub-arrays de 5 queries cada uno
        for (let i = 0; i < selectedQueries.length; i += 5) {
          const subQueries = selectedQueries.slice(i, i + 5);

          for (const q of subQueries) {
            console.time(`fetch ${q}`);
            try {
              const response = await api('serpscraper/organic', 'POST', {
                query: q,
              });

              console.timeEnd(`fetch ${q}`);
              setControlState("saving_querys_organic");
              newResults.push(...response);
            } catch (error) {
              setControlState('error')
              console.error(`Error en fetchQuestions: ${error.status} ${error.statusText}`);

            }
          }
        }

        setUrls(prevUrls => [...prevUrls, ...newResults]);
        setState('done');
        setControlState('all_results_ready');
        console.timeEnd("all_organic_urls");
      };

      fetchQuestions();
    }
  }, [controlState, urls]);






  useEffect(() => {
    const uniqueUrls = () => {
      return [...new Set(urls)];
    };

    updateFinalUrls();

    function updateFinalUrls() {
      setFinalUrls(uniqueUrls());
    }
  }, [urls]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalUrls.join('\n')).then(
      () => {
        console.log('Texto copiado al portapapeles');
      },
      (err) => {
        console.error('Error al copiar el texto: ', err);
      }
    );
  };


  function handleReload() {
    window.location.reload()
  }



  return (
    <div className='mb-24'>
      <div className="mb-5">

        <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">

          <ToolInfo
            title="El Prospector"
            description="Esta herramienta realiza una prospección de medios informacionales. Dada una keyword semilla analizará resultados de news y de preguntas de los usuarios. Ten en cuenta que aquellas palabras que no tengan PPAA devolverá un resultado vacío o no real, por ejemplo temáticas sensibles como escorts, armas, drogas, etc..."
          />

          <input placeholder="Introduce un listado de dominios. Debe haber una dominio por linea" className="textarea textarea-bordered w-3/5 mb-14 text-white"
            onChange={(e) => setQuery(e.target.value)}
          />


          {controlState === 'default' ? (<button className='btn bg-[#E5408E] text-white hover:bg-[#ac0a53]' onClick={getData}>Empezar Prospección</button>) :
            controlState === 'searchingNews' ? (<div className="flex flex-col items-center justify-center"><p className='text-[#E5408E] text-center'>Paso 1 de 5</p><button className="btn loading btn-ghost text-[#E5408E]">
              Buscando noticias relacionadas
            </button></div>)
              :
              controlState === 'newsFind' ? (<div className="flex flex-col items-center justify-center"><p className='text-[#E5408E] text-center'>Paso 2 de 5</p><button className="btn loading btn-ghost text-[#E5408E]">
                Buscando Preguntas Frecuentes
              </button></div>) :
                controlState === 'all_ppaa' ? (<div className="flex flex-col items-center justify-center"><p className='text-[#E5408E] text-center'>Paso 3 de 5</p><button className="btn loading btn-ghost text-[#E5408E]">
                  Buscando aún más Preguntas Frecuentes
                </button></div>) :

                  controlState === 'start_querys_organic' || controlState === 'all_ppaa_ready' ? (<div className="flex flex-col items-center justify-center"><p className='text-[#E5408E] text-center'>Paso 4 de 5</p><button className="btn loading btn-ghost text-[#E5408E]">
                    Analizando los resultados de las PPAA
                  </button></div>) :

                    controlState === 'saving_querys_organic' ? (<div className="flex flex-col items-center justify-center"><p className='text-[#E5408E] text-center'>Paso 5 de 5</p><button className="btn loading btn-ghost text-[#E5408E]">
                      Sacando resultados organicos de People Also Ask
                    </button></div>) :

                      controlState === 'all_results_ready' ? (<div><button className="btn btn-ghost text-error ">
                        Prospección realizada
                      </button><button className="btn px-16 btn-ghost text-[#E5408E] border-[#E5408E] text-[##E5408E] hover:bg-[#E5408E] hover:text-black" onClick={handleReload}>
                          Click To Reload and try again
                        </button></div>) :

                        controlState === 'error' ? (<div><button className="btn btn-ghost text-error ">
                          Ups! Ha habido un error.
                        </button><button className="btn px-16 btn-ghost text-[#E5408E] border-[#E5408E] text-[##E5408E] hover:bg-[#E5408E] hover:text-black" onClick={handleReload}>
                            Recarga la página para volver a realizar la consulta
                          </button></div>) :


                          ("")


          }



        </div>
      </div>

      {urls.length > 0
        ?
        (<div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">

          <textarea className="textarea text-white textarea-bordered w-3/5 h-[250px]" placeholder="Urls" value={finalUrls.join('\n')} readOnly>

          </textarea>

          {controlState === "all_results_ready" ? (<button onClick={copyToClipboard} className="btn btn-primary">
            Copiar URLs
          </button>) : (<button className="btn">
            Espera... gerenando más url's
          </button>)}




        </div>) : ("")


      }



    </div>
  )
}

export default Prospector