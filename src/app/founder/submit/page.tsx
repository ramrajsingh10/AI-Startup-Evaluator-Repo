// src/app/founder/submit/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import SubmissionClient from './SubmissionClient';

export default function Page() {
  return <SubmissionClient />;
}
