'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center gap-4 p-6'>
      {/* Top-right profile image */}
      <div className='absolute top-6 right-6'>
        <Image
          src={session.user?.image || '/placeholder-avatar.png'}
          alt='Profile'
          width={40}
          height={40}
          className='rounded-full border border-white shadow-md'
        />
      </div>

      {/* Main dashboard content */}
      <h1 className='text-4xl font-semibold'>Welcome, {session.user?.name}</h1>
      <button
        onClick={() => signOut()}
        className='rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200'
      >
        Sign Out
      </button>
    </div>
  );
}
