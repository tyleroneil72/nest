'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center p-6 sm:p-12'>
      <div className='flex max-w-2xl flex-col items-center gap-8 text-center'>
        <Image src='/nest-logo.png' alt='Nest logo' width={250} height={250} priority />
        <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>Grow your portfolio with purpose.</h1>
        <p className='text-muted-foreground max-w-md text-base sm:text-lg'>
          Nest helps you visualize your long-term investment growth with meaningful insights, clean charts, and zero
          friction.
        </p>
        <button
          onClick={() => signIn('google')}
          className='rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800'
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
