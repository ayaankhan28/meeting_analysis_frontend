"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { syncUser } from "@/lib/api";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${location.origin}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Sync user data with our backend
      if (data.user) {
        try {
          await syncUser(data.user);
        } catch (error) {
          console.error('Error syncing user:', error);
          // Don't block the auth flow if sync fails
        }
      }

      if (isSignUp) {
        toast.success("Check your email for the confirmation link!");
      } else {
        toast.success("Successfully logged in!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An error occurred during Google sign in");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create an Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your details to create a new account"
              : "Enter your credentials to login"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 