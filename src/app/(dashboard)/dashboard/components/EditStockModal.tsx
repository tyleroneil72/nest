'use client';

import { useState } from 'react';

interface EditStockModalProps {
  stock: {
    id: string;
    ticker: string;
    name: string;
    shares: number;
    avgPrice: number;
    dividendYield: number;
    account: string; // Label shown to user (e.g., "TFSA")
    accountId: string; // Internal ID used in DB
  };
  accountOptions: { id: string; label: string }[];
  onClose: () => void;
  onUpdated?: () => void;
}

export default function EditStockModal({ stock, accountOptions, onClose, onUpdated }: EditStockModalProps) {
  const [form, setForm] = useState({
    ticker: stock.ticker,
    name: stock.name,
    shares: stock.shares.toString(),
    averagePrice: stock.avgPrice.toString(),
    dividendYield: stock.dividendYield.toString(),
    accountId: stock.accountId
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/stocks/${stock.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          shares: parseFloat(form.shares),
          averagePrice: parseFloat(form.averagePrice),
          dividendYield: parseFloat(form.dividendYield)
        })
      });

      if (!res.ok) throw new Error('Failed to update stock');

      if (onUpdated) onUpdated();
      onClose();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='w-full max-w-md rounded-lg bg-neutral-900 p-6 text-white shadow-lg'>
        <h2 className='mb-4 text-lg font-semibold'>Edit Stock</h2>

        <div className='space-y-3'>
          <input
            name='ticker'
            placeholder='Ticker'
            value={form.ticker}
            onChange={handleChange}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          />
          <input
            name='name'
            placeholder='Company Name'
            value={form.name}
            onChange={handleChange}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          />
          <input
            name='shares'
            placeholder='Number of Shares'
            type='number'
            value={form.shares}
            onChange={handleChange}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          />
          <input
            name='averagePrice'
            placeholder='Average Price'
            type='number'
            value={form.averagePrice}
            onChange={handleChange}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          />
          <input
            name='dividendYield'
            placeholder='Dividend Yield (%)'
            type='number'
            value={form.dividendYield}
            onChange={handleChange}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          />

          <select
            name='accountId'
            value={form.accountId}
            onChange={handleChange}
            className='w-full rounded bg-neutral-800 p-2 text-sm'
          >
            {accountOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={onClose} className='text-sm text-gray-400 hover:text-white'>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='rounded bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
