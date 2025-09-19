"use client";
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
import { startups, memos, connections, meetings } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight, FileText, UserCheck, Users, Calendar, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


function MyStartupCard() {
    const myStartup = startups[0]; // Assume this is the founder's startup
    if (!myStartup) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>My Startup: {myStartup.company}</span>
                    <Link href="/founder/submit">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </Link>
                </CardTitle>
                <CardDescription>Latest submission status and details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={myStartup.status === 'Approved' ? "default" : 'secondary'} className={cn(myStartup.status === 'Approved' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30')}>
                        {myStartup.status}
                    </Badge>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <span className="text-sm font-medium">{formatDate(myStartup.submittedAt)}</span>
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

function MemosCard() {
    const myMemos = memos.filter(m => startups.some(s => s.id === m.startupId && s.founderId === "3"));
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText/> Memos</CardTitle>
                <CardDescription>AI-generated investment memos on your startup.</CardDescription>
            </CardHeader>
            <CardContent>
                {myMemos.length > 0 ? (
                    <ul className="space-y-4">
                        {myMemos.map(memo => (
                            <li key={memo.id}>
                                <Link href={`/memo/${memo.id}`} className="block hover:bg-accent/50 p-3 rounded-md transition-colors">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{memo.type}</p>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Progress value={memo.status === 'Completed' ? 100 : 50} className="h-2" />
                                        <span className="text-xs text-muted-foreground">{memo.status}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No memos generated yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function InvestorInterestCard() {
     const myConnections = connections.filter(c => c.founderId === '3');
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCheck /> Investor Interest</CardTitle>
                <CardDescription>Investors who have shown interest in your startup.</CardDescription>
            </CardHeader>
            <CardContent>
                {myConnections.length > 0 ? (
                    <ul className="space-y-3">
                       {myConnections.map(c => (
                            <li key={c.id} className="flex items-center justify-between">
                                <p className="font-medium">Investor #{c.investorId}</p>
                                <Badge variant={c.status === 'accepted' ? 'default' : c.status === 'requested' ? 'secondary' : 'destructive'} className={cn(c.status === 'accepted' ? 'bg-green-500/20 text-green-700 border-green-500/30' : c.status === 'requested' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : '')}>
                                    {c.status}
                                </Badge>
                            </li>
                       ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No investor interest yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function ConnectionsCard() {
    const acceptedConnections = connections.filter(c => c.founderId === '3' && c.status === 'accepted');

    const handleCancel = () => {
        // Mock action
        alert("Connection cancelled (mock).");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Connections</CardTitle>
                <CardDescription>Your active investor connections.</CardDescription>
            </CardHeader>
            <CardContent>
                 {acceptedConnections.length > 0 ? (
                    <ul className="space-y-3">
                       {acceptedConnections.map(c => (
                            <li key={c.id} className="flex items-center justify-between">
                                <p className="font-medium">Investor #{c.investorId}</p>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleCancel}>Cancel</Button>
                            </li>
                       ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No active connections.</p>
                )}
            </CardContent>
        </Card>
    );
}

function MeetingsCard() {
    const myMeetings = meetings.filter(m => m.participants.includes("founder@startupverse.com"));
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar/> Meetings</CardTitle>
                <CardDescription>Your upcoming and past meetings.</CardDescription>
            </CardHeader>
            <CardContent>
                 {myMeetings.length > 0 ? (
                    <ul className="space-y-3">
                       {myMeetings.map(m => (
                           <li key={m.id}>
                               <div className="flex items-start justify-between">
                                   <div>
                                    <p className="font-semibold">{m.title}</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(m.time, {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
                                   </div>
                                    <Badge variant={m.status === 'Upcoming' ? 'default' : 'secondary'} className={cn(m.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : '')}>{m.status}</Badge>
                               </div>
                               {m.status === 'Upcoming' && (
                                   <div className="flex gap-2 mt-2">
                                       <Button size="sm" variant="outline">Reschedule</Button>
                                       <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">Cancel</Button>
                                   </div>
                               )}
                           </li>
                       ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No meetings scheduled.</p>
                )}
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
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-1 space-y-6">
            <MyStartupCard />
            <MemosCard />
        </div>
        <div className="xl:col-span-2 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <InvestorInterestCard />
                <ConnectionsCard />
            </div>
            <MeetingsCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
