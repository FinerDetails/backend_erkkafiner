const express = require("express")
var morgan = require("morgan")
const cors = require("cors")
const app = express()
require("dotenv").config()
const Person = require("./models/person")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))
morgan.token("post", function (req) { return JSON.stringify(req.body)})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post"))


app.get("/api/persons", (req, res) => {
	Person.find({}).then(result => {
		res.json(result)
	})
})
app.get("/api/persons/:id",(req, res, next) => {
	Person.findById(req.params.id).then(result => {
		if (result) {
			res.json(result)
		}
		else {
			res.send("404 Not Found")
			res.status(404).end()
		}
	})
		.catch(error => next(error))
})
app.get("/info",(req, res) => {
	const date = Date()
	Person.find({}).then(result => {
		const personsAmount = result.length
		res.send(`Phonebook has info of ${personsAmount} people. ${date}`)
	})
})
app.delete("/api/persons/:id",(req, res) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
})
app.put("/api/persons/:id", (req, res, next) => {
	const person = {
		name: req.body.name,
		number: req.body.number,
	}
	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.post("/api/persons",(req, res, next) => {
	const newPerson = req.body
	Person.find({}).then(result => {
		if (result.find(person => person.name === newPerson.name)){
			return res.status(400).json({
				error:"name not unique"
			})
		}
		else {
			const person = new Person({
				name: newPerson.name,
				number: newPerson.number
			})
			person.save().then(savedPerson => {
				res.json(savedPerson)
			})
				.catch(error => next(error))
		}
	})
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)