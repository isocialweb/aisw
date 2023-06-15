import { useState, useEffect } from "react";
import RenderButton from "./toolsComponents/RenderButton";
import ToolInfo from "./toolsComponents/ToolInfo";
import DownloadCsvTable from "./toolsComponents/DownloadCsvTable";
import { splitArrayIntoGroups, parseString } from "@/utils/textUtils";
import { api } from "@/utils/api";

export default function ProductsCategory() {
  const [products, setProducts] = useState("");
  const [topics, setTopics] = useState("");

  const cleanProducts = products.split(/\r?\n/);
  const cleanTopics = topics.split(/\r?\n/);

  const [finalPrompts, setFinalPrompts] = useState("");
  const [response, setResponse] = useState([]);

  const [buttonState, setButtonState] = useState("default");
  const [fetchCount, setFetchCount] = useState(0);
  const [fetchIndex, setFetchIndex] = useState(0);

  async function createSplitPrompts() {
    const groups = splitArrayIntoGroups(cleanProducts, 100);
    const prompts = groups.map(
      (group) =>
        `Clasifica los siguientes productos de una tienda online: ${group} en una de las siguientes categorías:${cleanTopics} y Devuelve la respuesta ESTRICTAMENTE una tabla en el formato solicitado sin encabezados y en cada columna la siguiente información: | product | category | `
    );
    setFetchIndex(prompts.length);
    return prompts;
  }


  function normalizeTableData(tableData) {
    return tableData
      .split("\n")
      .filter((row) => {
        return !row.includes("-") && 
               !row.includes("product") && 
               !row.includes("category"); 
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
      const columns = row.split("|").map((column) => column.trim()); // Divide la fila en columnas
      return {
        producto: columns[1],
        categoria: columns[2],
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
    const functionName = "productsCategory";
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

        setFetchCount(prevCount => prevCount + 1);
        if (index === prompts.length - 1) {
          setButtonState("done");
        }
        processPrompts(index + 1, newData, prompts);
      }
    } catch (error) {
      setButtonState("error");
    }
  }

  function handleProcessPrompts() {
    setButtonState("loading");
    createSplitPrompts().then((prompts) => processPrompts(0, [], prompts));
  }

  function hadleReload() {
    window.location.reload();
  }

  console.log(fetchCount);

  return (
    <div className="mb-5">
      <div className="flex flex-col items-center content-start justify-start gap-5 h-3/4">
        <ToolInfo
          title="Products Category"
          description="Clasifica fácilmente una lista de productos de una tienda online según la categoría que desees. Sólo necesitas ingresar el tipo de tienda (por ejemplo, tienda de deportes), una lista de productos y una lista de categorías para asignarlos. Después, haz clic en el botón de Procesar Prompts y espera unos segundos. ¡Listo! La herramienta te devolverá una tabla con los productos clasificados en sus categorías correspondientes. "
        />

        <textarea
          placeholder="Introduce un listado de productos a clasificar. Debe haber una Kw por linea"
          className="textarea text-white textarea-bordered w-3/5 h-[250px]  "
          onChange={(e) => setProducts(e.target.value)}
        />

        <textarea
          placeholder="Introduce un listado de topics. Debe haber un topic por linea"
          className="textarea text-white extarea-bordered w-3/5 h-[250px] mb-14 "
          onChange={(e) => setTopics(e.target.value)}
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
        <div className="flex flex-col items-center content-center w-3/5 pt-24 mx-auto justify-items-center ">
          <table className="table w-full mx-auto ">
            <thead className="text-center">
              <tr>
                <th className="tracking-wider text-white">Product</th>
                <th className="tracking-wider text-white">Categoría</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {response.map((row) => (
                <tr>
                  <td className="text-white " key={row.producto}>
                    {row.producto}
                  </td>
                  <td className="text-white " key={row.categoria}>
                    {row.categoria}
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
