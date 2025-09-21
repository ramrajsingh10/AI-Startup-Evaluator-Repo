"use client";

import { useState } from "react";
import { AppLogo, Briefcase, Rocket, ShieldCheck } from "@/components/icons";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignupClient() {
  const [role, setRole] = useState("founder");
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignUp = async () => {
    try {
      // You would typically send the selected role to the backend here
      // after getting the user object from signInWithGoogle
      await signInWithGoogle();
      toast({
        title: "Sign up request sent",
        description: "Your request has been sent to the admin for approval.",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing up with Google:", error);
      toast({
        title: "Error",
        description: "Failed to send sign up request.",
        variant: "destructive",
      });
    }
  };

  const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.currentTarget.elements[1] as HTMLInputElement).value;
    const password = (event.currentTarget.elements[2] as HTMLInputElement).value;
    try {
      await signUp(email, password, role);
      toast({
        title: "Sign up request sent",
        description: "Your request has been sent to the admin for approval.",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing up with email:", error);
      toast({
        title: "Error",
        description: "Failed to send sign up request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Request Access</CardTitle>
            <CardDescription>
              Choose your role and sign up to request access to the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <RadioGroup
                defaultValue="founder"
                className="grid grid-cols-2 gap-4"
                onValueChange={setRole}
              >
                <div>
                  <RadioGroupItem
                    value="founder"
                    id="founder"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="founder"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Rocket className="mb-3 h-6 w-6" />
                    Founder
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="investor"
                    id="investor"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="investor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Briefcase className="mb-3 h-6 w-6" />
                    Investor
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Request Access
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
            >
              Sign Up with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center bg-muted/20 p-8 text-center space-y-8 border-l">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo className="h-8 w-auto text-primary" />
          <span className="text-xl font-semibold">StartupVerse</span>
        </Link>
        <div className="w-full max-w-md space-y-4">
          <Card className="bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-primary" /> Admin
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
                <Briefcase className="text-primary" /> Investor
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
