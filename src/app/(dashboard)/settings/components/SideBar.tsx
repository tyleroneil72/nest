'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { FaArrowLeft, FaCog, FaDatabase } from 'react-icons/fa';

type Props = {
  current: 'manage' | 'export';
  setSection: Dispatch<SetStateAction<'manage' | 'export'>>;
};

export default function SideBar({ current, setSection }: Props) {
  const { data: session } = useSession();

  return (
    <aside className='bg-gray-1900 flex w-64 flex-col justify-between border-r border-gray-800 bg-gray-900 p-6 text-gray-100'>
      <div>
        {session?.user?.image && (
          <div className='mb-6 flex items-center space-x-4'>
            <Image
              src={session.user.image}
              alt='Profile'
              width={48}
              height={48}
              className='rounded-full object-cover'
            />
            <div>
              <p className='font-semibold'>{session.user.name}</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{session.user.email}</p>
            </div>
          </div>
        )}
        <nav className='space-y-2'>
          <button
            onClick={() => setSection('manage')}
            className={`flex w-full items-center rounded-md px-3 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-800 ${
              current === 'manage' ? 'bg-gray-300 dark:bg-gray-700' : ''
            }`}
          >
            <FaCog className='mr-2' />
            Manage Account
          </button>
          <button
            onClick={() => setSection('export')}
            className={`flex w-full items-center rounded-md px-3 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-800 ${
              current === 'export' ? 'bg-gray-300 dark:bg-gray-700' : ''
            }`}
          >
            <FaDatabase className='mr-2' />
            Export / Import
          </button>
        </nav>
      </div>
      <div className='space-y-4'>
        <Link href='/dashboard' className='flex items-center text-sm text-indigo-600 hover:underline'>
          <FaArrowLeft className='mr-2' />
          Back to Dashboard
        </Link>
        <Link href='/terms' className='text-xs text-gray-600 hover:underline dark:text-gray-400'>
          Terms of Service
        </Link>
      </div>
    </aside>
  );
}
