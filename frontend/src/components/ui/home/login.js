import React, { useState } from 'react'
import { api } from '@/utils/api'
import { setUserSession } from '@/utils/localStorageUtils'
import { useRouter } from 'next/navigation';



function Login() {

const router = useRouter()


const [credentials, setCredentials] = useState({email:"", password:""})
const [error, setError] = useState(null);
function handleChange (e){
setCredentials({
    ...credentials,
    [e.target.name]:e.target.value
})



}


async function fetchInfo() {
  try {
    const response = await api("user/login", "POST", credentials)
    
    setUserSession(response)
    router.push('/ia-tools')
    return response
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
}


async function handleSubmit(e){
  e.preventDefault()
  try {
    const response = await fetchInfo()
    
  } catch (error) {
    setError("Usuario o contraseña incorrectos")
  }
}


   
   

  return (
    <div className="mb-5">

<section className="relative flex flex-wrap lg:h-screen lg:items-center bg-black rounded-3xl">
  <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
    <div className="mx-auto max-w-lg text-center">
      <h1 className="header_gradient">AI SOCIALWEB</h1>

      <p className="mt-4 text-gray-500">
      Sign in and start optimizing time in your daily work thanks to our AI connected tools
      </p>
    </div>

    <form action="" className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Enter email"
            onChange={handleChange}
          />

         
        </div>
      </div>

      <div>
        <label htmlFor="password" className="sr-only">Password</label>

        <div className="relative">
          <input
           id="password"
           name="password"
           type="password"
           autoComplete="current-password"
           required
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Password"
            onChange={handleChange}
          />
         
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
      {error && <div className="text-red-600 text-center mb-3">{error}</div>}
        <button
          type="submit"
          className="inline-block rounded-lg bg-[#E5408E] px-5 py-3 text-sm font-medium text-white w-full"
        >
          Sign in
        </button>
      </div>
    </form>
  </div>

  <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
    <img
      alt="Welcome"
      src="/hero_3.png"
      className="absolute inset-0 h-full w-full object-cover rounded-3xl"
    />
  </div>
</section>

  
  
  
  </div>
  )
}

export default Login