const jwt = require('../utils/jwt')

//*- Este Middleware servirá para validar que el token no esté expirado.
//*- De esta forma nos aseguraremos que los usuarios que no estén 
//*- autentificados no puedan llegar a la función final (en router/user)

function asureAuth (req, res, next){
   if(!req.headers.authorization){
    return res
        .status(403)
        .send({msg:"La petición no tiene la cabecera de autentificación"})
   }
   const token = req.headers.authorization.replace("Bearer ", "")
   
   try {
    const payload = jwt.decode(token)
    const {exp} = payload;
    const currentDate = new Date().getTime();

    if (exp <= currentDate) {
      return res.status(400).send({msg:"el token ha expirado"})
    }
    req.user = payload
    next()
    
   } catch (error) {
    return res.status(400).send({msg:"Token Invalido"})
    
   }
  
   
   
}



    


module.exports= {asureAuth}