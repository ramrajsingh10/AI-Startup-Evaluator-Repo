"use client";

import Link from "next/link";
import { AppLogo } from "@/components/icons";
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
import { RequestAccessModal } from "@/components/auth/request-access-modal";
import { Shield, Rocket, Search } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // @ts-ignore
        setUser(user);
        // Redirect based on role
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.role === "admin") {
            router.push("/admin");
          } else if (idTokenResult.claims.role === "investor") {
            router.push("/investor");
          } else if (idTokenResult.claims.role === "founder") {
            router.push("/founder");
          } else {
            // Handle users with no specific role
            router.push("/");
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send the token to the backend to set custom claims
      const response = await fetch("/api/v1/auth/google-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to set custom claims");
      }

      // Force refresh of the token to get the custom claims
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        await updatedUser.getIdToken(true);
      }

      toast({
        title: "Signed in successfully",
        description: "Redirecting to your dashboard...",
      });
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        title: "Sign in failed",
        description:
          "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
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
            <Button type="submit" className="w-full" asChild>
              <Link href="/admin">Sign in</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account? <RequestAccessModal />
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center p-10">
        <div className="space-y-6 max-w-md">
          <Card className="bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-primary" /> Admin
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
                <Search className="text-primary" /> Investor
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
                <Rocket className="text-primary" /> Founder
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
