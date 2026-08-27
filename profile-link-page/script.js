"use strict";

/* ==========================================================================
   1. PROFILE DATA
   ========================================================================== */

const profiles = [
  {
    image: "assets/profiles/profile1.jpg",
    name: "Meena",
    bio: "Living, Laughing & Loving Life ✨",
  },
  {
    image: "assets/profiles/profile2.jpg",
    name: "Aditi",
    bio: "Chasing sunsets & good vibes 🌅",
  },
  {
    image: "assets/profiles/profile3.jpg",
    name: "Kavya",
    bio: "Coffee, curls & a little chaos ☕",
  },
  {
    image: "assets/profiles/profile4.jpg",
    name: "Riya",
    bio: "Dreaming big, dancing bigger 💃",
  },
  {
    image: "assets/profiles/profile5.jpg",
    name: "Simran",
    bio: "Wanderlust wrapped in wonder 🌍",
  },
];


/* ==========================================================================
   2. STATE
   ========================================================================== */

let currentIndex = 0;
let isAnimating = false; // spam-click guard

const TRANSITION_MS = 260;
const SLIDE_DISTANCE = 24; // px


/* ==========================================================================
   3. INIT — runs once the DOM is ready
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const els = getElements();
  if (!els) return; // required elements missing — bail out quietly

  preloadProfileImages(profiles);
  prepareOpenInNewTab();
  prepareTransitionStyles(els);

  // Render the first profile in the array on load
  renderProfile(els, profiles[currentIndex]);

  els.prevBtn.addEventListener("click", () => goToProfile(els, -1));
  els.nextBtn.addEventListener("click", () => goToProfile(els, 1));
});


/* ==========================================================================
   4. ELEMENT LOOKUP
   ========================================================================== */

function getElements() {
  const profileImage = document.getElementById("profileImage");
  const profileName = document.getElementById("profileName");
  const profileBio = document.getElementById("profileBio");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const profileImageWrap = document.querySelector(".profile-image-wrap");
  const profileInfo = document.querySelector(".profile-info");

  const required = [
    profileImage,
    profileName,
    profileBio,
    prevBtn,
    nextBtn,
    profileImageWrap,
    profileInfo,
  ];

  if (required.some((el) => !el)) {
    return null;
  }

  return {
    profileImage,
    profileName,
    profileBio,
    prevBtn,
    nextBtn,
    profileImageWrap,
    profileInfo,
  };
}


/* ==========================================================================
   5. IMAGE PRELOADING — all five profile photos loaded up front
   ========================================================================== */

function preloadProfileImages(list) {
  list.forEach((profile) => {
    const img = new Image();
    img.onerror = () => {
      /* swallow silently — missing asset should never throw a JS error */
    };
    img.src = profile.image;
  });
}


/* ==========================================================================
   6. ACTION CARDS — open in a new tab
   ========================================================================== */

function prepareOpenInNewTab() {
  document.querySelectorAll(".action-card").forEach((card) => {
    card.setAttribute("target", "_blank");
    card.setAttribute("rel", "noopener noreferrer");
  });
}


/* ==========================================================================
   7. TRANSITION SETUP
   ========================================================================== */

function prepareTransitionStyles(els) {
  const transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
  els.profileImageWrap.style.transition = transition;
  els.profileInfo.style.transition = transition;
}

function setPosition(el, x, opacity) {
  el.style.transform = `translateX(${x}px)`;
  el.style.opacity = String(opacity);
}

function setPositionInstant(el, x, opacity) {
  const previousTransition = el.style.transition;
  el.style.transition = "none";
  setPosition(el, x, opacity);
  // Force reflow so the "instant" jump is applied before re-enabling transition
  void el.offsetWidth;
  el.style.transition = previousTransition;
}


/* ==========================================================================
   8. NAVIGATION — Previous / Next, loops infinitely both directions
   ========================================================================== */

function goToProfile(els, direction) {
  if (isAnimating) return; // prevent spam clicking
  isAnimating = true;
  setButtonsDisabled(els, true);

  const outgoingX = direction === 1 ? -SLIDE_DISTANCE : SLIDE_DISTANCE;

  // Fade + slide the current profile out
  setPosition(els.profileImageWrap, outgoingX, 0);
  setPosition(els.profileInfo, outgoingX, 0);

  window.setTimeout(() => {
    // Loop infinitely: last -> first, first -> last
    currentIndex = (currentIndex + direction + profiles.length) % profiles.length;
    renderProfile(els, profiles[currentIndex]);

    const incomingX = direction === 1 ? SLIDE_DISTANCE : -SLIDE_DISTANCE;

    // Jump the new content in from the opposite side, invisible, then
    // fade + slide it into place
    setPositionInstant(els.profileImageWrap, incomingX, 0);
    setPositionInstant(els.profileInfo, incomingX, 0);

    requestAnimationFrame(() => {
      setPosition(els.profileImageWrap, 0, 1);
      setPosition(els.profileInfo, 0, 1);
    });

    window.setTimeout(() => {
      isAnimating = false;
      setButtonsDisabled(els, false);
    }, TRANSITION_MS);
  }, TRANSITION_MS);
}

function setButtonsDisabled(els, disabled) {
  els.prevBtn.disabled = disabled;
  els.nextBtn.disabled = disabled;
}


/* ==========================================================================
   9. RENDER — updates image, name, bio for a given profile
   ========================================================================== */

function renderProfile(els, profile) {
  els.profileImage.src = profile.image;
  els.profileImage.alt = profile.name + " profile photo";
  els.profileName.textContent = profile.name;
  els.profileBio.textContent = profile.bio;
}