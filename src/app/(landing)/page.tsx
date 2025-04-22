'use client';

import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';

export default function Home() {
  return (
    <div className='relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-neutral-900 to-neutral-950 p-6'>
      {/* Subtle radial glow */}
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-700/10 via-transparent to-transparent'></div>

      {/* Glass card with motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex w-full max-w-2xl flex-col items-center gap-8 rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-xl backdrop-blur-sm'
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Image src='/nest-logo.png' alt='Nest logo' width={200} height={200} priority className='drop-shadow-lg' />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='text-4xl font-semibold tracking-tight text-white sm:text-5xl'
        >
          Grow your portfolio <br />
          <span className='text-indigo-400'>with purpose.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className='max-w-md text-base text-gray-300 sm:text-lg'
        >
          Nest helps you visualize your long-term investment growth with clean insights, beautiful charts, and zero
          friction.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.7,
            duration: 0.6,
            ease: 'easeOut'
          }}
          onClick={() => signIn('google')}
          className='flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow transition hover:bg-neutral-200'
        >
          <FaGoogle className='text-lg' />
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
