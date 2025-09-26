
"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {

  const [isSignUp, setIsSignUp] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const { signUp, signIn, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const getFriendlyError = (err: any) => {
    if (!err || !err.code) return "Authentication failed. Please try again.";
    switch (err.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Incorrect email or password.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  const handleSubmit = async (data: { email: string; password: string }) => {
    if (localLoading) return;
    setLocalLoading(true);
    try {
      if (isSignUp) {
        await signUp(data.email, data.password);
        toast({
          title: "Account created!",
          description: "Your account was created successfully. Please sign in.",
        });
        setIsSignUp(false);
        form.reset();
      } else {
        await signIn(data.email, data.password);
        toast({ title: "Signed in!", description: "Welcome back!" });
        router.push("/");
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: getFriendlyError(e),
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (localLoading) return;
    setLocalLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: "Signed in!", description: "Welcome back!" });
      router.push("/");
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-in Error",
        description: getFriendlyError(e),
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-16 md:px-6 md:py-24">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Input
            type="email"
            placeholder="Email"
            {...form.register("email", { required: true })}
            disabled={loading}
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password", { required: true })}
            disabled={loading}
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          <Button type="submit" className="w-full" disabled={loading || localLoading}>
            {(loading || localLoading)
              ? (isSignUp ? "Creating Account..." : "Signing In...")
              : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleGoogle}
          disabled={loading || localLoading}
        >
          {(loading || localLoading) ? "Processing..." : "Continue with Google"}
        </Button>
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setIsSignUp((v) => !v)}
            disabled={loading || localLoading}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
