'use client';

import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * This is a static placeholder page for the /memo/[id] route.
 * It displays a simple UI indicating that a memo is being loaded or displayed.
 * All dynamic data fetching logic has been removed to resolve build errors.
 */
export default function MemoPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Investment Memo"
        description="AI-Generated Investment Memo"
      />
      <div className="space-y-8">
        <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className='space-y-2'>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
        <Card>
            <CardHeader><CardTitle>Memo Details</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    This is a placeholder for the startup memo. The dynamic content has been
                    temporarily removed to ensure a successful deployment.
                </p>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
