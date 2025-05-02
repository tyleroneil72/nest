'use client';

import { useState } from 'react';

interface CreateAccountModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateAccountModal({ onClose, onCreated }: CreateAccountModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create account');

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='w-full max-w-md rounded-lg bg-neutral-900 p-6 text-white shadow-lg'>
        <h2 className='mb-4 text-lg font-semibold'>Add New Account</h2>

        <div className='space-y-3'>
          <input
            placeholder='e.g. Wealthsimple TFSA'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          />
          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={onClose} className='text-sm text-gray-400 hover:text-white'>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name}
            className='rounded bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500'
          >
            {loading ? 'Creating...' : 'Add Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
