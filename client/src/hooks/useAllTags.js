import { useEffect, useState } from "react";
import { db, collection, onSnapshot } from "../firebase";

export default function useAllTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notes"), (snap) => {
      const set = new Set();
      snap.forEach(doc => (doc.data().tags || []).forEach(t => set.add(String(t).toLowerCase())));
      setTags(Array.from(set).sort());
    });
    return () => unsub();
  }, []);

  return tags;
}
