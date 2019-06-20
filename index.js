const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body);
});

app.use(cors());
app.use(bodyParser.json());
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body',
    ),
);
app.use(express.static('build'));

let persons = [
    {
        name: 'arto hellas',
        number: '040-123456',
        id: 1,
    },
    {
        name: 'ada lovelace',
        number: '39-44-5323523',
        id: 2,
    },
    {
        name: 'dan abramov',
        number: '12-43-234345',
        id: 3,
    },
    {
        name: 'mary poppendieck',
        number: '39-23-6423122',
        id: 4,
    },
];

const generateId = () => {
    const id = Math.floor(Math.random() * (999999 - 1)) + 1;
    return id;
};

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/info', (req, res) => {
    const people = persons.length;
    const date = new Date();
    const response = `<p>Phonebook has info of ${people} people</p><p>${date}</p>`;

    res.send(response);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    let id = generateId();
    let exists = false;

    if (!body.name) {
        return res.status(400).json({error: 'Name missing'});
    }
    if (!body.number) {
        return res.status(400).json({error: 'Number missing'});
    }

    persons.forEach(person => {
        if (body.name === person.name) {
            exists = true;
        }

        if (id === person.id) {
            id = generateId();
        }
    });

    if (exists) {
        return res
            .status(400)
            .json({error: 'Person already added, name must be unique'});
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id,
    };

    persons = persons.concat(person);
    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
