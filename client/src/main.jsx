import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";
import NotesList from "./pages/NotesList.jsx";
import AddNote from "./pages/AddNote.jsx";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,         
    children: [
      { index: true, element: <NotesList /> },        
      { path: "ajouter", element: <AddNote /> },  
      { path: "note/:id", element: <NoteDetail /> },
   
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// SW
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}
