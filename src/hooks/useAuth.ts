import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";

// Call this ONCE at the top of the app (AppRoutes) to initialize auth state
export function useAuthInit() {
  const { setUser, setProfile, setInitialized, clear } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setInitialized();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          clear();
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          // Silent token refresh on tab focus — only update token, never touch loading state
          setUser(session.user);
        }
        // INITIAL_SESSION is handled by getSession() above — ignore here
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setInitialized();  // mark ready — only called once, never resets
  }
}

// Use this everywhere else — just reads from the store, no side effects
export function useAuth() {
  const { user, profile, initialized, clear } = useAuthStore();

  function signOut() {
    // Clear local state immediately so UI responds at once
    clear();
    // Fire API call in background — don't await
    supabase.auth.signOut();
  }

  return {
    user,
    profile,
    isAdmin: profile?.role === "admin",
    isLoading: !initialized,
    signOut,
  };
}
