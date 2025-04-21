import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6'>
      <h1 className='text-3xl font-semibold'>Settings</h1>
      <p className='text-muted-foreground mt-2 text-sm'>Manage your Nest account preferences here.</p>
    </div>
  );
}
