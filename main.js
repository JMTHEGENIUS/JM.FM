console.log("main.js is running ✅");

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-active');
    navToggle.classList.toggle('toggle');
  });
}

// CLOSE MOBILE MENU WHEN LINK IS CLICKED
const navLinksList = document.querySelectorAll('.nav-links a');
navLinksList.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('nav-active')) {
      navMenu.classList.remove('nav-active');
      navToggle.classList.remove('toggle');
    }
  });
});

// CLICK LOGO TO GO HOME
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', () => {
    window.location.href = '/index.html';
  });
}

// ===== LOGIN HELPERS =====
function getUserStatus() {
  return localStorage.getItem('userStatus') || 'guest';
}

function oggedIn() {
  return getUserStatus() === 'loggedIn';
}

// ===== TEST LOGIN =====
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
      localStorage.setItem('loggedInUser', username);
      localStorage.setItem('userStatus', 'loggedIn');
      window.location.href = 'profile.html';
    } else {
      alert('Please enter username and password');
    }
  });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    localStorage.setItem('userStatus', 'guest');
    window.location.href = 'index.html';
  });
}

// ===== HUB BUTTON ACCESS =====
const musicBtn = document.getElementById('music-btn');
const merchBtn = document.getElementById('merch-btn');
const cyclesBtn = document.getElementById('cycles-btn');

function handleHubRedirect(btn, page) {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const status = getUserStatus();
    if (status === 'guest') window.location.href = 'join.html';
    else window.location.href = page;
  });
}

handleHubRedirect(musicBtn, 'music.html');
handleHubRedirect(merchBtn, 'merch.html');
handleHubRedirect(cyclesBtn, '/Cycles/index.html');

// ===== NAVBAR DYNAMIC RENDER =====
document.addEventListener('DOMContentLoaded', () => {
  const navLinksContainer = document.getElementById('nav-links');
  const hamburger = document.querySelector('.hamburger');
  if (!navLinksContainer) return;

  if (loggedIn()) {
    navLinksContainer.innerHTML = `
      <a href="music.html">Music</a>
      <a href="merch.html">Merch</a>
      <a href="about.html">About</a>
      <a href="profile.html">Profile</a>
      <a href="#" id="logout-btn">Log Out</a>
    `;

    // Reattach logout after dynamic nav
    const logoutBtnNew = document.getElementById("logout-btn");
    if (logoutBtnNew) {
      logoutBtnNew.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        localStorage.setItem('userStatus', 'guest');
        window.location.href = 'index.html';
      });
    }

  } else {
    navLinksContainer.innerHTML = `
      <a href="index.html">Home</a>
      <a href="join.html">Music</a>
      <a href="join.html">Merch</a>
      <a href="about.html">About</a>
      <a href="join.html">Join</a>
      <a href="login.html">Login</a>
    `;
  }

  // Hamburger toggle again
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinksContainer.classList.toggle('nav-active');
      hamburger.classList.toggle('toggle');
    });

    navLinksContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinksContainer.classList.remove('nav-active');
        hamburger.classList.remove('toggle');
      }
    });
  }
});
