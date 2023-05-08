import axios from 'axios';

export const api = async (url, method, body = null, headers = {}) => {
  const URL_BACKEND = window.location.hostname === 'aiswtool.netlify.app' ? ('https://aisw.up.railway.app/') : ('http://localhost:3001/');
  

  const token = (localStorage.getItem('user-session') || '')
  .replace(/"/g, "") // Elimina todas las comillas
  .replace(/^Bearer\s+/i, "");
  
  
  
  const options = {
    method: method,
    url: URL_BACKEND + url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      'Authorization':`Bearer ${token}`,
      ...headers,
    },
    withCredentials: true,
  };

  // if (body) options.data = JSON.stringify(body);
  
  if (body) options.data = body;

  try {
    const response = await axios(options);
    if (response.status >= 200 && response.status < 400) {
      return response.data;
    } else {
      return Promise.reject();
    }
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};
