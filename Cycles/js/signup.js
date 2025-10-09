import { createUserWithEmailAndPassword, updateProfile } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseAuth, firebaseDB } from "./firebase.js";

const auth = firebaseAuth;
const db = firebaseDB;

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const signupBtn = document.getElementById("signupBtn");
  const signupMessage = document.getElementById("signupMessage");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!signupForm) return;

  const handleSignup = async () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username || !email || !password) {
      signupMessage.textContent = "Please fill out all fields.";
      signupMessage.style.color = "salmon";
      return;
    }

    signupMessage.textContent = "Creating account...";
    signupMessage.style.color = "lightblue";

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: username });

      // Save minimal info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      // ✅ Redirect immediately after success
      window.location.href = "profile.html";

    } catch (error) {
      console.error("Signup error:", error);
      signupMessage.textContent = error.code === "auth/email-already-in-use"
        ? "This email is already registered."
        : error.message;
      signupMessage.style.color = "salmon";
    }
  };

  // Handle form submit (Enter key or button click)
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleSignup();
  });

  // Also allow clicking the Sign Up button
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleSignup();
  });
});


