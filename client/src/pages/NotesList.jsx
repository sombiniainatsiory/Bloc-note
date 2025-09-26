import { useEffect, useState } from "react";
import {
  db, collection, onSnapshot, query, orderBy, serverTimestamp
} from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

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

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) =>
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  function exportJSON() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "notes_export.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function startEdit(n) {
    setEditId(n.id);
    setEditTitle(n.title || "");
    setEditContent(n.content || "");
  }
  function cancelEdit() { setEditId(null); setEditTitle(""); setEditContent(""); }

  async function saveEdit() {
    if (!editId || !editTitle.trim()) return;
    await updateDoc(doc(db, "notes", editId), {
      title: editTitle.trim(),
      content: editContent.trim(),
      updatedAt: serverTimestamp(),
    });
    await notif("Note modifiée ✏️");
    cancelEdit();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette note ?")) return;
    await deleteDoc(doc(db, "notes", id));
    await notif("Note supprimée 🗑️");
  }

  return (
    <>


      <section className="list">
        {notes.length === 0 && <div className="card muted">Aucune note pour l’instant.</div>}

        {notes.map(n => (
          <article className="card" key={n.id}>
            {editId === n.id ? (
              <div className="form">
                <input className="input" value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Titre" />
                <textarea className="textarea" rows={3} value={editContent} onChange={e=>setEditContent(e.target.value)} placeholder="Contenu" />
                <div className="actions">
                  <button className="btn btn-primary" onClick={saveEdit} type="button">Enregistrer</button>
                  <button className="btn btn-ghost" onClick={cancelEdit} type="button">Annuler</button>
                </div>
              </div>
            ) : (
              <>
                <div className="header-row">
                  <div className="note-title">{n.title}</div>
                  <div className="note-actions">
                    <button className="btn" onClick={()=>startEdit(n)} type="button">Modifier</button>
                    <button className="btn btn-danger" onClick={()=>handleDelete(n.id)} type="button">Supprimer</button>
                  </div>
                </div>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{n.content}</p>
                {n.updatedAt && <div className="muted" style={{ marginTop: 8 }}>Modifiée</div>}
              </>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
