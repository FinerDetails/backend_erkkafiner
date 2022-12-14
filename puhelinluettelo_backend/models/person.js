const mongoose = require("mongoose")
const url = process.env.MONGODB_URI
console.log("connecting to", url)
mongoose.connect(url)
	.then(() => {
		console.log("connected to MongoDB")
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message)
	})

const validateNumber = (number) => {
	const regex = /^\d{2,3}-[0-9]{5,}$/
	return regex.test(number)
}

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		minlength: 8,
		validate: validateNumber,
		required: true
	}
})

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Person", personSchema)