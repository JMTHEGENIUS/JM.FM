// login.js
import { signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseAuth, firebaseDB } 
  from "./firebase.js";
import { doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
      const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          unsubscribe();

          // 🔹 Pull user data from Firestore
          const userRef = doc(firebaseDB, "users", user.uid);
          const snap = await getDoc(userRef);
          const userData = snap.exists() ? snap.data() : {};

          // 🔹 Save key info for other pages
          localStorage.setItem("user", JSON.stringify({
            uid: user.uid,
            email: user.email,
            username: userData.username || user.displayName || "Guest User",
            fullName: userData.fullName || "",
            birthday: userData.birthday || "",
            birthTime: userData.birthTime || "",
            birthLocation: userData.birthLocation || "",
          }));

          // ✅ Redirect after saving data
          window.location.assign("profile.html");
        }
      });

    } catch (error) {
      console.error("Login error:", error);
      loginMessage.textContent = 
        error.code === "auth/user-not-found"
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

  // Login when pressing Enter
  [emailInput, passwordInput].forEach(input =>
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    })
  );
});

