import jwtDecode from "jwt-decode"

export const getStorageObject = (key) => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return null;
  };
  
  export const setStorageObject = (key, object) => {
    localStorage.setItem(key, JSON.stringify(object));
  };
  
  export const deleteStorageObject = (key) => {
    localStorage.removeItem(key);
  };
  
  export const getUserToken = () => {
    const session = getStorageObject('user-session');
     if (session) {
      return session.token;
    }
    return null;
  };
  export const getUserSession = () => {
    const session = getStorageObject('user-session');
    if (session) {
      return session.user;
    }
    return null;
  };
  
  export const setUserSession = (sessionData) => {
    setStorageObject('user-session', sessionData);
  };
  
  export const removeSession = () => {
    deleteStorageObject('user-session');
  };


  export const logout=()=>{
          
      try {
       window.localStorage.removeItem("user-session")
       window.location.reload()
      } catch (error) {
        throw error
      }
    }
  
  

  export const tokenDecoder = () =>{
    const userSession = jwtDecode(window.localStorage.getItem('user-session'))
    const userId= (userSession.user_id)
    return userId

} 