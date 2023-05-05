import { useState } from 'react';

export default function HolaMundo() {
  
const [res, setRes] = useState("")
const [prompt, setPrompt]=useState("")

function getData() {
  fetch('http://localhost:3005/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  })
    .then((res) => res.json())
    .then((data) => setRes(data.response))
    .catch((error) => {
      console.log('Error:', error);
    });
}


  return (
    <div className='flex flex-col gap-3.5 items-center justify-center content-center h-screen'>
      <textarea className="textarea textarea-bordered w-3/5"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button className="btn btn-outline btn-accent" onClick={getData}>
        Send Query
      </button>
      <div className="bg-slate-600 w-3/5 rounded-md p-8" >{res}</div>
      </div>
  )
}
