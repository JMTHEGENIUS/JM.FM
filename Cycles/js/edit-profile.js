import { firebaseAuth, firebaseDB } from './firebase.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

const editProfileForm = document.getElementById('editProfileForm');
const editProfileMessage = document.getElementById('editProfileMessage');
const cancelBtn = document.getElementById('cancelBtn');

firebaseAuth.onAuthStateChanged(async (user) => {
  if (user) {
    const userRef = doc(firebaseDB, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      document.getElementById('username').value = data.username || '';
      document.getElementById('fullName').value = data.fullName || '';
      document.getElementById('birthday').value = data.birthday || '';
      document.getElementById('birthTime').value = data.birthTime || '';
      document.getElementById('birthLocation').value = data.birthLocation || '';
      document.getElementById('gender').value = data.gender || '';
      document.getElementById('pronouns').value = data.pronouns || '';
    }
  } else {
    // redirect if not logged in
    window.location.href = 'login.html';
  }
});

// Save profile changes
editProfileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = firebaseAuth.currentUser;
  if (!user) return;

  const data = {
    username: document.getElementById('username').value.trim(),
    fullName: document.getElementById('fullName').value.trim(),
    birthday: document.getElementById('birthday').value,
    birthTime: document.getElementById('birthTime').value,
    birthLocation: document.getElementById('birthLocation').value.trim(),
    gender: document.getElementById('gender').value.trim(),
    pronouns: document.getElementById('pronouns').value.trim()
  };

  try {
    await setDoc(doc(firebaseDB, 'users', user.uid), data, { merge: true });
    editProfileMessage.textContent = 'Profile updated successfully!';
    editProfileMessage.style.color = '#ffd580';
  } catch (error) {
    editProfileMessage.textContent = `Error: ${error.message}`;
    editProfileMessage.style.color = '#ff6b6b';
  }
});

// Cancel button
cancelBtn.addEventListener('click', () => {
  window.location.href = 'profile.html';
});

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth();
  const storage = getStorage();
  const db = firebaseDB;

  const fileInput = document.getElementById('profilePicInput');
  const uploadBtn = document.getElementById('uploadPicBtn');
  const preview = document.getElementById('profilePicPreview');

  // --- Instant Preview when user selects a new image ---
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result; // Instantly show selected image
      };
      reader.readAsDataURL(file);
    }
  });

  // --- Handle Upload to Firebase ---
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().photoURL) {
      preview.src = userSnap.data().photoURL;
    }

    uploadBtn.addEventListener("click", async () => {
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select an image first.");
        return;
      }

      try {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(userRef, { photoURL: downloadURL });

        preview.src = downloadURL;
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
      }
    });
  });
});
