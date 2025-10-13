// === profile.js ===
import { firebaseAuth, firebaseDB } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { generateCosmicBlueprint } from './cosmic-calculations.js';

// === DOM Elements ===
const usernameSpan = document.getElementById('displayUsername');
const emailSpan = document.getElementById('displayEmail');
const genderSpan = document.getElementById('displayGender');
const pronounsSpan = document.getElementById('displayPronouns');
const birthdaySpan = document.getElementById('displayBirthday');
const profilePic = document.getElementById('profilePic');
const myCosmicCyclesBtn = document.getElementById('myCosmicCyclesBtn');
const logoutBtn = document.getElementById('logoutBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const profileMessage = document.getElementById('profileMessage');

// === MAIN AUTH LISTENER ===
firebaseAuth.onAuthStateChanged(async (user) => {
  if (!user) {
    console.warn("⚠️ No user logged in — redirecting to login.html");
    window.location.assign('login.html');
    return;
  }

  // Display email immediately
  emailSpan.textContent = user.email;

  try {
    const userRef = doc(firebaseDB, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      // === Populate Profile Info ===
      usernameSpan.textContent = data.username || 'Not set';
      genderSpan.textContent = data.gender || 'Not set';
      pronounsSpan.textContent = data.pronouns || 'Not set';
      birthdaySpan.textContent = data.birthday || 'Not set';
      profilePic.src = data.photoURL || 'images/default-avatar.png';

      // === Store User Data for Blueprint Page ===
      const userData = {
        uid: user.uid,
        fullName: data.fullName || data.username || 'Unknown Star',
        birthday: data.birthday || '',
        birthTime: data.birthTime || '',
        birthLocation: data.birthLocation || '',
        email: user.email
      };
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("✅ User data stored locally:", userData);

      // === Enable Button Once Data Is Ready ===
      setupCosmicButton(userData);

    } else {
      console.warn("⚠️ User document not found in Firestore.");
      usernameSpan.textContent = 'Not set';
      profileMessage.textContent = 'Please complete your profile.';
    }

  } catch (err) {
    console.error('❌ Error fetching profile data:', err);
    profileMessage.textContent = 'Failed to load profile data.';
    profileMessage.style.color = 'salmon';
  }
});

// === FUNCTION: SET UP COSMIC BLUEPRINT BUTTON ===
function setupCosmicButton(userData) {
  if (!myCosmicCyclesBtn) {
    console.warn("⚠️ My Cosmic Cycles button not found on page!");
    return;
  }

  console.log("🟢 My Cosmic Cycles button ready.");

  myCosmicCyclesBtn.addEventListener('click', async () => {
    console.log("🪐 Button clicked!");

    const { fullName, birthday, birthTime, birthLocation } = userData;

    // Validate birth details
    if (!birthday || !birthTime || !birthLocation) {
      alert('Please update your birth details in your profile first.');
      window.location.href = 'edit-profile.html';
      return;
    }

    try {
      // Generate blueprint
      console.log("✨ Generating cosmic blueprint...");
      const blueprint = generateCosmicBlueprint({
        fullName,
        birthday,
        birthTime,
        birthLocation
      });

      // Save and redirect
      localStorage.setItem('cosmicBlueprint', JSON.stringify(blueprint));
      console.log("💾 Blueprint saved to localStorage.");
      window.location.href = 'cosmic-blueprint.html';
    } catch (error) {
      console.error("❌ Error generating blueprint:", error);
      alert("There was a problem generating your Cosmic Blueprint.");
    }
  });
}

// === OTHER BUTTONS ===
if (editProfileBtn) {
  editProfileBtn.addEventListener('click', () => {
    window.location.assign('edit-profile.html');
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await firebaseAuth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('cosmicBlueprint');
      window.location.assign('login.html');
    } catch (err) {
      console.error('Logout failed:', err);
      profileMessage.textContent = 'Failed to log out.';
      profileMessage.style.color = 'salmon';
    }
  });
}
