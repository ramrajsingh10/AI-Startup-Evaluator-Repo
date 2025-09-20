// src/app/founder/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import FounderClient from './FounderClient';

export default function Page() {
  return <FounderClient />;
}
