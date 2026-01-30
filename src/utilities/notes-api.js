const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function readJsonSafe(res, label) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${label} failed: ${res.status} ${text}`);
  }

  const text = await res.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} expected JSON but got: ${text.slice(0, 80)}...`);
  }
}

export async function getNotes() {
  const res = await fetch(`${BASE_URL}/api/notes`);
  const data = await readJsonSafe(res, "getNotes");
  return Array.isArray(data) ? data : [];
}

export async function createNote(formData) {
  const res = await fetch(`${BASE_URL}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return await readJsonSafe(res, "createNote");
}

export async function updateNote(noteId, formData) {
  const res = await fetch(`${BASE_URL}/api/notes/${encodeURIComponent(noteId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return await readJsonSafe(res, "updateNote");
}

export async function deleteNote(noteId) {
  const res = await fetch(`${BASE_URL}/api/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
  });

  if (res.status === 204) return null;

  return await readJsonSafe(res, "deleteNote");
}