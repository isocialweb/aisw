import { useState, useEffect } from "react";
import RenderButton from "./toolsComponents/RenderButton";
import ToolInfo from "./toolsComponents/ToolInfo";
import DownloadCsvTable from "./toolsComponents/DownloadCsvTable";
import { splitArrayIntoGroups, parseString} from "@/utils/textUtils";
import { api } from "@/utils/api";
export default function MediaCategory() {
  //Variables principales (keywords, topics, urls, etc..)
  const [domains, setDomains] = useState("");
  //Variables de la lógica
  const regexDomain = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+)(?:\/|$)/;
  const cleanDomains = domains
    .split(/\r?\n/)
    .map((url) => url.replace(regexDomain, "$1"))
    .filter((domain) => domain.trim() !== "");
  const [finalPrompts, setFinalPrompts] = useState("");
  const [response, setResponse] = useState([]);
  const [buttonState, setButtonState] = useState("default");
    //Variables counter
  const [fetchCount, setFetchCount] = useState(0);
  const [fetchIndex, setFetchIndex] = useState(0);
  //Esta función convierte las cleanKeywords en paquetes de n que queramos y luego los mapea para separar los prompts en tantos como larga sea la array de grupos de KW
  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanDomains, 110);
    const prompts = groups.map(
      (group) =>
        `Clasifica SOLO en informacional (periodicos, magazines, revistas, blogs, medios de comunicación) o SOLO transaccional (ecommerce, servicios, alquiler...)(esta clave se llamará type) las siguientes webs "${group}". Devuelve la respuesta ESTRICTAMENTE una tabla en el formato solicitado sin cabeceras: | web | tipo |`
    );
    setFetchIndex(prompts.length);
    return prompts;
  }

  function createObjectsFromArray(table) {
    const rows = table.split("\n"); // Divide la tabla en filas
    const objects = rows.map((row) => {
      const columns = row.split("|").map((column) => column.trim()); // Divide la fila en columnas
      return {
        web: columns[1],
        type: columns[2],
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
    const functionName = "Media_Category";
    try {
      const res = await api("chat", "POST", {
        prompt,
        fetchIndex: prompts.length,
        functionName,
      });
      if (res !== null) {
        const table = extractTableFromResponse(res.response);
        const objects = createObjectsFromArray(table);
        // console.log("Objetos", objects);
        const newData = [...accumulatedData, ...objects];
        setResponse(newData);
        setFetchCount(fetchCount + 1);
        if (index === prompts.length - 1) {
          setButtonState("done");
        }
        processPrompts(index + 1, newData, prompts);
      }
    } catch (error) {
      // console.log("Error:", error);
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
 
  // if(response.length>0){console.log("response",response)}
  return (
    <div className="mb-24">
      <div className="mb-5">
        <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">
          <ToolInfo
            title="Media Category"
            description="Esta tool clasifica una web en informacional o transaccional."
          />

          <textarea
            placeholder="Introduce un listado de dominios. Debe haber una dominio por linea"
            className="textarea textarea-bordered w-3/5 h-[250px] mb-14 text-white"
            onChange={(e) => setDomains(e.target.value)}
          />

          <RenderButton
            state={buttonState}
            getData={handleProcessPrompts}
            handleReload={hadleReload}
            fetchCount={fetchCount}
            fetchIndex={fetchIndex}
          />
        </div>
      </div>

      {buttonState === "done" && response !== null ? (
        <div className="flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center ">
          <table className="table w-full mx-auto ">
            <thead className="text-center">
              <tr>
                <th className="tracking-wider text-white">Web</th>
                <th className="tracking-wider text-white">Tipo</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {response.map((row) => (
                <tr>
                  <td className="text-white " key={row.web}>
                    {row.web}
                  </td>
                  <td className="text-white " key={row.type}>
                    {row.type}
                  </td>
                </tr>
              ))}{" "}
              */
            </tbody>
          </table>
          <DownloadCsvTable response={response} />
        </div>
      ) : (
        buttonState === "error" && (
          <div className="flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center">
            <div tabindex="0" className="collapse group">
              <div className="collapse-title bg-base-100 text-primary-content text-center group-focus:text-secondary-content">
                Click to see Raw Data
              </div>
              <div className="collapse-content bg-base-100 text-primary-content group-focus:text-secondary-content">
                <p>{finalPrompts.split(" ")}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
