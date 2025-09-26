# Bloc Note

PWA de bloc-notes en **React (Vite)** avec **Firebase Firestore** :  
- ✅ Liste des notes (temps réel)
- ✅ Ajout (notif “note ajoutée”), **édition**, **suppression**
- ✅ **Installable** (manifest)
- ✅ **Hors-ligne** (Service Worker + persistance Firestore)
- ✅ Thème **clair/sombre**
- ✅ Page **Liste** (/) et page **Ajout** (/ajouter) via React Router

## Démo locale

### Prérequis
- Node.js ≥ 18 + npm
- Internet (Firestore hébergé)

### Lancer
```bash
# Frontend
cd client
npm install
npm run build  # génère client/dist

# Backend (sert le build)
cd ../server
npm install
npm run start  # http://localhost:8088
