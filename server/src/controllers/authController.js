const User = require("../database/schemas/user");
const jwt = require("../utils/jwt")
const bcrypt = require("bcryptjs");



//*TODO Quitar todos los msg sin {}. Fuera send, todo JSON

async function register(req, res) {
    const { password, email, nombre, apellido, avatar } = req.body;

    if (!password) return res.status(400).send({ msg: "El password es obligatorio" });
    if (!email) return  res.status(400).send({ msg: "El email es obligatorio" });

    // Si las validaciones anteriores están OK, crearemos el nuevo usuario
    const user = new User({
        email: email.toLowerCase(),
        password,
        nombre,
        apellido,
        avatar
    });

    // Necesitamos hashear en este punto la contraseña con bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    // Guardamos el usuario en DB
    try {
        const userStorage = await user.save();
        return res.status(200).send(userStorage);
    } catch (error) {
        return res.status(400).send({ msg: "Error al crear el usuario" });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!password) return res.status(400).json({ msg: "El password es obligatorio" });
        if (!email) return res.status(400).json({ msg: "El email es obligatorio" });

        const emailLowerCase = email.toLowerCase();
        try {
            const userStore = await User.findOne({ email: emailLowerCase });

            if (!userStore) {
               return res.status(404).send({ msg: "Usuario no encontrado" });
            } else {
                const check = await bcrypt.compare(password, userStore.password);

                if (!check) {
                    return res.status(500).send({ msg: "Contraseña Incorrecta" });
                } else {
                    return res.status(200).json(jwt.createAccesToken(userStore));
                    const token = jwt.sign(payload, JWT_SECRET);
                    console.log(token);
                }
            }
        } catch (error) {
            return res.status(500).send({ msg: "Error del servidor" });
        }
    } catch (e) {
        console.log(e);
    }
}

function refreshAccessToken(req, res) {
    const { token } = req.body;

    if (!token) return res.status(400).send({ msg: "token requerido" })

    const { _id } = jwt.decoded(token);
    console.log(_id)

    User.findOne({ id: _id }, (error, userStorage) => {

        if (error) {
            return res.status(500).send({ msg: "error del servidor" })
        } else {
           return res.status(200).send({
                accessToken: jwt.createAccessToken(userStorage)

            });

        }
    })


}


const { decode } = require('../utils/jwt'); // Asegúrate de importar la función "decode" de tu archivo "jwt.js"




module.exports = {
    register,
    login,
    refreshAccessToken,
    
}