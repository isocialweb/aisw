import React from 'react'
import { useState, useMemo, useEffect } from 'react';
import ToolInfo from '../toolsComponents/ToolInfo';
import { api } from '@/utils/api';
import RenderButton from '../toolsComponents/RenderButton';
import DownloadCsvTable from '../toolsComponents/DownloadCsvTable';
function PpaaScraper() {
  const [keywords, setKeywords] = useState("");
  const cleanKeywords = useMemo(() => keywords.split(/\r?\n/), [keywords]);
  const [ppaa, setPpaa] = useState([]);
  const [buttonState, setButtonState] = useState("default");
  const [scrapedData, setScrapedData] = useState([])


  const fetchData = async (keyword) => {
    try {
      const data = await api("ppaa/", "POST", {
        key: keyword,
      });
      return data;
    } catch (error) {
      console.error(error);
      setButtonState("error")
      return null;
      
    }
  };
  
  
  const handleClick = async () => {
      setButtonState("loading")
      let results = [];
      if(cleanKeywords.length>0){
        for (const keyword of cleanKeywords) {
          const result = await fetchData(keyword);
          if (result !== null) { // add the result to the array only if it's not null
            results.push(result);
          }
        }
        setScrapedData(results.flat())
        setButtonState("done")
      }
    }
  
   const hadleReload = () => {
      window.location.reload();
    }
    if(scrapedData.length>0){
      console.log("data-scraped:",scrapedData)
  }

  const flatData = scrapedData.reduce((acc, curr) => {
    return [...acc, ...curr.data];
  }, []);



  return (
    <div className="mb-24">
      <div className="mb-5">
        <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">
          <ToolInfo
            title="PPAA Scraper"
            description="Dado un listado de KW, la herramienta nos devolverá PPAA de Google expandidos a aproximadamente entre 12 y 20 resultados"
          />

          <textarea
            placeholder="Introduce un listado de Keywords. Ejemplo: 'Mejores zapatillas deportivas' "
            className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
            onChange={(e) => setKeywords(e.target.value)}
          />

          <RenderButton
            state={buttonState}
            getData={handleClick}
            handleReload={hadleReload}
            
          />
        </div>
      </div>
      {buttonState === "done" && scrapedData !== null ? (
        <div className="flex items-center flex-col content-center justify-items-center w-4/5 pt-24 mx-auto ">
          <table className="w-full mb-10">
            <thead className="bg-slate-800 h-10">
              <tr>
                <th className="text-white">URL</th>
                <th className="text-white">PPAA</th>
                
              </tr>
            </thead>

            <tbody>
              {flatData.map((row) => (
                <tr>
                  <td
                    className="text-white text-center px-10 py-3"
                    key={row.keyword}
                  >
                    {row.keyword}
                  </td>
                  <td
                    className="text-white text-center px-10 py-3 "
                    key={row.ppaa}
                  >
                    {row.ppaa}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          <DownloadCsvTable response={flatData} />
        </div>
      ) : (
        buttonState === "error" && (
          <div className="flex items-center flex-col content-center justify-items-center w-3/5 pt-24 mx-auto ">
            <div tabindex="0" className="collapse group">
              <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
                Click to see Raw Data
              </div>
              <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
                <p>{flatData}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default PpaaScraper