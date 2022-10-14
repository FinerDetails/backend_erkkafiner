const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
const blogsRouter = require("./controllers/blog")
const mongoose = require("mongoose")
//const logger = require("./utils/logger")

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())
app.use("/api/blogs", blogsRouter)

module.exports = app