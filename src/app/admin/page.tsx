// src/app/admin/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import AdminClient from './AdminClient';

export default function Page() {
  return <AdminClient />;
}
