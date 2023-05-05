const jwt = require('jsonwebtoken')
require('dotenv').config();

const jwtSecretKey= process.env.JWT_SECRET_KEY

function createAccesToken(user){
    const expToken = new Date();
    expToken.setHours(expToken.getHours()+6);

    const payload = {
        token_type:"access",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
        role: user.role,
        special:"isocialwebagency"
    }

    return jwt.sign(payload, jwtSecretKey)
}

function decode(token) {
    try {
      return jwt.verify(token, jwtSecretKey); 
    } catch (error) {
      console.error('Error al verificar el token JWT:', error);
      return null;
    }
  }

  function verify(token) {
    return jwt.verify(token, jwtSecretKey);
  }



module.exports={
    createAccesToken,
    decode,
    verify
}


