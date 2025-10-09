// profile.js
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

// Button actions
myCosmicCycleBtn.addEventListener('click', () => {
  window.location.assign('cycles.html');
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
