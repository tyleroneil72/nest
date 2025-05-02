'use client';

import { useEffect, useState } from 'react';

interface EditGoalModalProps {
  currentGoal: number;
  onClose: () => void;
  onSave: (newGoal: number) => void;
}

export default function EditGoalModal({ currentGoal, onClose, onSave }: EditGoalModalProps) {
  const [value, setValue] = useState(currentGoal.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [value]);

  const handleSave = () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid number greater than 0.');
      return;
    }

    onSave(Number(parsed.toFixed(2)));
    onClose();
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='w-full max-w-sm rounded-lg bg-neutral-900 p-6 text-white shadow-lg'>
        <h2 className='mb-4 text-lg font-semibold'>Edit Portfolio Goal</h2>

        <label className='block text-sm'>
          Goal ($)
          <input
            type='number'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className='mt-1 w-full rounded bg-neutral-800 p-2 text-sm'
          />
        </label>

        {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}

        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={onClose} className='text-sm text-gray-400 hover:text-white'>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='rounded bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
