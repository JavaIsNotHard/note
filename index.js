const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // json-parser middleware

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/api/notes', (request, response) => {
    response.json(notes);
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    response.json(note);
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
    return maxId + 1;
}

app.post('/api/notes', (request, response) => {
    const body = request.body;
    if (!body.content) {
	response.status(400).json({
	    error: "content is missing",
	})
    }

    const note = {
	id: generateId(),
	content: body.content,
	important: body.important
    }

    notes.push(note);

    response.json(note);
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.map(note => note.id === id);
    notes = notes.filter(note => note.id !== id);
    response.json(note);
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const body = request.body;
    const index = notes.findIndex(note => note.id === id);
    notes[index].important = body.important;
    response.json(notes[index]);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
