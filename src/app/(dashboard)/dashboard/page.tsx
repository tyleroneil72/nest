import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DropdownMenu from './DropdownMenu';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center gap-4 p-6'>
      <DropdownMenu image={session.user?.image || ''} />
      <h1 className='text-4xl font-semibold'>Welcome, {session.user?.name}</h1>
    </div>
  );
}
