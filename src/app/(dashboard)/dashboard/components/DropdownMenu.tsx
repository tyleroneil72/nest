'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function DropdownMenu({ image }: { image: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='absolute top-6 right-6 z-50'>
      <div className='relative' ref={ref}>
        {/* Profile Image Button */}
        <button onClick={() => setIsOpen(!isOpen)}>
          <Image
            src={image || '/placeholder-avatar.png'}
            alt='Profile'
            width={50}
            height={50}
            className='rounded-full shadow-md'
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className='absolute right-0 mt-2 w-40 rounded-md bg-white p-2 text-sm shadow-lg'
            >
              <Link
                href='/settings'
                className='block w-full rounded px-4 py-2 text-left text-black hover:bg-neutral-100'
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className='block w-full rounded px-4 py-2 text-left text-black hover:bg-neutral-100'
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
