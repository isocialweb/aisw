// server/authMiddleware.js
const { decode } = require('./jwt');


function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers['authorization'];

  if (!token) {
    console.log('No se proporcionó token de autenticación');
    return res.status(401).json({ msg: 'No se proporcionó token de autenticación' });
  }

  try {
    const decoded = decode(token);
    req.user = decoded;
    console.log('Token de autenticación válido:', decoded);
    next(); // Si el token es válido, continúa a la siguiente ruta/middleware.
  } catch (error) {
    console.log('Token de autenticación no válido:', error);
    res.status(401).json({ msg: 'Token de autenticación no válido' });
  }
}

module.exports = authMiddleware;
