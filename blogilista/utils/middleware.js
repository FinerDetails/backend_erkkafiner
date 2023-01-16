const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const tokenExtractor = (req, res, next) => {
	const auth = req.get("authorization")
	if (auth && auth.toLowerCase().startsWith("bearer ")) {
		req.token = auth.substring(7)
	}
	else if (!(auth && auth.toLowerCase().startsWith("bearer ")) || auth === null || auth === ""|| auth === undefined){
		return res.status(401).json({ error: "token missing" })
	}
	next()
}
const userExtractor = async (req, res, next) => {
	const token = req.token
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!decodedToken.id) {
		return res.status(401).json({ error: "token invalid" })
	}
	req.user = await User.findById(decodedToken.id)
	next()
}

const errorHandler = (error, req, res, next) => {
	if (error.name === "CastError") {
		return res.status(400).send({
			error: error.message
		})
	}
	else if (error.name === "ValidationError") {
		return res.status(400).json({
			error: error.message
		})
	}
	else if (error.code === 11000) {
		return res.status(400).json({
			error: "Username already in use"
		})
	}
	logger.info(error.message)
	next(error)
}
module.exports = { errorHandler, tokenExtractor, userExtractor }