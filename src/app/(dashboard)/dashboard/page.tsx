'use client';

import { signOut, useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl font-semibold'>Welcome, {session.user?.name}</h1>
      <button
        onClick={() => signOut()}
        className='rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800'
      >
        Sign Out
      </button>
    </div>
  );
}
