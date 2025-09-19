
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import MemoPageContent from '@/app/memo/[id]/memo-page-content';

function MemoPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  return (
    <DashboardLayout>
      <MemoPageContent id={params.id} />
    </DashboardLayout>
  );
}

export default function MemoPageWrapper({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MemoPage params={params} />
    </Suspense>
  )
}
