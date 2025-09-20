// src/app/memo/[id]/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import MemoClient from './MemoClient';

export default function Page() {
  return <MemoClient />;
}
