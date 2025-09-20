// src/app/investor/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import InvestorClient from './InvestorClient';

export default function Page() {
  return <InvestorClient />;
}
