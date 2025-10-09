// login.js
import { signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseAuth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const loginMessage = document.getElementById("loginMessage");

  const handleLogin = async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      loginMessage.textContent = "Please enter both email and password.";
      loginMessage.style.color = "salmon";
      return;
    }

    loginBtn.disabled = true;
    loginMessage.textContent = "Logging in...";
    loginMessage.style.color = "lightblue";

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);

      loginMessage.textContent = "✅ Login successful! Redirecting...";
      loginMessage.style.color = "lightgreen";

      // Ensure Firebase session is active before redirect
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          unsubscribe();
          window.location.assign("profile.html");
        }
      });

    } catch (error) {
      console.error("Login error:", error);
      loginMessage.textContent = error.code === "auth/user-not-found"
        ? "No account found with this email."
        : error.code === "auth/wrong-password"
        ? "Incorrect password."
        : error.message;
      loginMessage.style.color = "salmon";
    } finally {
      loginBtn.disabled = false;
    }
  };

  // Login on button click
  loginBtn.addEventListener("click", handleLogin);

  // Login when pressing Enter in email or password fields
  [emailInput, passwordInput].forEach(input =>
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    })
  );
});

