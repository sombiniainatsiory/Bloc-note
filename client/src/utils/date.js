// Gère Firestore Timestamp, Date, millisecondes, ou null/undefined
export function formatDate(ts) {
  const d = toDate(ts);
  if (!d) return "à l’instant"; // serverTimestamp() non résolu/offline
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

function toDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();        // Firestore Timestamp
  if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000);
  if (typeof ts === "number") return new Date(ts);                // millis
  if (ts instanceof Date) return ts;                              // JS Date
  return null;
}
