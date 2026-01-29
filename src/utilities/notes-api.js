// I am using CRUD
// Get all notes
export async function getNotes() {
  const res = await fetch("/api/notes");
  if (!res.ok) throw new Error("API Error! getNotes failed.");
  return res.json();
}
// create a new note
export async function createNote(formData) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("API Error! createNote failed.");
  return res.json();
}
// update an existing note
export async function updateNote(noteId, formData) {
  const res = await fetch(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("API Error! updateNote failed.");
  return res.json();
}
// delete a note
export async function deleteNote(noteId) {
  const res = await fetch(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("API Error! deleteNote failed.");
  return res.status === 204 ? null : res.json();
}
// if needed, more API functions can be added here
// I used full CRUD for practice // 