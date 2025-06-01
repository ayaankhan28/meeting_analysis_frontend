import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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