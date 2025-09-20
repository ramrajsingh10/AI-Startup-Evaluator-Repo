"use client";

// This forces the page to be rendered dynamically.
export const dynamic = 'force-dynamic';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  website: z.string().url({ message: "Please enter a valid URL." }),
  sector: z.enum(["AI/ML", "HealthTech", "CleanTech", "FinTech", "SaaS"]),
  stage: z.enum(["Pre-Seed", "Seed", "Series A", "Series B", "Growth"]),
  description: z
    .string()
    .min(10, { message: "Must be at least 10 characters." })
    .max(160, { message: "Must not be longer than 160 characters." }),
  deck: z.any().optional(),
  media: z.any().optional(),
});

export default function SubmissionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a startup.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          founder_uid: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit startup.");
      }

      toast({
        title: "Submission Successful!",
        description: "Your startup profile has been submitted for review.",
      });
      router.push("/founder");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your startup. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  function onSaveDraft() {
    console.log("Mock save draft:", form.getValues());
    toast({
      title: "Draft Saved!",
      description: "Your progress has been saved.",
    });
  }
  
  function onScheduleWithAgent() {
    router.push('/meet?mode=Agent');
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Submit Your Startup"
        description="Fill in your company's details to get discovered by investors."
      />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="InnovateX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://innovatex.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your company's sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                          <SelectItem value="HealthTech">HealthTech</SelectItem>
                          <SelectItem value="CleanTech">CleanTech</SelectItem>
                          <SelectItem value="FinTech">FinTech</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current funding stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Liner</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what your company does in a single sentence."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A concise and powerful summary of your mission.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-8">
                 <FormItem>
                    <FormLabel>Pitch Deck</FormLabel>
                    <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="deck-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-accent/50 hover:bg-accent/80">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground"/>
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PDF, PPTX (MAX. 20MB)</p>
                                </div>
                                <Input id="deck-upload" type="file" className="hidden" accept=".pdf,.pptx"/>
                            </label>
                        </div> 
                    </FormControl>
                    <FormDescription>Your main presentation file.</FormDescription>
                </FormItem>
                 <FormItem>
                    <FormLabel>Optional Audio/Video</FormLabel>
                    <FormControl>
                         <div className="flex items-center justify-center w-full">
                            <label htmlFor="media-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-accent/50 hover:bg-accent/80">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground"/>
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">MP3, MP4, MOV (MAX. 100MB)</p>
                                </div>
                                <Input id="media-upload" type="file" className="hidden" accept=".mp3,.mp4,.mov"/>
                            </label>
                        </div> 
                    </FormControl>
                    <FormDescription>An optional elevator pitch or demo.</FormDescription>
                </FormItem>
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-4">
                <Button type="submit">Submit for Review</Button>
                <Button type="button" variant="secondary" onClick={onSaveDraft}>Save Draft</Button>
                <div className="sm:mr-auto">
                    <Button type="button" variant="outline" onClick={onScheduleWithAgent}>Schedule with AI Agent</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
