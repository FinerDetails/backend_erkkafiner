const { response } = require('express')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('post', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons',(req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.send(`404 Not Found`)
        response.status(404).end()
    }
})
app.get('/info',(req, res) => {
    const personsAmount = persons.length
    const date = Date()
    res.send(`Phonebook has info of ${personsAmount} people. ${date}`)
})
app.delete('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons',(req, res) => {
    const newPerson = req.body
    if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({
            error:'missing content'
        })
    }
    else if (persons.find(person => person.name === newPerson.name)){
        return res.status(400).json({
            error:'name not unique'
        })
    }
    else {
        newPerson.id = Math.floor(Math.random() * 1000000)
        persons = persons.concat(newPerson)
        res.json(newPerson)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)