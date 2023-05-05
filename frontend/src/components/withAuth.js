// components/withAuth.js
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import jwtDecode from 'jwt-decode';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const storedToken = localStorage.getItem('user-session');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp < currentTime) {
            // Token expirado
            Router.replace('/');
          } else if (!decoded.special || decoded.special !== 'isocialwebagency') {
            // Verificación de la clave especial en el payload
            Router.replace('/');
          }
          else {
            // Token válido
            setToken(storedToken);
            
          }
        } catch (error) {
          // Token inválido
          Router.replace('/');
        }
      } else {
        // Token no presente
        Router.replace('/');
      }
      setLoading(false);
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return token ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
