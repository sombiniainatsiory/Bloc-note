// client/src/pages/NotesList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { db, collection, onSnapshot, query, orderBy } from "../firebase";
import { formatDate } from "../utils/date";

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [activeTag, setActiveTag] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) =>
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  // Tags uniques pour la barre de filtre
  const tags = useMemo(() => {
    const all = new Set();
    for (const n of notes) (n.tags || []).forEach(t => all.add(t));
    return ["all", ...Array.from(all)];
  }, [notes]);

  // Filtrage côté client (simple et compatible offline)
  const filtered = useMemo(() => {
    if (activeTag === "all") return notes;
    return notes.filter(n => (n.tags || []).includes(activeTag));
  }, [notes, activeTag]);

  return (
    <>
      {/* Barre de filtres par tag */}
      <div className="card" style={{ marginBottom: 12, display:"flex", gap:8, flexWrap:"wrap" }}>
        {tags.map(t => (
          <button
            key={t}
            className={`chip ${activeTag === t ? "chip-active" : ""}`}
            onClick={() => setActiveTag(t)}
            type="button"
            aria-pressed={activeTag === t}
          >
            {t === "all" ? "Tous" : t}
          </button>
        ))}
      </div>

      <section className="list">
        {filtered.length === 0 && (
          <div className="card muted">Aucune note pour ce filtre.</div>
        )}

        {filtered.map((n) => (
          <Link
            key={n.id}
            to={`/note/${n.id}`}
            className="card"
            style={{ textDecoration: "none", color: "inherit", display:"block" }}
          >
            <div className="header-row">
              <div className="note-title">
                {n.title} {n.updatedAt && <span className="muted">(modifiée)</span>}
              </div>
              <div className="muted" style={{ whiteSpace: "nowrap" }}>
                {n.updatedAt ? (
                  <>Modifiée le {formatDate(n.updatedAt)}</>
                ) : (
                  <>Créée le {formatDate(n.createdAt)}</>
                )}
              </div>
            </div>

            {/* Aperçu 2 lignes */}
            <p className="preview-2lines">{n.content}</p>

            {/* Tags (petits chips) */}
            {n.tags?.length > 0 && (
              <div className="chips" style={{ marginTop: 8 }}>
                {n.tags.map((t) => (
                  <span key={t} className="chip chip-ghost">{t}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </section>
    </>
  );
}
