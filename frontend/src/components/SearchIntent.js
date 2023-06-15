import { useState } from "react";
import RenderButton from "./toolsComponents/RenderButton";
import ToolInfo from "./toolsComponents/ToolInfo";
import DownloadCsvTable from "./toolsComponents/DownloadCsvTable";
import { splitArrayIntoGroups} from "@/utils/textUtils";
import { api } from "@/utils/api";

export default function SearchIntent() {
  const [response, setResponse] = useState([]);

  const [keywords, setKeywords] = useState("");
  const cleanKeywords = keywords.split(/\r?\n/);

  const [buttonState, setButtonState] = useState("default");
  const [finalPrompts, setFinalPrompts] = useState("");
  const [fetchCount, setFetchCount] = useState(0);
  const [fetchIndex, setFetchIndex] = useState(0);

  //Esta función convierte las cleanKeywords en paquetes de n que queramos y luego los mapea para separar los prompts en tantos como larga sea la array de grupos de KW
  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanKeywords, 100);
    const prompts = groups.map(
      (group) =>
        `Para el siguiente listado de palabras:${group}; devuelve por cada una de las keywords la intención de búsqueda (Informacional, Transaccional o Navegacional) y la etapa del embudo de conversión (Descubrimiento, Consideración o Conversión).Devuelve la respuesta ESTRICTAMENTE una tabla en el formato solicitado sin encabezados y en cada columna la siguiente información: | keyword | intention | etapa |`
    );
    setFetchIndex(prompts.length);
    return prompts;
  }

  function normalizeTableData(tableData) {
    return tableData
      .split("\n")
      .filter((row, index) => {
        if (index === 0) {
          return !row.includes("-") && 
                 !row.includes("keyword") && 
                 !row.includes("intention") &&
                 !row.includes("etapa");
        }
        return !row.includes("-");
      })
      .map((row) => {
        row = row.replace(/"/g, "");
        if (!row.startsWith("|")) {
          return "|" + row;
        } if (!row.endsWith("|")) {
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
        intention: columns[2],
        etapa: columns[3],
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
    const functionName = "SearchIntent";
    try {
      const res = await api("chat", "POST", {
        prompt,
        fetchIndex: prompts.length,
        functionName,
      });
      if (res !== null) {
        const normalizedResponse = normalizeTableData(res.response); 

        const table = extractTableFromResponse(normalizedResponse);

        const objects = createObjectsFromArray(table);

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

  return (
    <div className="mb-5">
      <div className="flex flex-col gap-5 items-center justify-start h-3/4 content-start">
        <ToolInfo
          title="Search Intent"
          description={
            "Analiza las intenciones de búsqueda y la etapa del funnel de tus palabras clave. Solo necesitas introducir un listado de hasta 100 palabras clave en el área de texto y nuestra herramienta clasificará cada palabra por intención de búsqueda y etapa del funnel. Cuando estés listo, haz clic en el botón Analizar.Después de unos segundos, podrás ver los resultados en una tabla fácil de leer. Recuerda que la herramienta clasifica las palabras clave según tres intenciones de búsqueda (Informacional, Transaccional o Navegacional) y tres etapas del funnel (Descubrimiento, Consideración o Conversión)."
          }
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
        <div className="flex items-center flex-col content-center justify-items-center w-3/5 pt-24 mx-auto ">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-white tracking-wider">Keyword</th>
                <th className="text-white tracking-wider">Search Intent</th>
                <th className="text-white tracking-wider">Etapa Funnel</th>
              </tr>
            </thead>
            <tbody>
              {response.map((row) => (
                <tr>
                  <td className="text-white " key={row.keyword}>
                    {row.keyword}
                  </td>
                  <td className="text-white " key={row.intention}>
                    {row.intention}
                  </td>
                  <td className="text-white " key={row.etapa}>
                    {row.etapa}
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
