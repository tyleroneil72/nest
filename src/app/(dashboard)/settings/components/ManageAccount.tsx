'use client';

import { useSession } from 'next-auth/react';

export default function ManageAccount() {
  const { data: session } = useSession();

  if (!session) return null;

  const { user } = session;

  return (
    <div className='mx-auto max-w-xl rounded-xl bg-zinc-900 p-8 shadow-md'>
      <h2 className='mb-6 text-2xl font-semibold'>Manage Account</h2>

      <div className='mb-6 flex items-center gap-4'>
        <div>
          <p className='text-sm'>
            <span className='font-semibold'>First Name:</span> {user?.name?.split(' ')[0]}
          </p>
          <p className='text-sm'>
            <span className='font-semibold'>Last Name:</span> {user?.name?.split(' ').slice(1).join(' ')}
          </p>
          <p className='text-sm'>
            <span className='font-semibold'>Email:</span> {user?.email}
          </p>
        </div>
      </div>

      <div className='flex gap-4'>
        <button className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700'>
          Delete Account
        </button>
        <button className='rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600'>
          Restore Fresh Account
        </button>
      </div>
    </div>
  );
}
