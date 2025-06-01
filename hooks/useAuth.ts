import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { syncUser } from "@/lib/api";

export interface User extends SupabaseUser {
  full_name?: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Sync user data with backend when user is fetched
          try {
            await syncUser(user);
          } catch (error) {
            console.error("Error syncing user:", error);
          }
        }
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Sync user data whenever auth state changes (login, signup, etc.)
      if (currentUser) {
        try {
          await syncUser(currentUser);
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
      
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out!");
      router.push("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
} 