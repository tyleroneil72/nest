'use client';

import { useState } from 'react';

type AccountType = 'All' | 'TFSA' | 'RRSP' | 'FHSA' | 'Crypto';

type Stock = {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  avgPrice: number;
  dividends: number;
  account: AccountType;
};

const mockStocks: Stock[] = [
  {
    id: '1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    avgPrice: 120,
    dividends: 200,
    account: 'TFSA'
  },
  {
    id: '2',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 30,
    avgPrice: 2200,
    dividends: 500,
    account: 'RRSP'
  },
  {
    id: '3',
    ticker: 'BTC',
    name: 'Bitcoin',
    shares: 0.5,
    avgPrice: 30000,
    dividends: 0,
    account: 'Crypto'
  },
  {
    id: '4',
    ticker: 'VFV',
    name: 'Vanguard S&P 500 ETF',
    shares: 10,
    avgPrice: 100,
    dividends: 0,
    account: 'FHSA'
  }
];

const accountTypes: AccountType[] = ['All', 'TFSA', 'RRSP', 'FHSA', 'Crypto'];

const StockTable = () => {
  const [selectedAccount, setSelectedAccount] = useState<AccountType>('All');
  const [stocks] = useState<Stock[]>(mockStocks);

  const filteredStocks =
    selectedAccount === 'All' ? stocks : stocks.filter((stock) => stock.account === selectedAccount);

  return (
    <div className='mt-10 w-full max-w-screen-lg rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-white shadow-md'>
      {/* Tabs */}
      <div className='mb-4 flex flex-wrap gap-2'>
        {accountTypes.map((account) => (
          <button
            key={account}
            onClick={() => setSelectedAccount(account)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition ${
              selectedAccount === account
                ? 'bg-indigo-600 text-white'
                : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
            }`}
          >
            {account}
          </button>
        ))}
      </div>

      {/* Add Stock */}
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Stock Holdings</h2>
        <button
          onClick={() => alert('Add stock modal coming soon')}
          className='rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500'
        >
          + Add Stock
        </button>
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
              <th className='px-4 py-2'>Dividends</th>
              <th className='px-4 py-2'>Account</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.id} className='border-b border-neutral-800'>
                <td className='px-4 py-2'>{stock.ticker}</td>
                <td className='px-4 py-2'>{stock.name}</td>
                <td className='px-4 py-2'>{stock.shares}</td>
                <td className='px-4 py-2'>${stock.avgPrice.toLocaleString()}</td>
                <td className='px-4 py-2'>${stock.dividends.toLocaleString()}</td>
                <td className='px-4 py-2'>{stock.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
