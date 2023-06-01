const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const {asureAuth} = require('../middleware/autenticated')

const {
    urlScraper,
    urlScraperTitle
} = require('../controllers/scraperController')


const routerScraper = Router()

routerScraper.post('/',[jsonParser, asureAuth],urlScraper)
routerScraper.post('/title',[jsonParser, asureAuth],urlScraperTitle)


module.exports =routerScraper