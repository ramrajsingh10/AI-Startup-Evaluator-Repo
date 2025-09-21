"use client";

import Link from "next/link";
import { AppLogo, HomeIcon, ArrowLeftIcon, ShieldCheck, Rocket, Briefcase } from "@/components/icons"; // Import from local icons
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed RequestAccessModal import as it will no longer be used directly here
// Removed lucide-react imports
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { useEffect } from "react";
import { FirebaseError } from "firebase/app"; // Import FirebaseError

export default function LoginClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, role, signInWithGoogle, signInWithEmailAndPassword } = useAuth(); // Use useAuth hook

  // Handle redirection based on user role from useAuth
  useEffect(() => {
    if (!loading && user) {
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "investor") {
        router.push("/investor");
      } else if (role === "founder") {
        router.push("/founder");
      } else {
        // User is logged in but has no specific role or pending status
        // This case should ideally not happen if roles are assigned, but as a fallback
        // This might be hit if a user logs in but their Firestore doc doesn't exist or has no role/status
        console.log("User logged in but no specific role found or status not active.");
        toast({
          title: "Access Pending",
          description: "Your account is not active. Please wait for admin approval.",
          variant: "destructive",
        });
        // Optionally, sign out the user if their status isn't active to prevent partial login state
        // auth.signOut(); 
      }
    } else if (!loading && !user) {
      // User is not logged in, remain on login page
    }
  }, [user, loading, role, router, toast]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirection is handled by the useEffect above once user state updates
      toast({
        title: "Signed in successfully",
        description: "Redirecting to your dashboard...",
      });
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      let errorMessage = "Failed to sign in with Google.";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Sign-in popup closed. Please try again.";
        } else if (error.code === "auth/cancelled-popup-request") {
          errorMessage = "Sign-in already in progress. Please wait or try again.";
        } else if (error.code === "auth/unauthorized-domain") {
          errorMessage = "Unauthorized domain. Please check Firebase settings.";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // This will catch errors re-thrown from the backend fetch, including 403 messages
        errorMessage = error.message;
      }
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEmailPasswordSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await signInWithEmailAndPassword(email, password);
      // Redirection is handled by the useEffect above once user state updates
      toast({
        title: "Signed in successfully",
        description: "Redirecting to your dashboard...",
      });
    } catch (error) {
      console.error("Error signing in with email/password: ", error);
      let errorMessage = "Failed to sign in with email and password.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          case "auth/user-disabled":
            errorMessage = "Your account has been disabled.";
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <header className="absolute top-0 left-0 p-4 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <HomeIcon className="h-5 w-5" />
          </Link>
        </Button>
      </header>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="inline-block mx-auto">
              <AppLogo className="h-10 w-auto text-primary" />
            </Link>
            <h1 className="text-3xl font-bold font-headline">
              Welcome to StartupVerse
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          <div className="grid gap-4">
            <form onSubmit={handleEmailPasswordSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Request access
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center p-10">
        <div className="space-y-6 max-w-md">
          <Card className="bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-primary" /> Admin {/* Replaced Shield */}
              </CardTitle>
              <CardDescription>
                Manage the ecosystem. Control user access, review startup
                submissions, and monitor system health.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="text-primary" /> Investor {/* Replaced Search */}
              </CardTitle>
              <CardDescription>
                Discover opportunities. Browse curated startups, analyze
                AI-generated memos, and connect with founders.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="text-primary" /> Founder {/* Replaced Rocket */}
              </CardTitle>
              <CardDescription>
                Launch your vision. Submit your startup, schedule meetings with
                our AI agent, and track investor interest.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
