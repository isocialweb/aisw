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
        async function getPrompts(){
            try {
                const response = await api("prompt", "GET")
                console.log(response)
                
            } catch (error) {
                
            }
            
        }

        getPrompts();
      
    }, [])
    
    



    return (


        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20">
           



                <div className="mx-auto  max-w-7xl ">
          <div className=" py-12">
            <div className="px-4  sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center bg-slate-800 rounded-2xl px-10 py-14">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-white">Prompt Generator</h1>
                  <p className="mt-2 text-sm text-gray-300">
                  Aquí, podrás crear, editar y guardar todos tus prompts en un solo lugar de manera organizada y fácil de usar. Además, esta herramienta te permitirá listar tus prompts para que puedas acceder a ellos rápidamente y nunca pierdas una gran idea.
                    
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <ModalPrompts onChangeTitle={(e) => setPromptTitle(e.target.value)} onChangePrompt={(e) => setPrompt(e.target.value)} onChangeDepartment={(e) => setDepartment(e.target.value)} onClickData={sendData} buttonState={buttonState} formError={formError}/>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                        {people.map((person) => (
                          <tr key={person.email}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                              {person.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{person.title}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{person.email}</td>
                            <td className="badge mt-7 badge-primary whitespace-nowrap px-3 text-sm text-gray-300">{person.role}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <div className='flex flex-row gap-3 justify-center'> <button className='btn btn-error btn-outline'>Editar</button><PopUpText content="Ver prompt" 
                            
                            prompt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam efficitur ligula non ornare bibendum. Aliquam tempus magna leo, eget suscipit justo pharetra vitae. Vestibulum dignissim felis eu felis pulvinar consectetur. Quisque suscipit sapien quis ligula imperdiet, vel molestie purus tempus. Maecenas mollis ultrices eros, a vulputate mi lacinia at. Nulla facilisi. In eleifend felis augue, vitae auctor ligula posuere vel. Vivamus neque lorem, ultricies a dolor quis, pulvinar dictum enim.
Morbi dapibus tristique diam interdum viverra. Nunc sollicitudin eros erat, in interdum lectus molestie quis. Suspendisse mollis interdum mauris, quis tincidunt libero facilisis eu. Morbi fermentum neque ut urna posuere semper. Mauris accumsan lacus enim, eget porttitor ligula vestibulum ac. Proin tristique gravida ipsum et fermentum. Donec libero diam, viverra sed erat et, accumsan pretium ligula. Suspendisse vel dolor ante. Sed fermentum quis massa nec pellentesque. Etiam commodo mattis tristique. Aenean et tellus ac arcu vulputate finibus. Suspendisse potenti. Aenean quis metus in neque hendrerit feugiat."/> 
</div>
                           
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      

        </div>

    )
}

export default PromptsUi