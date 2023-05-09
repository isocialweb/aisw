import { React, useEffect, useState } from 'react'
import { tokenDecoder } from '@/utils/localStorageUtils'
import { api } from '@/utils/api'
function PromptsUi() {
    const [reload, setReload] = useState(false)

    const [prompt, setPrompt] = useState("")
    const [promptTitle, setPromptTitle] = useState("")
    const userId = tokenDecoder()

    const sendData = async () => {

        try {
            const response = await api("prompt", "POST", { userId: userId, prompt: prompt, promptTitle: promptTitle })
            console.log(response)
        }
        catch (err) {
            console.log(err)
        }

    }




    return (


        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20">
            {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
            <div className="mx-auto max-w-3/5 flex flex-col">
                <input type="text" placeholder="Introduce el título de tu prompt" className="input input-bordered w-full mb-5" onChange={(e) => setPromptTitle(e.target.value)} />
                <select type="text" placeholder="Introduce el título de tu prompt" className="input input-bordered w-full mb-5" onChange={(e) => setPromptTitle(e.target.value)} />

                <textarea placeholder="Introduce tu mejor prompt" className="textarea textarea-bordered w-full h-[250px] mb-5 text-white"
                    onChange={(e) => setPrompt(e.target.value)} />
                <button className='btn btn-secondary' onClick={sendData}> Enviar prompt</button></div>
        </div>

    )
}

export default PromptsUi