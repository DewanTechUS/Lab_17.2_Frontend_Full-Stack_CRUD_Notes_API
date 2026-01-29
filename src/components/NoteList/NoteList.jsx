import NoteCard from "../NoteListItem/NoteListItem";

export default function NoteList({ notes, setNotes }) {
  if (!notes || notes.length === 0) {
    return <p className="note-list-empty">No notes yet.</p>;
  }

  return (
    <div className="note-list">
      {notes.map((note, index) => (
        <NoteCard
          key={note._id}
          note={note}
          setNotes={setNotes}
          index={index}
        />
      ))}
    </div>
  );
}
