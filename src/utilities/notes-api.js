const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export async function getNotes() {
  const res = await fetch(`${BASE_URL}/api/notes`);
  if (!res.ok) throw new Error("API Error! getNotes failed.");
  return res.json();
}

export async function createNote(formData) {
  const res = await fetch(`${BASE_URL}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("API Error! createNote failed.");
  return res.json();
}

export async function updateNote(noteId, formData) {
  const res = await fetch(`${BASE_URL}/api/notes/${encodeURIComponent(noteId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("API Error! updateNote failed.");
  return res.json();
}

export async function deleteNote(noteId) {
  const res = await fetch(`${BASE_URL}/api/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("API Error! deleteNote failed.");
  return res.status === 204 ? null : res.json();
}
