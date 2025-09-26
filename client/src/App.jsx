import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { setupInstallPrompt } from "./installPrompt";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) };
}

export default function App() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setupInstallPrompt("installBtn"); }, []);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">Bloc-NOTES</h1>
          <div className="badge">Notes • Firestore • PWA</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
        
          <button className="theme-toggle" onClick={toggle}>
            <span className="dot" /> {theme === "dark" ? "Sombre" : "Clair"}
          </button>

          <button id="installBtn" className="btn btn-ghost" style={{ display: "none" }}>
            Installer
          </button>

          
          {location.pathname === "/ajouter" ? (
            <button className="btn" onClick={() => navigate("/")}>Voir la liste</button>
          ) : (
            <Link className="btn btn-primary" to="/ajouter">+ Ajouter</Link>
          )}
        </div>
      </div>

  
      <Outlet />
    </div>
  );
}
