import { useState, useEffect } from 'react'
import Note from './components/Notes';
import noteService from './services/noteService';
import './index.css';

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Kathmandu</em>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('add new note...');
  const [isImportant, setIsImportant] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNote => {
	setNotes(initialNote);
    });
  }, [])

  const notesToShow = isImportant ? notes.filter(note => note.important === true) : notes

  const addNote = (event) => {
    event.preventDefault();

    const note = {
      content: newNote, 
      important: Math.random() > 0.5,
    }

    noteService
      .create(note)
      .then(returnedNote => {
	setNotes([...notes, returnedNote]);
	setNewNote('');
      })
  }

  const onNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const toggleImportance = (id) => {
    const note = notes.find(note => note.id === id);
    const updatedNote = {...note, important: !note.important};
    noteService
      .update(id, updatedNote)
      .then(returnedNote => {
	setNotes(notes.map(note => (note.id === id ? returnedNote : note)));
      })
      .catch(error => {
	setErrorMessage(`Note ${note.content} was already deleted from the server`);
	setTimeout(() => {
	  setErrorMessage(null)
	}, 5000)
	setNotes(notes.filter(n => n.id !== id));
      })
  }

  return (
    <>
      <h1>Notes:</h1>
      <Notification message={errorMessage}/>
      <div>
	<button onClick={() => {setIsImportant(!isImportant)}}>show {isImportant ? 'all' : 'important'}</button>
      </div>
      <div>
	{notesToShow.map(note => <Note key={note.id} note={note} callbackFunction={() => toggleImportance(note.id)}/>)}
      </div>
      <div>
	<h2>Add new note: </h2>
	<div>
	  <form onSubmit={addNote}>
	    <input value={newNote} onChange={onNoteChange} />
	    <button type="submit">submit</button>
	  </form>
	</div>
      </div>
      <Footer />
    </>
  )
}

export default App
