const express = require("express");
const router = express.Router()

const chatRouter = require("./chatRouter")
const serpScraperRouter = require("./serpScraperRouter")
const scraperRouter = require("./scraperRouter")
const asanaRouter = require("./asanaRouter")
const userRoutes = require("./userRouter")




router.use("/chat", chatRouter)
router.use("/user", userRoutes)
router.use("/scraper", scraperRouter)
router.use("/serpscraper",serpScraperRouter)
router.use("/asana",asanaRouter)



module.exports = router;