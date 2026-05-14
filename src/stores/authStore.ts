import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setInitialized: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      initialized: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setInitialized: () => set({ initialized: true }),
      clear: () => set({ user: null, profile: null, initialized: false }),
    }),
    {
      name: "lwf-auth",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist profile + initialized — not the full User object (too large, has tokens)
      partialize: (state) => ({
        profile: state.profile,
        initialized: state.initialized,
      }),
    }
  )
);
