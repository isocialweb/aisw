const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const authMiddleware = require('../utils/middleware')
const {asureAuth} = require('../middleware/autenticated')

const {
    chat,
    chat4
} = require('../controllers/chatController')


const routerChat = Router()

routerChat.post('/',[jsonParser,asureAuth],chat)
routerChat.post('/gpt4',[jsonParser,asureAuth],chat4)


module.exports =routerChat