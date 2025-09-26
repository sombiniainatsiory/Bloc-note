PWA_Tsiory_FI2401-064 — Guide de test

Mini-PWA de notes : liste, ajout (notif “note ajoutée”), édition, suppression, installable (manifest), utilisable hors-ligne (Service Worker + Firestore offline).

1) Prérequis

Node.js ≥ 18 et npm

Une connexion internet (la base est sur Firebase Firestore)

2) Installation rapide
# 1) Frontend
cd client
npm install
npm run build   # génère client/dist

# 2) Backend (sert le build)
cd ../server
npm install
npm run start   # lance le serveur sur http://localhost:8088




3) Lancer et tester

Ouvrir http://localhost:8088

Fonctionnalités

Page d’accueil = liste des notes

Bouton + (en bas à droite) → ajouter une note (notification “note ajoutée”)

Boutons Modifier / Supprimer sur chaque note

Bouton Exporter JSON (télécharge toutes les notes)

PWA

DevTools > Application → Manifest (valide) & Service Worker (activated)

Bouton Installer (ou icône du navigateur) pour épingler l’app

Mode Offline (DevTools > Network > Offline) → recharger : l’app s’ouvre grâce au cache

API de santé : http://localhost:8088/api/health → { "ok": true }

4) Firebase

La base Firestore est déjà configurée dans client/src/firebase.js.

Règles actuelles : lecture/écriture ouvertes sur la collection notes (pour tester toutes les actions).

# 5)Si vous préférez un test sans backend :

cd client
npm install
npm run dev   # http://localhost:5173


(Pour PWA/offline, la démo est plus fiable via le build + serveur.)