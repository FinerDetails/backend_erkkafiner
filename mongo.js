const mongoose = require("mongoose")
const password = process.argv[2]
const url =
`mongodb+srv://finer_details:${password}@cluster0.lpfdylt.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})
const Person = mongoose.model("Person", personSchema)
const name = process.argv[3]
const number = process.argv[4]
const person = new Person(
	{
		"name": name,
		"number": number,
	})

if (process.argv.length<3) {
	console.log("give password as argument")
	process.exit(1)
}
else if (process.argv.length<4) {
	mongoose.connect(url)

	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
}
else {
	mongoose.connect(url)
	person.save().then(() => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}