const { Router } = require("express");
const routerOwnPpaa = Router();
const { getResult } = require('../controllers/ownppaaController');
const bodyParser = require("body-parser");
let jsonParser = bodyParser.json()
const {asureAuth} = require('../middleware/autenticated')

routerOwnPpaa.post('/',[jsonParser, asureAuth], getResult);

module.exports = routerOwnPpaa;
