import { React, useEffect, useState } from 'react'
import { tokenDecoder } from '@/utils/localStorageUtils'
import { api } from '@/utils/api'
import ModalPrompts from './ModalPrompts'
import PopUpText from './PopUpText'
function PromptsUi() {
  const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Pedro Almodovar', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
  ]

  const [reload, setReload] = useState(false)
  const [buttonState, setButtonState] = useState('default')
  const [formError, setFormError] = useState(false);

  const [prompt, setPrompt] = useState("")
  const [promptTitle, setPromptTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [promptsGetData, setPromptsGetData] = useState([])
  const userId = tokenDecoder()

  const sendData = async () => {
    // Verificar si los campos están vacíos
    if (!prompt || !promptTitle || !department) {
      setFormError(true);
      return;
    }

    try {
      const response = await api("prompt", "POST", {
        userId: userId,
        prompt: prompt,
        promptTitle: promptTitle,
        department: department
      });
      setButtonState("loading");
      console.log(response)
      setTimeout(() => {
        setButtonState("save");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    async function getPrompts() {
      try {
        const response = await api("prompt", "GET")
        setPromptsGetData(response)

      } catch (error) {

      }

    }

    getPrompts();

  }, [])


  promptsGetData && (console.log(promptsGetData))


  return (
    <div className="container my-16">
      <section id='prompts-header'>

        <div className="sm:flex sm:items-center rounded-2xl px-12 py-14 min-w-full bg-slate-800">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">Prompt Generator</h1>
            <p className="mt-2 text-sm text-gray-300">
              Aquí, podrás crear, editar y guardar todos tus prompts en un solo lugar de manera organizada y fácil de usar. Además, esta herramienta te permitirá listar tus prompts para que puedas acceder a ellos rápidamente y nunca pierdas una gran idea.

            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <ModalPrompts onChangeTitle={(e) => setPromptTitle(e.target.value)} onChangePrompt={(e) => setPrompt(e.target.value)} onChangeDepartment={(e) => setDepartment(e.target.value)} onClickData={sendData} buttonState={buttonState} formError={formError} />
          </div>
        </div>

      </section>


      
      <section id='prompts-tb'>


      <div className="mt-5 flow-root">
        
          <div className="inline-block min-w-full py-10 align-middle sm:px-6 lg:px-8 bg-slate-800 rounded-2xl ">
            <table className="min-w-full divide-y divide-gray-700 mt-6">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                    Título
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Creador
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Departamento
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {promptsGetData.map((element) => (
                  <tr key={element.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                      {element.promptTitle}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{element.userName}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{element.userEmail}</td>
                    <td className="badge mt-7 badge-primary whitespace-nowrap px-3 text-sm text-gray-300 ml-8">{element.department}</td>

                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <div className='flex flex-row gap-3 justify-center'> <button className='btn btn-error btn-outline'>Editar</button>
                        <PopUpText id={element._id} content="Ver prompt"
                          contenido={element.prompt} />
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
      </div>


      </section>




    </div>
  )
}

export default PromptsUi