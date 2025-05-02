'use client';

import { useEffect, useState } from 'react';

interface EditInsightsModalProps {
  insights: {
    monthlyContribution: number;
    growthRate: number;
    dividendYield: number;
  };
  onClose: () => void;
  onSave: (updated: EditInsightsModalProps['insights']) => void;
}

export default function EditInsightsModal({ insights, onClose, onSave }: EditInsightsModalProps) {
  const [form, setForm] = useState({
    monthlyContribution: insights.monthlyContribution,
    growthRate: (insights.growthRate * 100).toFixed(2), // % string
    dividendYield: (insights.dividendYield * 100).toFixed(2) // % string
  });

  const [error, setError] = useState('');

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    const contribution = parseFloat(form.monthlyContribution.toString());
    const growth = parseFloat(form.growthRate.toString());
    const yieldVal = parseFloat(form.dividendYield.toString());

    if (isNaN(contribution) || contribution < 0 || isNaN(growth) || growth < 0 || isNaN(yieldVal) || yieldVal < 0) {
      setError('Please enter valid non-negative numbers.');
      return;
    }

    onSave({
      monthlyContribution: Number(contribution.toFixed(2)),
      growthRate: Number((growth / 100).toFixed(4)),
      dividendYield: Number((yieldVal / 100).toFixed(4))
    });

    onClose();
  };

  useEffect(() => {
    setError('');
  }, [form]);

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='w-full max-w-sm rounded-lg bg-neutral-900 p-6 text-white shadow-lg'>
        <h2 className='mb-4 text-lg font-semibold'>Edit Portfolio Insights</h2>

        <div className='space-y-3'>
          <label className='block text-sm'>
            Monthly Contribution ($)
            <input
              type='number'
              step='0.01'
              value={form.monthlyContribution}
              onChange={handleChange('monthlyContribution')}
              className='mt-1 w-full rounded bg-neutral-800 p-2 text-sm'
            />
          </label>

          <label className='block text-sm'>
            Dividend Yield (%)
            <input
              type='number'
              step='0.01'
              value={form.dividendYield}
              onChange={handleChange('dividendYield')}
              className='mt-1 w-full rounded bg-neutral-800 p-2 text-sm'
            />
          </label>

          <label className='block text-sm'>
            Growth Rate (%)
            <input
              type='number'
              step='0.01'
              value={form.growthRate}
              onChange={handleChange('growthRate')}
              className='mt-1 w-full rounded bg-neutral-800 p-2 text-sm'
            />
          </label>

          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>

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
