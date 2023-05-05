const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()

const {
    text
} = require('../controllers/textController ')


const routerText = Router()

routerText.post('/',jsonParser,text)


module.exports =routerText