# Interfood Rating Chrome Extension ⭐

This Chrome extension allows you to rate meals (1-5 stars) on [Interfood.hu](https://rendel.interfood.hu), and it syncs your ratings across devices using Firebase.

---

## 🚀 Features

- Star ratings from 1 to 5
- Ratings stored in Firebase per user
- Google Sign-In authentication
- Auto-sync across devices
- Stored ratings persist even across weeks (based on food name)
- Delete rating with a single click (❌)

---

## 🔧 Setup Instructions

### 1. Clone this repo
```bash
git clone https://github.com/yourusername/interfood-rating-extension.git
cd interfood-rating-extension
```

### 2. Create a Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com)
- Click **"Add Project"** → follow the steps
- Once created, go to **Project Settings** → **General**
- Under **"Your apps"**, click `</>` (Web App)
- Name it `InterfoodRatingExtension`, then click **Register app**

You will get a Firebase config like:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace the placeholder config in `injected.js` with your actual Firebase config.

---

### 3. Enable Firebase Authentication

- In Firebase Console, go to **Authentication** → **Sign-in method**
- Enable **Google** provider

---

### 4. Add Authorized Domain

Still under **Authentication → Settings**, add:

```
rendel.interfood.hu
```

To **Authorized domains**

---

### 5. Load Extension in Chrome

- Go to `chrome://extensions`
- Enable **Developer mode**
- Click **"Load unpacked"** → select the folder
- Make sure popup windows are **not blocked** for Interfood.hu

---

## 🧪 Optional Debugging

Open **Developer Console** on the site to see logs when:

- Signing in
- Saving/deleting ratings

---

## 📦 File Overview

- `manifest.json` — Chrome extension manifest
- `inject.js` — Injects module-based script
- `injected.js` — Main logic (rating, Firebase)
- `stars.css` — Simple CSS for star visuals
