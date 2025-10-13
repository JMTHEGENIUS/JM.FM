import { firebaseAuth, firebaseDB } from './firebase.js';
import { doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';

// === DOM elements ===
const editProfileForm = document.getElementById('editProfileForm');
const editProfileMessage = document.getElementById('editProfileMessage');
const cancelBtn = document.getElementById('cancelBtn');
const fileInput = document.getElementById('profilePicInput');
const uploadBtn = document.getElementById('uploadPicBtn');
const preview = document.getElementById('profilePicPreview');

const storage = getStorage();

// === Load current user data ===
firebaseAuth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

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

    if (data.photoURL) preview.src = data.photoURL;
  }
});

// === Save profile changes ===
editProfileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = firebaseAuth.currentUser;
  if (!user) return;

  const userRef = doc(firebaseDB, 'users', user.uid);

  const data = {
    username: document.getElementById('username').value.trim(),
    fullName: document.getElementById('fullName').value.trim(),
    birthday: document.getElementById('birthday').value,
    birthTime: document.getElementById('birthTime').value,
    birthLocation: document.getElementById('birthLocation').value.trim(),
    gender: document.getElementById('gender').value.trim(),
    pronouns: document.getElementById('pronouns').value.trim(),
  };

  try {
    await setDoc(userRef, data, { merge: true });

    editProfileMessage.textContent = 'Profile updated successfully!';
    editProfileMessage.style.color = '#ffd580';

    // Wait a bit to show success message, then redirect
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 800);

  } catch (error) {
    console.error("Error updating profile:", error);
    editProfileMessage.textContent = `Error: ${error.message}`;
    editProfileMessage.style.color = '#ff6b6b';
  }
});

// === Cancel button ===
cancelBtn.addEventListener('click', () => {
  window.location.href = 'profile.html';
});

// === Profile picture upload ===
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

uploadBtn.addEventListener('click', async () => {
  const user = firebaseAuth.currentUser;
  if (!user) return alert("You must be logged in.");

  const file = fileInput.files[0];
  if (!file) return alert("Please select an image first.");

  try {
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await updateDoc(doc(firebaseDB, "users", user.uid), { photoURL: downloadURL });
    preview.src = downloadURL;
    alert("Profile picture updated successfully!");

  } catch (error) {
    console.error("Error uploading profile picture:", error);
    alert("Failed to upload profile picture. Please try again.");
  }
});

