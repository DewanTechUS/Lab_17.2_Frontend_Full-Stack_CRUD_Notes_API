import { useState } from "react";
import { createNote } from "../../utilities/notes-api";

export default function CreateNoteForm({ notes, setNotes }) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    description: "",
    category: "",
    priority: "low",
    completed: false,
    tags: "", // user types: "work, school, urgent"
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    // Convert tags string -> array
    const payload = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      priority: formData.priority,
      completed: formData.completed,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      const newNote = await createNote(payload);

      setNotes([newNote, ...(notes || [])]);

      setFormData({
        title: "",
        body: "",
        description: "",
        category: "",
        priority: "low",
        completed: false,
        tags: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create note.");
    }
  }

  return (
    <section className="create-note">
      <form className="create-note-form" onSubmit={handleSubmit}>
        <input
          className="create-note-input"
          name="title"
          placeholder="Title..."
          value={formData.title}
          onChange={handleChange}
        />

        <input
          className="create-note-input"
          name="body"
          placeholder="Body..."
          value={formData.body}
          onChange={handleChange}
        />

        <input
          className="create-note-input"
          name="description"
          placeholder="Description (optional)..."
          value={formData.description}
          onChange={handleChange}
        />

        <input
          className="create-note-input"
          name="category"
          placeholder="Category (optional)..."
          value={formData.category}
          onChange={handleChange}
        />

        <select
          className="create-note-input"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
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
          />
          Completed
        </label>

        <input
          className="create-note-input"
          name="tags"
          placeholder="Tags (comma separated)..."
          value={formData.tags}
          onChange={handleChange}
        />

        <button className="create-note-btn" type="submit">
          Add
        </button>
      </form>

      {error && <p className="create-note-error">{error}</p>}
    </section>
  );
}
