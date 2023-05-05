const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const authMiddleware = require('../utils/middleware')
const {asureAuth} = require('../middleware/autenticated')

const {
    asana_tasks,
    asanaHandler
    
} = require('../controllers/asanaController')


const routerAsana = Router()

routerAsana.get('/',[jsonParser, asureAuth],asana_tasks)
routerAsana.post('/',[jsonParser,asureAuth],asanaHandler)


module.exports =routerAsana