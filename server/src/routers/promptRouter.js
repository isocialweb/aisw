const { Router, express } = require("express");

const { createPrompt, getPromptsList, updatePrompt, deletePrompt} = require ('../controllers/promptController')


const routerPrompt = Router();

routerPrompt.post("/",createPrompt)
routerPrompt.get("/", getPromptsList)
routerPrompt.patch("/:id", updatePrompt)
routerPrompt.delete("/:id", deletePrompt)



module.exports = routerPrompt;