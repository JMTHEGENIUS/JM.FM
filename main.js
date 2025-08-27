// ======= MAIN JS =======
console.log("main.js is running ✅");

// NAVIGATION TOGGLE FOR MOBILE
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-menu-active');
  });
}

// CLOSE MOBILE MENU WHEN LINK IS CLICKED
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('nav-menu-active')) {
      navMenu.classList.remove('nav-menu-active');
    }
  });
});

// CLICK LOGO TO GO HOME
const logo = document.querySelector('.logo');

if (logo) {
  logo.addEventListener('click', () => {
    // Get current folder depth
    const pathParts = window.location.pathname.split('/');
    const currentPage = pathParts[pathParts.length - 1];

    // If we are not already on index.html, redirect to it
    if (currentPage !== 'index.html' && currentPage !== '') {
      // Adjust path for subfolders if needed
      window.location.href = '/index.html'; // <-- change this if your homepage is elsewhere
    }
  });
}

// OPTIONAL: Smooth scroll for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// simulation
const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Example: just simulate success if both fields are filled
    if (username && password) {
      alert(`Logged in as ${username}`);
      // Store user info in localStorage so it "remembers" login
      localStorage.setItem('loggedInUser', username);

      // Optionally hide login form and show profile link
      document.getElementById('login-section').style.display = 'none';
      document.querySelector('nav').innerHTML += `<a href="profile.html">Profile</a>`;
    } else {
      alert('Please enter username and password');
    }
  });
}
// log out
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out');
    location.reload(); // refresh page to show login again
  });
}

document.addEventListener('DOMContentLoaded', () => {
  function getUserStatus() {
    return localStorage.getItem('userStatus') || 'guest';
  }

  const musicBtn = document.getElementById('music-btn');
  const merchBtn = document.getElementById('merch-btn');

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const status = getUserStatus();
      if (status === 'guest') window.location.href = 'join.html';
      else if (status === 'paid') window.location.href = 'login.html';
      else if (status === 'loggedIn') window.location.href = 'music.html';
    });
  }

  if (merchBtn) {
    merchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const status = getUserStatus();
      if (status === 'guest') window.location.href = 'join.html';
      else if (status === 'paid') window.location.href = 'login.html';
      else if (status === 'loggedIn') window.location.href = 'merch.html';
    });
  }
});
