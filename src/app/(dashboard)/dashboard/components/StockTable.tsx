'use client';

import { useEffect, useState } from 'react';
import CreateAccountModal from './CreateAccountModal';
import CreateStockModal from './CreateStockModal';

type Stock = {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  avgPrice: number;
  dividendYield: number;
  account: string;
};

type AccountOption = {
  id: string;
  label: string;
};

const StockTable = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>('All');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const filteredStocks =
    selectedAccount === 'All' ? stocks : stocks.filter((stock) => stock.account === selectedAccount);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const json = await res.json();
      setAccountOptions(json.accounts);
    } catch {
      console.error('Failed to load accounts');
    }
  };

  const refreshStocks = async () => {
    try {
      const res = await fetch('/api/stocks');
      const json = await res.json();
      setStocks(json.stocks);
    } catch {
      console.error('Failed to fetch stocks');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this stock?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/stocks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await refreshStocks();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong.');
    }
  };

  useEffect(() => {
    fetchAccounts();
    refreshStocks();
  }, []);

  // Create a unique list of labels for filtering (deduplicated by name)
  const filterLabels = ['All', ...Array.from(new Set(accountOptions.map((a) => a.label)))];

  return (
    <div className='mt-10 w-full max-w-screen-lg rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-white shadow-md'>
      {/* Filter Tabs */}
      <div className='mb-4 flex flex-wrap gap-2'>
        {filterLabels.map((label) => (
          <button
            key={label}
            onClick={() => setSelectedAccount(label)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition ${
              selectedAccount === label
                ? 'bg-indigo-600 text-white'
                : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Stock Holdings</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className='rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200'
          >
            + Add Account
          </button>
          <button
            onClick={() => setIsStockModalOpen(true)}
            className='rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500'
          >
            + Add Stock
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b border-neutral-700 text-gray-400'>
              <th className='px-4 py-2'>Ticker</th>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Shares</th>
              <th className='px-4 py-2'>Average Price</th>
              <th className='px-4 py-2'>Dividend Yield</th>
              <th className='px-4 py-2'>Account</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.id} className='border-b border-neutral-800'>
                <td className='px-4 py-2'>{stock.ticker}</td>
                <td className='px-4 py-2'>{stock.name}</td>
                <td className='px-4 py-2'>{stock.shares}</td>
                <td className='px-4 py-2'>${stock.avgPrice.toLocaleString()}</td>
                <td className='px-4 py-2'>{stock.dividendYield.toFixed(2)}%</td>
                <td className='px-4 py-2'>{stock.account}</td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => handleDelete(stock.id)}
                    className='rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isStockModalOpen && (
        <CreateStockModal
          accountOptions={accountOptions}
          onClose={() => setIsStockModalOpen(false)}
          onCreated={refreshStocks}
        />
      )}
      {isAccountModalOpen && (
        <CreateAccountModal
          onClose={() => setIsAccountModalOpen(false)}
          onCreated={() => {
            setIsAccountModalOpen(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
};

export default StockTable;
