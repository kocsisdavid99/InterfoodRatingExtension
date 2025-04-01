import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Replace this config with your Firebase project's settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;
let ratings = {};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    ratings = snap.exists() ? snap.data().ratings || {} : {};
    addRatingsToFoods();
  } else {
    signInWithPopup(auth, new GoogleAuthProvider()).catch(console.error);
  }
});

async function saveRating(name, rating) {
  if (!currentUser) return;
  ratings[name] = rating;
  const ref = doc(db, "users", currentUser.uid);
  await setDoc(ref, { ratings }, { merge: true });
}

function createStarRating(name, initialRating = 0, parentElem) {
  const container = document.createElement("div");
  container.className = "star-rating";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "space-between";
  container.style.marginTop = "5px";

  const stars = document.createElement("div");
  stars.style.display = "flex";
  stars.style.gap = "4px";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.dataset.index = i;
    star.style.color = i <= initialRating ? "gold" : "#ccc";
    star.style.cursor = "pointer";
    star.style.fontSize = "20px";

    star.addEventListener("click", () => {
      saveRating(name, i);
      updateStars(stars, i);
    });

    stars.appendChild(star);
  }

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.style.border = "none";
  delBtn.style.background = "transparent";
  delBtn.style.cursor = "pointer";
  delBtn.style.fontSize = "16px";
  delBtn.title = "Értékelés törlése";
  delBtn.addEventListener("click", async () => {
    if (!currentUser) return;
    const ref = doc(db, "users", currentUser.uid);
    console.log("🗑️ Deleting:", name);
    await setDoc(ref, {
      ratings: {
        [name]: deleteField()
      }
    }, { merge: true });
    delete ratings[name];
    const ratingElem = parentElem.querySelector(".star-rating-wrapper");
    if (ratingElem) ratingElem.remove();
    parentElem.removeAttribute("data-rating-applied");
  });

  container.appendChild(stars);
  container.appendChild(delBtn);
  return container;
}

function updateStars(starsContainer, rating) {
  const stars = starsContainer.querySelectorAll("span");
  stars.forEach((star) => {
    const idx = parseInt(star.dataset.index);
    star.style.color = idx <= rating ? "gold" : "#ccc";
  });
}

function addRatingToItem(item) {
  if (item.getAttribute("data-rating-applied") === "true") return;
  const nameElem = item.querySelector(".food-top-title");
  if (!nameElem) return;
  const name = nameElem.innerText.trim();
  const rating = ratings[name] || 0;
  const ratingElem = createStarRating(name, rating, item);
  const wrapper = document.createElement("div");
  wrapper.className = "star-rating-wrapper";
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.alignItems = "center";
  wrapper.appendChild(ratingElem);
  nameElem.appendChild(wrapper);
  item.setAttribute("data-rating-applied", "true");
}

function addRatingsToFoods() {
  const items = document.querySelectorAll("div.food");
  items.forEach(item => addRatingToItem(item));
}

setInterval(() => {
  if (currentUser) addRatingsToFoods();
}, 2000);
