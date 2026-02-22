// app/(dashboard)/page.js
import { auth } from '../../auth.js';
import { redirect } from 'next/navigation';

export default async function DashboardRoot() {
  // 1. Get the securely logged-in user
  const session = await auth();

  // 2. Double-check they are logged in (Safety net)
  if (!session || !session.user) {
    redirect('/login');
  }

  // 3. Traffic Control: Route them based on their Role
  if (session.user.role === 'JOB_PROVIDER') {
    redirect('/dashboard/client');
  } else if (session.user.role === 'WORKER') {
    redirect('/dashboard/worker');
  } else if (session.user.role === 'ADMIN') {
    redirect('/dashboard/admin');
  }

  return <p>Redirecting securely...</p>;
}