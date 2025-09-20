'use client';

import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useParams } from 'next/navigation';
import React from 'react';

interface Memo {
  id: string;
  startupId: string;
  content: string;
  type: string;
}

interface Startup {
    id: string;
    name: string;
    description: string;
    website: string;
}

export default function MemoClient() {
    const { id: memoId } = useParams();
    const { user } = useAuth();
    const [memo, setMemo] = React.useState<Memo | null>(null);
    const [startup, setStartup] = React.useState<Startup | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchMemoAndStartup = async () => {
            if (!user || !memoId) return;

            try {
                setLoading(true);
                const token = await user.getIdToken();
                
                // Fetch Memo
                const memoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memos/${memoId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!memoResponse.ok) throw new Error("Failed to fetch memo.");
                const memoData: Memo = await memoResponse.json();
                setMemo(memoData);

                // Fetch Startup associated with memo
                // Note: In a real app, you might get startup info from the memo object itself
                // or have a dedicated endpoint. Here we assume a simple fetch.
                if (memoData.startupId) {
                    const startupResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups/${memoData.startupId}`, {
                         headers: { Authorization: `Bearer ${token}` }
                    });
                     if (!startupResponse.ok) throw new Error("Failed to fetch startup details.");
                    const startupData: Startup = await startupResponse.json();
                    setStartup(startupData);
                }

                setError(null);
            } catch (err) {
                setError("An error occurred while fetching the memo.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemoAndStartup();
    }, [user, memoId]);

    if (loading) {
        return (
            <DashboardLayout>
                <PageHeader title="Investment Memo" description="Loading memo..." />
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <div className='space-y-2'>
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent className="space-y-4">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
             <DashboardLayout>
                <PageHeader title="Error" description="Failed to load memo" />
                <Card>
                    <CardContent>
                        <p className="text-destructive text-center py-12">{error}</p>
                    </CardContent>
                </Card>
            </DashboardLayout>
        )
    }

  return (
    <DashboardLayout>
      <PageHeader
        title={startup?.name ? `Memo for ${startup.name}` : "Investment Memo"}
        description={memo?.type || "AI-Generated Investment Memo"}
      />
      <div className="space-y-8">
        {startup && (
             <Card>
                <CardHeader>
                    <CardTitle>{startup.name}</CardTitle>
                    <CardDescription>{startup.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visit Website
                    </a>
                </CardContent>
            </Card>
        )}
        <Card>
            <CardHeader><CardTitle>Memo Details</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                    {memo?.content || "No content available for this memo."}
                </p>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
