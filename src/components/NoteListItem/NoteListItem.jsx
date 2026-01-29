import { useEffect, useState } from "react";
import { deleteNote, updateNote } from "../../utilities/notes-api";

export default function NoteListItem({ note, setNotes, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: note.title || "",
    body: note.body || "",
    description: note.description || "",
    category: note.category || "",
    priority: note.priority || "low",
    completed: Boolean(note.completed),
    tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      title: note.title || "",
      body: note.body || "",
      description: note.description || "",
      category: note.category || "",
      priority: note.priority || "low",
      completed: Boolean(note.completed),
      tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
    });
    setError("");
    setIsEditing(false);
  }, [note._id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCancel() {
    setFormData({
      title: note.title || "",
      body: note.body || "",
      description: note.description || "",
      category: note.category || "",
      priority: note.priority || "low",
      completed: Boolean(note.completed),
      tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
    });
    setError("");
    setIsEditing(false);
  }

  async function handleSave() {
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    // Convert tags string -> array
    const payload = {
      title: formData.title.trim(),
      body: formData.body?.trim() || "",
      description: formData.description?.trim() || "",
      category: formData.category?.trim() || "",
      priority: formData.priority || "low",
      completed: Boolean(formData.completed),
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      setIsSaving(true);

      const updated = await updateNote(note._id, payload);

      setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Update failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setError("");

    try {
      setIsDeleting(true);
      await deleteNote(note._id);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
    } catch (err) {
      console.error(err);
      setError("Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
  <div className={`note-card note-card-${(index % 4) + 1}`}>
      {isEditing ? (
        <>
          <input
            className="note-input"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title..."
            disabled={isSaving || isDeleting}
          />

          <textarea
            className="note-textarea"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={3}
            placeholder="Body..."
            disabled={isSaving || isDeleting}
          />

          <input
            className="note-input"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description..."
            disabled={isSaving || isDeleting}
          />

          <input
            className="note-input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category..."
            disabled={isSaving || isDeleting}
          />

          <select
            className="note-input"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isSaving || isDeleting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              disabled={isSaving || isDeleting}
            />
            Completed
          </label>

          <input
            className="note-input"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)..."
            disabled={isSaving || isDeleting}
          />
        </>
      ) : (
        <>
          <h2 className="note-card-title">{note.title}</h2>
          <p className="note-card-body">{note.body}</p>

          {note.description && <p>Description: {note.description}</p>}
          {note.category && <p>Category: {note.category}</p>}
          <p>Priority: {note.priority || "low"}</p>
          <p>Status: {note.completed ? "Completed" : "Pending"}</p>

          {Array.isArray(note.tags) && note.tags.length > 0 && (
            <p>Tags: {note.tags.join(", ")}</p>
          )}
        </>
      )}

      {error && <p className="note-card-error">{error}</p>}

      <div className="note-card-actions">
        {isEditing ? (
          <>
            <button className="btn" onClick={handleSave} disabled={isSaving || isDeleting}>
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-ghost" onClick={handleCancel} disabled={isSaving || isDeleting}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => setIsEditing(true)} disabled={isDeleting}>
            Edit
          </button>
        )}

        <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting || isSaving}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
