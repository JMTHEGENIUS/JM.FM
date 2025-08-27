// ======= MAIN JS =======
console.log("main.js is running ✅");

// ======= MOBILE NAV TOGGLE =======
const navToggle = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active'); // match CSS: .nav-links.active
    navToggle.classList.toggle('toggle'); // animate hamburger
  });
}

// CLOSE MOBILE MENU WHEN LINK IS CLICKED
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('toggle'); // reset hamburger
    }
  });
});

// CLICK LOGO TO GO HOME
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', () => {
    const pathParts = window.location.pathname.split('/');
    const currentPage = pathParts[pathParts.length - 1];
    if (currentPage !== 'index.html' && currentPage !== '') {
      window.location.href = '/index.html';
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

// ======= HUB BUTTON ACCESS CONTROL =======
// Keeps guests from accessing Music/Merch directly
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve user status (guest, loggedIn, paid)
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

// ======= YOUR EXISTING TEST LOGIN FUNCTION =======
// Leave your join page test functions here as-is
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
      alert(`Logged in as ${username}`);
      localStorage.setItem('loggedInUser', username);
      document.getElementById('login-section').style.display = 'none';
      document.querySelector('nav').innerHTML += `<a href="profile.html">Profile</a>`;
    } else {
      alert('Please enter username and password');
    }
  });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out');
    location.reload();
  });
}

