import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMgMzE713-yft0-l7HW0ppF4akI5azT0g",
  authDomain: "tetris-3d-game.firebaseapp.com",
  projectId: "tetris-3d-game",
  storageBucket: "tetris-3d-game.firebasestorage.app",
  messagingSenderId: "370693010532",
  appId: "1:370693010532:web:2934676805e80dd12edb71",
  measurementId: "G-EEH405DSVH"
};

// Initialize Firebase (Auth only)
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Apps Script Web App URL - Replace with your deployed URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzS5u6U950wr-sI0TOoB5iAMASrxRZU3pYPgmBCGunYZSjuvxrZrVBcPn5HX3AAzQSd/exec';

// Auth functions
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: (error as Error).message };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: (error as Error).message };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: (error as Error).message };
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Leaderboard functions using Apps Script
export async function saveHighScore(userId: string, displayName: string, score: number, level: number, lines: number) {
  try {
    const params = new URLSearchParams({
      action: 'saveScore',
      userId,
      displayName: displayName || 'Anonymous',
      score: score.toString(),
      level: level.toString(),
      lines: lines.toString(),
    });
    
    const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);
    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }
    return { error: null };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function getLeaderboard(limitCount = 10) {
  try {
    const params = new URLSearchParams({
      action: 'getLeaderboard',
      limit: limitCount.toString(),
    });
    
    const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);
    const data = await response.json();
    
    if (data.error) {
      return { scores: [], error: data.error };
    }
    return { scores: data.scores || [], error: null };
  } catch (error) {
    return { scores: [], error: (error as Error).message };
  }
}

export { auth, analytics, onAuthStateChanged, type User };
