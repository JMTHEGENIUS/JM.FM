import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const auth = window.firebaseAuth;
const db = window.firebaseDB;

// === SIGN UP FORM ===
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const gender = document.getElementById("gender").value;
    const pronouns = document.getElementById("pronouns").value.trim();
    const messageEl = document.getElementById("signupMessage");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        gender,
        pronouns,
        createdAt: new Date().toISOString()
      });

      messageEl.textContent = "🌟 Account created! Redirecting...";
      messageEl.style.color = "lightgreen";

      setTimeout(() => window.location.href = "profile.html", 2000);

    } catch (err) {
      console.error(err);
      messageEl.textContent = `Error: ${err.message}`;
      messageEl.style.color = "salmon";
    }
  });
}

// === LOGIN FORM ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const messageEl = document.getElementById("loginMessage");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      messageEl.textContent = "✅ Logged in! Redirecting...";
      messageEl.style.color = "lightgreen";

      setTimeout(() => window.location.href = "profile.html", 2000);

    } catch (err) {
      console.error(err);
      messageEl.textContent = `Error: ${err.message}`;
      messageEl.style.color = "salmon";
    }
  });
}
