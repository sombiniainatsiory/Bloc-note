// client/src/pages/NoteDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatDate } from "../utils/date";

function parseTags(input) {
  return Array.from(new Set(input.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean))).slice(0,10);
}

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

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  useEffect(() => {
    const ref = doc(db, "notes", id);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) { navigate("/"); return; }
      const data = { id: snap.id, ...snap.data() };
      setNote(data);
      setTitle(data.title || "");
      setContent(data.content || "");
      setTagsStr((data.tags || []).join(", "));
    });
    return () => unsub();
  }, [id, navigate]);

  async function save() {
    if (!title.trim()) return;
    const tags = parseTags(tagsStr);
    await updateDoc(doc(db, "notes", id), {
      title: title.trim(),
      content: content.trim(),
      tags,
      updatedAt: serverTimestamp(),
    });
    await notif("Note modifiée ✏️");
    setEditMode(false);
  }

  async function remove() {
    if (!confirm("Supprimer cette note ?")) return;
    await deleteDoc(doc(db, "notes", id));
    await notif("Note supprimée 🗑️");
    navigate("/");
  }

  if (!note) return null;

  return (
    <section className="card" style={{ maxWidth: 820, margin: "0 auto" }}>
      <div className="header-row">
        <Link className="btn" to="/">← Retour à la liste</Link>
        <div style={{ display:"flex", gap:8 }}>
          {!editMode && <button className="btn" onClick={()=>setEditMode(true)}>Modifier</button>}
          <button className="btn btn-danger" onClick={remove}>Supprimer</button>
        </div>
      </div>

      {editMode ? (
        <div className="form">
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="textarea" rows={8} value={content} onChange={e=>setContent(e.target.value)} />
          <input className="input" placeholder="Tags (cours, perso)" value={tagsStr} onChange={e=>setTagsStr(e.target.value)} />
          <div className="actions">
            <button className="btn btn-ghost" onClick={()=>setEditMode(false)}>Annuler</button>
            <button className="btn btn-primary" onClick={save}>Enregistrer</button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="note-title" style={{ marginTop: 8 }}>
            {note.title} {note.updatedAt && <span className="muted">(modifiée)</span>}
          </h2>
          <div className="muted" style={{ margin: "6px 0 12px" }}>
            Créée le {formatDate(note.createdAt)}
            {note.updatedAt ? <> • Modifiée le {formatDate(note.updatedAt)}</> : null}
          </div>

          {note.tags?.length > 0 && (
            <div className="chips" style={{ marginBottom: 12 }}>
              {note.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          )}

          <div style={{ whiteSpace: "pre-wrap", fontSize: 16 }}>
            {note.content}
          </div>
        </>
      )}
    </section>
  );
}
