const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const {asureAuth} = require('../middleware/autenticated')

const {
    urlScraper
} = require('../controllers/scraperController')


const routerScraper = Router()

routerScraper.post('/',[jsonParser, asureAuth],urlScraper)


module.exports =routerScraper