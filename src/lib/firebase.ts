// src\lib\firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIDjKcHfdgbLuAoZLxSwhHQAp8PZtIAbY",
  authDomain: "ecocampus-bf3b1.firebaseapp.com",
  projectId: "ecocampus-bf3b1",
  storageBucket: "ecocampus-bf3b1.firebasestorage.app",
  messagingSenderId: "286725868103",
  appId: "1:286725868103:web:3cb86c5327fc1a29953f62",
  measurementId: "G-34LLFQNJYF"
};

// Mencegah inisialisasi ganda saat Next.js me-reload halaman
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);