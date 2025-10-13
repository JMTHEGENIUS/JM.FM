import { createUserWithEmailAndPassword, updateProfile } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseAuth, firebaseDB } from "./firebase.js";

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
      // 🔹 Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;

      // 🔹 Update Firebase Auth displayName
      await updateProfile(user, { displayName: username });

      // 🔹 Save to Firestore (can expand later for birth data)
      await setDoc(doc(firebaseDB, "users", user.uid), {
        username,
        email,
        fullName: username,
        birthday: "",
        birthTime: "",
        birthLocation: "",
        createdAt: new Date().toISOString(),
      });

      // 🔹 Store locally for immediate access
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        username,
        fullName: username,
        birthday: "",
        birthTime: "",
        birthLocation: "",
        email,
      }));

      signupMessage.textContent = "✅ Account created! Redirecting...";
      signupMessage.style.color = "lightgreen";

      // ✅ Redirect after storing data
      setTimeout(() => {
        window.location.assign("profile.html");
      }, 800);

    } catch (error) {
      console.error("Signup error:", error);
      signupMessage.textContent =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : error.message;
      signupMessage.style.color = "salmon";
    }
  };

  // Handle form submit or click
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSignup();
  });

  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSignup();
  });
});



