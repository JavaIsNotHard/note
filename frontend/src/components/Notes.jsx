const Note = ({ note, callbackFunction }) => {
  const label = note.important ? 'set not important' : 'set important';
  return (
    <>
      <li className="note">
	{note.content}
	<button onClick={callbackFunction}>{label}</button>
      </li>
    </>
  )
}

export default Note
