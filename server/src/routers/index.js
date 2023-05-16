const express = require("express");
const router = express.Router()

const chatRouter = require("./chatRouter")
const serpScraperRouter = require("./serpScraperRouter")
const scraperRouter = require("./scraperRouter")
const asanaRouter = require("./asanaRouter")
const userRoutes = require("./userRouter")
const promptRoutes = require('./promptRouter')




router.use("/chat", chatRouter)
router.use("/user", userRoutes)
router.use("/scraper", scraperRouter)
router.use("/serpscraper",serpScraperRouter)
router.use("/asana",asanaRouter)
router.use("/prompt",promptRoutes)



module.exports = router;