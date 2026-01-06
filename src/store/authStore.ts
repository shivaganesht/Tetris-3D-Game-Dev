import { create } from 'zustand';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  logOut,
  saveHighScore,
  getLeaderboard,
  type User 
} from '../lib/firebase';

interface LeaderboardEntry {
  rank: number;
  id: string;
  displayName: string;
  score: number;
  level: number;
  lines: number;
  timestamp: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
  
  // Actions
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  clearError: () => void;
  saveScore: (score: number, level: number, lines: number) => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    error: null,
    leaderboard: [],
    leaderboardLoading: false,

    signInWithGoogle: async () => {
      set({ loading: true, error: null });
      const { user, error } = await signInWithGoogle();
      set({ user, loading: false, error });
    },

    signInWithEmail: async (email: string, password: string) => {
      set({ loading: true, error: null });
      const { user, error } = await signInWithEmail(email, password);
      set({ user, loading: false, error });
      return !error;
    },

    signUpWithEmail: async (email: string, password: string) => {
      set({ loading: true, error: null });
      const { user, error } = await signUpWithEmail(email, password);
      set({ user, loading: false, error });
      return !error;
    },

    logOut: async () => {
      set({ loading: true });
      await logOut();
      set({ user: null, loading: false });
    },

    clearError: () => set({ error: null }),

    saveScore: async (score: number, level: number, lines: number) => {
      const { user } = get();
      if (!user) return;
      
      const displayName = user.displayName || user.email?.split('@')[0] || 'Anonymous';
      await saveHighScore(user.uid, displayName, score, level, lines);
    },

    fetchLeaderboard: async () => {
      set({ leaderboardLoading: true });
      const { scores } = await getLeaderboard(10);
      set({ leaderboard: scores as LeaderboardEntry[], leaderboardLoading: false });
    },
  };
});
