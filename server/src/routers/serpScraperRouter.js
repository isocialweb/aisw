const { Router } = require("express");
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const {asureAuth} = require('../middleware/autenticated')

const {
    newsScraper,
    urlsOrganicScraper,
    ppaaScraper,
    valueSerp
} = require('../controllers/serpScraperController')


const routerSerpScraper = Router()

routerSerpScraper.post('/news',[jsonParser,asureAuth],newsScraper)
routerSerpScraper.post('/organic',[jsonParser,asureAuth],urlsOrganicScraper)
routerSerpScraper.post('/ppaa',[jsonParser,asureAuth],ppaaScraper)
routerSerpScraper.post('/value',[jsonParser,asureAuth],valueSerp)


module.exports =routerSerpScraper