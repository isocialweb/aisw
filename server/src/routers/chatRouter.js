const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const authMiddleware = require('../utils/middleware')
const {asureAuth} = require('../middleware/autenticated')

const {
    chat
} = require('../controllers/chatController')


const routerChat = Router()

routerChat.post('/',[jsonParser,asureAuth],chat)


module.exports =routerChat