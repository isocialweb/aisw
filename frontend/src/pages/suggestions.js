// import { response } from 'express';
import { useState, useEffect } from 'react';
import AsanaCard from '@/components/ui/AsanaCard';
import NavBar from '@/components/ui/NavBar';
import { api } from '@/utils/api';
import axios from 'axios';
import withAuth from '@/components/withAuth';

function AsanaApi() {
  const [data, setData] = useState([]);
  
  //datos body fetch POST
  const customFieldValues= {
    'seo': '1204312101738450',
    'ppc': '1204312101738451',
    'growwer': '1204312101738452',
    'cro': '1204312101738453',
    'otros': '1204312101738454',
    
  }
  const [title, setTitle] = useState("")
  const [reload,setReload] =useState(false)
  const [description, setDescription] = useState("")
  const [customField,setCustomField] = useState("")

    
 async function handleClick(event){
  event.preventDefault();

  try{
    const customFieldValue = customFieldValues[customField];
    const response = await api('asana',"POST",{title:title,description:description,customFieldValue:customFieldValue})
    setReload(!reload)
    
  }catch (error) {
    console.error(error);
  

 }

}
 
useEffect(() => {
  async function getTasks() {
    try {
      let response = await api("asana", "GET");
      response = response.data
     
      setData(response);
    } catch (error) {
      console.log(error);
    }
  }

  // Llamamos a la función getTasks
  getTasks();
}, [reload]);
  
  // function hadleReload(){
  //   window.location.reload()
  // }

 
  return (
    <>
    <NavBar />
    <div className='w-full  flex flex-col content-center justify-center items-center bg-gray-900 text-white' >

      <section className='flex flex-row content-center justify-center items-center'>


     
    <section>
<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg text-center">
    <h1 className="header_gradient">Sugerencias</h1>

    <p className="mt-4 text-white">
    ¿Tienes alguna sugerencia para mejorar la herramienta? Completa el formulario y nos pondremos a trabajar en ello
    </p>
  </div>

  <form action="" className="mx-auto mt-8 mb-0 max-w-md space-y-4">
    <div>
      

      <div className="relative">
        <input
          type="text" 
          placeholder="Introduce el título de tu sugerencia" 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm text-black"
          
        />
        
      </div>
    </div>

    <div>
      

      <div className="relative">
        <textarea
          placeholder="Introduce una pequeña descripción de tu sugerencia" onChange={(e) => setDescription(e.target.value)} 
          className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm text-black"/>                
      </div>
    </div>

    <div className="flex items-center justify-between">
    <select className="select select-bordered bg-white w-full max-w-xs text-slate-500" onChange={(e)=>setCustomField(e.target.value)}>
           <option >Elige el departamento</option>
            <option>seo</option>
            <option>ppc</option>
            <option>cro</option>
            <option>growwer</option>
            <option>otros</option>

          </select>
      

      <button
        type="submit"
        className="btn btn-secondary px-7"
        onClick={handleClick}
      >
        Enviar
      </button>
    </div>
  </form>
</div>
      </section>

      </section>


      <section className="bg-gray-900 text-white h-screen">
  <div
    className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8"
  >
     
     
      <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
     
{data ? data.filter(e => {
              const suggestionCustomField = e.custom_fields.find(cf => cf.display_value === 'suggestion');
              return suggestionCustomField != null;
            }).map((e) => {
              const suggestionCustomField = e.custom_fields.find(cf => cf.display_value === 'suggestion');
              const department = suggestionCustomField ? suggestionCustomField.display_value : '';
              return <AsanaCard name={e.name} section={e.memberships[0].section.name} department={department} notes={e.notes}/>;
            }) : ""}
     
    </div>
      </div>
      </section>


      

     
    </div>


    </>
  );


}



export default withAuth(AsanaApi)