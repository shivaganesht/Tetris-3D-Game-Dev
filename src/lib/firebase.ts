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
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMgMzE713-yft0-l7HW0ppF4akI5azT0g",
  authDomain: "tetris-3d-game.firebaseapp.com",
  projectId: "tetris-3d-game",
  storageBucket: "tetris-3d-game.firebasestorage.app",
  messagingSenderId: "370693010532",
  appId: "1:370693010532:web:2934676805e80dd12edb71",
  measurementId: "G-EEH405DSVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

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

// Leaderboard functions
export async function saveHighScore(userId: string, displayName: string, score: number, level: number, lines: number) {
  try {
    const userScoreRef = doc(db, "leaderboard", userId);
    const existingDoc = await getDoc(userScoreRef);
    
    // Only update if new score is higher
    if (!existingDoc.exists() || existingDoc.data().score < score) {
      await setDoc(userScoreRef, {
        displayName: displayName || "Anonymous",
        score,
        level,
        lines,
        timestamp: new Date().toISOString(),
      });
    }
    return { error: null };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function getLeaderboard(limitCount = 10) {
  try {
    const leaderboardRef = collection(db, "leaderboard");
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    
    const scores = snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      id: doc.id,
      ...doc.data(),
    }));
    
    return { scores, error: null };
  } catch (error) {
    return { scores: [], error: (error as Error).message };
  }
}

export { auth, db, analytics, onAuthStateChanged, type User };
