// === profile.js ===
import { firebaseAuth, firebaseDB } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// DOM elements
const usernameSpan = document.getElementById('displayUsername');
const emailSpan = document.getElementById('displayEmail');
const genderSpan = document.getElementById('displayGender');
const pronounsSpan = document.getElementById('displayPronouns');
const birthdaySpan = document.getElementById('displayBirthday');
const profilePic = document.getElementById('profilePic');

const myCosmicCycleBtn = document.getElementById('myCosmicCycleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const profileMessage = document.getElementById('profileMessage');

// Ensure user is signed in
firebaseAuth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.assign('login.html');
    return;
  }

  // Display email immediately
  emailSpan.textContent = user.email;

  try {
    // Load Firestore user data
    const userRef = doc(firebaseDB, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      usernameSpan.textContent = data.username || 'Not set';
      genderSpan.textContent = data.gender || 'Not set';
      pronounsSpan.textContent = data.pronouns || 'Not set';
      birthdaySpan.textContent = data.birthday || 'Not set';
      profilePic.src = data.photoURL || user.photoURL || 'images/default-avatar.png';
    } else {
      usernameSpan.textContent = 'Not set';
    }
  } catch (err) {
    console.error('Error fetching profile data:', err);
    profileMessage.textContent = 'Failed to load profile data.';
    profileMessage.style.color = 'salmon';
  }
});

// === My Cosmic Cycle button logic (fixed for unified flow) ===
myCosmicCycleBtn.addEventListener('click', async () => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    alert("You must be logged in.");
    return window.location.assign('login.html');
  }

  try {
    const userRef = doc(firebaseDB, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      alert("Profile data not found. Please fill out your profile first.");
      return;
    }

    const data = snap.data();
    const { fullName, birthday, birthTime, birthLocation } = data;

    if (!birthday) {
      alert("Please add your birthday in your profile before continuing.");
      return;
    }

    // Create a clean blueprint payload (no numerology/zodiac here — let cycles.html handle that)
    const cosmicBlueprint = {
      source: "profile",
      fullName: fullName || "",
      birthday,
      birthTime: birthTime || "",
      birthLocation: birthLocation || ""
    };

    // Store unified key that script.js will recognize
    localStorage.setItem("cosmicBlueprint", JSON.stringify(cosmicBlueprint));
    localStorage.setItem("cosmicBlueprint_source", "profile");

    // Remove old conflicting keys
    ["birthday", "birthDate", "selectedDate", "cosmicBlueprint_index"].forEach(k => {
      localStorage.removeItem(k);
    });

    // Redirect to cycles page
    window.location.assign("cycles.html");

  } catch (error) {
    console.error("Error preparing cosmic cycle:", error);
    alert("Could not load your cosmic cycle. Please try again.");
  }
});


editProfileBtn.addEventListener('click', () => {
  window.location.assign('edit-profile.html');
});

logoutBtn.addEventListener('click', async () => {
  try {
    await firebaseAuth.signOut();
    window.location.assign('login.html');
  } catch (err) {
    console.error('Logout failed:', err);
    profileMessage.textContent = 'Failed to log out.';
    profileMessage.style.color = 'salmon';
  }
});

