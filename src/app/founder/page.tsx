"use client";

// This forces the page to be rendered dynamically.
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight, FileText, UserCheck, Users, Calendar, Edit } from "lucide-react";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface Startup {
  id: string;
  name: string;
  description: string;
  website: string;
  status?: "Pending" | "Approved" | "Rejected";
  submittedAt?: string; // Assuming ISO string date
}

interface DashboardData {
  startup: Startup | null;
  memos: any[];
  investor_interest: any[];
}

function MyStartupCard({ startup, isLoading }: { startup: Startup | null, isLoading: boolean }) {
    if (isLoading) {
      return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
                 <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
      );
    }
    
    if (!startup) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Startup</CardTitle>
                    <CardDescription>You have not submitted a startup yet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-center text-muted-foreground py-4">
                        Submit your startup to get discovered by investors.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/founder/submit">Make First Submission</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{startup.name}</span>
                    <Link href="/founder/submit">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </Link>
                </CardTitle>
                <CardDescription>Latest submission status and details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                     <Badge variant={startup.status === 'Approved' ? "default" : 'secondary'} className={cn(startup.status === 'Approved' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30')}>
                        {startup.status || 'Pending'}
                    </Badge>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <span className="text-sm font-medium">{startup.submittedAt ? formatDate(new Date(startup.submittedAt)) : 'N/A'}</span>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" asChild>
                    <Link href="/founder/submit">
                        <Edit className="mr-2 h-4 w-4" /> Edit Submission
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function MemosCard({ memos }: { memos: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText/> Memos</CardTitle>
                <CardDescription>AI-generated investment memos on your startup.</CardDescription>
            </CardHeader>
            <CardContent>
                {memos.length > 0 ? (
                    <ul className="space-y-4">
                        {/* Memos list would be rendered here */}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No memos generated yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function InvestorInterestCard({ interests }: { interests: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCheck /> Investor Interest</CardTitle>
                <CardDescription>Investors who have shown interest in your startup.</CardDescription>
            </CardHeader>
            <CardContent>
                {interests.length > 0 ? (
                     <ul className="space-y-3">
                        {/* Investor interest list would be rendered here */}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No investor interest yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function ConnectionsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Connections</CardTitle>
                <CardDescription>Your active investor connections.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground text-center py-4">No active connections.</p>
            </CardContent>
        </Card>
    );
}

function MeetingsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar/> Meetings</CardTitle>
                <CardDescription>Your upcoming and past meetings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">No meetings scheduled.</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                    <Link href="/meet">Schedule a New Meeting</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function FounderPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const token = await user.getIdToken();
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard data.");
                }

                const data: DashboardData = await response.json();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                setError("An error occurred while fetching your dashboard.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Founder Dashboard"
        description="Manage your startup, track progress, and connect with investors."
      >
        <Button asChild>
            <Link href="/founder/submit">New Submission</Link>
        </Button>
      </PageHeader>
       {error && <div className="text-center py-12 text-destructive">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-1 space-y-6">
            <MyStartupCard startup={dashboardData?.startup || null} isLoading={loading} />
            <MemosCard memos={dashboardData?.memos || []} />
        </div>
        <div className="xl:col-span-2 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <InvestorInterestCard interests={dashboardData?.investor_interest || []} />
                <ConnectionsCard />
            </div>
            <MeetingsCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
