import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

/* -------- LOGIN -------- */

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value.trim();
  const errEl = document.getElementById("login-error");

  errEl.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, pass);

    errEl.style.color = "var(--accent)";
    errEl.textContent = "Logged in!";
  } catch (err) {
    errEl.textContent = err.message;
  }
});

/* -------- SIGN UP -------- */

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value.trim();
  const pass  = document.getElementById("signup-pass").value.trim();
  const errEl = document.getElementById("signup-error");

  errEl.textContent = "";

  try {
    await createUserWithEmailAndPassword(auth, email, pass);

    errEl.style.color = "var(--accent)";
    errEl.textContent = "Account created!";
  } catch (err) {
    errEl.textContent = err.message;
  }
});
