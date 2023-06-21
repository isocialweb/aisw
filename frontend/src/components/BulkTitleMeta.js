import { useState, useEffect } from "react";
import RenderButton from "./toolsComponents/RenderButton";
import ToolInfo from "./toolsComponents/ToolInfo";
import DownloadCsvTable from "./toolsComponents/DownloadCsvTable";
import { splitArrayIntoGroups, parseString } from "@/utils/textUtils";
import { api } from "@/utils/api";

export default function BulkTitleMeta() {
  const [response, setResponse] = useState([]);

  const [keywords, setKeywords] = useState("");
  const cleanKeywords = keywords.split(/\r?\n/);

  const [buttonState, setButtonState] = useState("default");
  const [finalPrompts, setFinalPrompts] = useState("");
  const [fetchCount, setFetchCount] = useState(0);
  const [fetchIndex, setFetchIndex] = useState(0);

  const GPT4 = "/api/chatGPT4";
  const GPT35 = "/api/chatGPT35_noAuth";

  //Esta función convierte las cleanKeywords en paquetes de n que queramos y luego los mapea para separar los prompts en tantos como larga sea la array de grupos de KW
  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanKeywords, 15);
    const prompts = groups.map(
      (group) =>
        `Eres un especialista SEO. Para el siguiente listado de palabras clave:${group}, devuelve por cada una de las keywords un titulo, una metadescripción y un h1 que sin ser el mismo que el title ataque a la misma intencionalidad de búsqueda y keyword. Los títulos tienen que ser originales y tener sentido.Devuelve la respuesta ESTRICTAMENTE una tabla en el formato solicitado sin encabezados y en cada columna la siguiente información: | keyword | title | metadescription | H1 |`
    );
    setFetchIndex(prompts.length);
    return prompts;
  }

  function normalizeTableData(tableData) {
    return tableData
      .split("\n")
      .filter((row, index) => {
        if (index === 0) {
          return (
            !row.includes("-") &&
            !row.includes("keyword") &&
            !row.includes("title") &&
            !row.includes("metadescription") &&
            !row.includes("H1")
          );
        }
        return !row.includes("-");
      })
      .map((row) => {
        row = row.replace(/"/g, "");
        if (!row.startsWith("|")) {
          return "|" + row;
        }
        if (!row.endsWith("|")) {
          row = row + "|"; // Añade "|" al final si no existe
        }
        return row;
      })
      .join("\n");
  }

  function createObjectsFromArray(table) {
    const rows = table.split("\n"); // Divide la tabla en filas
    const objects = rows.map((row) => {
      const columns = row.split("|").map((column) => column.trim());
      // Divide la fila en columnas
      return {
        keyword: columns[1],
        title: columns[2],
        metadescription: columns[3],
        H1: columns[4],
      };
    });
    return objects;
  }

  function extractTableFromResponse(response) {
    const startIndex = response.indexOf("|"); // Encuentra el índice del primer "|" en la respuesta
    const endIndex = response.lastIndexOf("|"); // Encuentra el índice del último "|" en la respuesta
    const table = response.substring(startIndex, endIndex + 1); // Extrae la parte de la respuesta que contiene la tabla de resultados
    return table;
  }

  //Esta función valida que el índice acumulado sea igual que el largo de prompts. Si es así seteará el resultado en FinalPrompts
  async function processPrompts(index, accumulatedData, prompts) {
    if (index === prompts.length) {
      // console.log("accumulated:",accumulatedData.toString());
      setFinalPrompts(accumulatedData.toString());

      return;
    }

    //Por cada índice del prompt realizaremos un fetch
    const prompt = prompts[index];
    const functionName = "BulkTitleMeta";
    try {
      const res = await api("chat", "POST", {
        prompt,
        fetchIndex: prompts.length,
        functionName,
      });
      if (res !== null) {
        const normalizedResponse = normalizeTableData(res.response); 
        console.log("normalizedResponse",normalizedResponse)

        const table = extractTableFromResponse(normalizedResponse);
        console.log("table:",table)

        const objects = createObjectsFromArray(table);
        console.log("objects:",objects)

        const newData = [...accumulatedData, ...objects];
        setResponse(newData);

        setFetchCount((prevCount) => prevCount + 1);
        if (index === prompts.length - 1) {
          setButtonState("done");
        }
        processPrompts(index + 1, newData, prompts);
      }
    } catch (error) {
      setButtonState("error");
    }
  }

  //OnClick principal. Ejecutará create splitPrompts y los procesará para el fetch)
  function handleProcessPrompts() {
    setButtonState("loading");
    createSplitPrompts().then((prompts) => processPrompts(0, [], prompts));
  }

  
  function hadleReload() {
    window.location.reload();
  }

  console.log(response)

  return (
    <div className="mb-5">
      <div className="flex flex-col gap-5 items-center justify-start h-3/4 content-start">
        <ToolInfo
          title="Bulk Title Meta & H1"
          description="La herramienta de IA crea títulos, meta descripciones y encabezados (h1) personalizados para palabras clave. Con solo un listado de KW, genera contenido optimizado para SEO, brindando soluciones rápidas y efectivas para mejorar la visibilidad en buscadores. Ahorra tiempo y obtén resultados convincentes para cada término clave en solo unos clics."
        />

        <textarea
          placeholder="Introduce un listado de keywords. Debe haber una Kw por linea"
          className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
          onChange={(e) => setKeywords(e.target.value)}
        />

        <RenderButton
          state={buttonState}
          getData={handleProcessPrompts}
          handleReload={hadleReload}
          fetchCount={fetchCount}
          fetchIndex={fetchIndex}
        />
      </div>

      {buttonState === "done" && response !== null ? (
        <div className="flex items-center flex-col content-center justify-items-center w-4/5 pt-24 mx-auto ">
          <table className="w-full mb-10">
            <thead className="bg-slate-800 h-10">
              <tr>
                <th className="text-white">Keyword</th>
                <th className="text-white">Titulo</th>
                <th className="text-white">Meta</th>
                <th className="text-white">h1</th>
              </tr>
            </thead>

            <tbody>
              {response.map((row) => (
                <tr>
                  <td
                    className="text-white overflow-auto px-10 py-3"
                    key={row.keyword}
                  >
                    {row.keyword}
                  </td>
                  <td
                    className="text-white overflow-auto px-10 py-3 "
                    key={row.title}
                  >
                    {row.title}
                  </td>
                  <td
                    className="text-white overflow-auto px-10 py-3"
                    key={row.metadescription}
                  >
                    {row.metadescription}
                  </td>
                  <td
                    className="text-white overflow-auto px-10 py-3"
                    key={row.H1}
                  >
                    {row.H1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <DownloadCsvTable response={response} />
        </div>
      ) : (
        buttonState === "error" && (
          <div className="flex items-center flex-col content-center justify-items-center w-3/5 pt-24 mx-auto ">
            <div tabindex="0" className="collapse group">
              <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
                Click to see Raw Data
              </div>
              <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
                <p>{finalPrompts}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
