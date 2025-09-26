import { useState } from "react";
import { db, collection, addDoc, serverTimestamp } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

async function notif(msg) {
  try {
    if (!("Notification" in window)) return alert(msg);
    if (Notification.permission === "granted") return new Notification(msg);
    if (Notification.permission !== "denied") {
      const p = await Notification.requestPermission();
      if (p === "granted") return new Notification(msg);
    }
  } catch {}
  alert(msg);
}

export default function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await addDoc(collection(db, "notes"), {
      title: title.trim(),
      content: content.trim(),
      createdAt: serverTimestamp(),
    });
    await notif("Note ajoutée ✅");
    navigate("/")
  }

  return (
    <section className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="header-row">
        <h2 style={{ margin: 0 }}>Nouvelle note</h2>
        {/* <Link className="btn" to="/">Voir la liste</Link> */}
      </div>

      <form className="form" onSubmit={submit}>
        <input
          className="input"
          placeholder="Titre"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          rows={5}
          placeholder="Contenu"
          value={content}
          onChange={e=>setContent(e.target.value)}
        />
        <div className="actions">
          <Link className="btn btn-ghost" to="/">Annuler</Link>
          <button className="btn btn-primary" type="submit">Ajouter</button>
        </div>
      </form>
    </section>
  );
}
