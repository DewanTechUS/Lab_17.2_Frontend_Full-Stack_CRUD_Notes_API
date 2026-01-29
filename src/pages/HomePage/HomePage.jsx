import { useEffect, useRef, useState } from "react";
import { getNotes } from "../../utilities/notes-api";
import CreateNoteForm from "../../components/CreateNoteForm/CreateNoteForm";
import NoteList from "../../components/NoteList/NoteList";

import bgVideo from "../../assets/bg.mp4";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  const [theme, setTheme] = useState("light");

  const videoRef = useRef(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.body.className = next;
  }

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;

    if (v.muted) {
      v.muted = false;
      v.volume = 0.25;
      setIsSoundOn(true);
    } else {
      v.muted = true;
      setIsSoundOn(false);
    }
  }

  useEffect(() => {
    document.body.className = theme;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        console.error(err);
        setError("Could not load notes. Check backend URL / CORS.");
      }
    })();
  }, []);

  return (
    <div className="page-shell">
      <video
        className="bg-video"
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="home-page">
        <header className="home-header">
          <h1 className="home-title">Dewan Mahmud's Full-Stack Notes (CRUD)</h1>

          <div className="top-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            <button className="music-toggle" onClick={toggleSound}>
              {isSoundOn ? "🔊 Sound On" : "🔈 Sound Off"}
            </button>
          </div>

          {error && <p className="home-error">{error}</p>}

          <footer className="app-footer">
            <p>
              <strong>Author:</strong> Dewan Mahmud · <strong>Project:</strong>{" "}
              Full-Stack CRUD Notes · <strong>Tech:</strong> React, Node.js,
              Express, MongoDB (MERN)
            </p>

            <p>
              <a
                href="https://www.linkedin.com/in/dewan-mahmud-a579a0265/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              {" | "}
              <a
                href="https://github.com/DewanTechUS"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              {" | "}
              <a href="https://dewantech.com" target="_blank" rel="noreferrer">
                Website
              </a>
            </p>

            <p>
              Repositories: Frontend & Backend maintained separately for
              clarity.
            </p>
          </footer>
        </header>

        <p className="app-note">
          <strong>Note:</strong> This application stores data in my database for
          learning purposes. Feel free to leave an inspiring, learning, or
          motivational message or any feedback. Thank you!
        </p>

        <main className="home-content">
          <CreateNoteForm notes={notes} setNotes={setNotes} />
          <NoteList notes={notes} setNotes={setNotes} />
        </main>
      </div>
    </div>
  );
}
