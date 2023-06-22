import React from "react";
import { useState, useMemo } from "react";
import RenderButton from "../toolsComponents/RenderButton";
import ToolInfo from "../toolsComponents/ToolInfo";
import DownloadCsvTable from "../toolsComponents/DownloadCsvTable";
import { api } from "@/utils/api";

function UrlDataScraperMeta() {
  const [url, setUrl] = useState("");
  const clearUrl = useMemo(() => url.split(/\r?\n/), [url]);
  const [buttonState, setButtonState] = useState("default");
  const [scrapedData, setScrapedData] = useState([])

 const fetchData = async (url) => {
  const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  try {
    const data = await api("scraper/", "POST", {
      url: validUrl,
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
    if(clearUrl.length>0){
      for (const url of clearUrl) {
        const result = await fetchData(url);
        if (result !== null) { 
          results.push(result);
        }
      }
      setScrapedData(results)
      setButtonState("done")
    }
  }

 const hadleReload = () => {
    window.location.reload();
  }
  if(scrapedData.length>0){
    console.log("data-scraped:",scrapedData)
}
  return (
    <div className="mb-24">
      <div className="mb-5">
        <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">
          <ToolInfo
            title="Url Data Scraper"
            description="Analiza el H1, el metaTitle y la meta description de una lista de URLS"
          />

          <textarea
            placeholder="Introduce un listado de URL's. Debe haber una url por linea. Ej: https://growwer.com o https://www.isocialweb.agency/sobre-nosotros/"
            className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
            onChange={(e) => setUrl(e.target.value)}
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
                <th className="text-white">H1</th>
                <th className="text-white">Title</th>
                <th className="text-white">Description</th>
              </tr>
            </thead>

            <tbody>
              {scrapedData.map((row) => (
                <tr>
                  <td
                    className="text-white overflow-auto px-10 py-3"
                    key={row.fullUrl}
                  >
                    {row.fullUrl}
                  </td>
                  <td
                    className="text-white overflow-auto px-10 py-3 "
                    key={row.H1}
                  >
                    {row.H1}
                  </td>
                  <td
                    className="text-white overflow-auto px-10 py-3"
                    key={row.title}
                  >
                    {row.title}
                  </td>
                  <td
                    className="text-white overflow-auto px-10 py-3"
                    key={row.description}
                  >
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <DownloadCsvTable response={scrapedData} />
        </div>
      ) : (
        buttonState === "error" && (
          <div className="flex items-center flex-col content-center justify-items-center w-3/5 pt-24 mx-auto ">
            <div tabindex="0" className="collapse group">
              <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
                Click to see Raw Data
              </div>
              <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
                <p>{scrapedData}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default UrlDataScraperMeta;
