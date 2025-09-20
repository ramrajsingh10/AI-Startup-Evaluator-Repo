// src/app/meet/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import MeetClient from './MeetClient';

export default function Page() {
  return <MeetClient />;
}
