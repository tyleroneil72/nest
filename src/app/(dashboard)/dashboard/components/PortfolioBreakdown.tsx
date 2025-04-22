'use client';

import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLOURS = [
  '#6366f1', // Indigo
  '#22d3ee', // Cyan
  '#10b981', // Emerald
  '#fbbf24', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#60a5fa' // Blue
];

type BreakdownView = 'combined' | 'TFSA' | 'RRSP' | 'FHSA' | 'Crypto';

const breakdownOptions: BreakdownView[] = ['combined', 'TFSA', 'RRSP', 'FHSA', 'Crypto'];

const mockHoldings: Record<BreakdownView, { name: string; value: number }[]> = {
  combined: [
    { name: 'AAPL', value: 15000 },
    { name: 'GOOGL', value: 12000 },
    { name: 'BTC', value: 10000 },
    { name: 'TSLA', value: 9000 },
    { name: 'ETH', value: 8000 },
    { name: 'AMZN', value: 7000 },
    { name: 'MSFT', value: 6000 },
    { name: 'NFLX', value: 5000 },
    { name: 'NVDA', value: 4000 },
    { name: 'XRP', value: 3000 }
  ],
  TFSA: [
    { name: 'AAPL', value: 15000 },
    { name: 'TSLA', value: 9000 },
    { name: 'MSFT', value: 6000 }
  ],
  RRSP: [
    { name: 'GOOGL', value: 12000 },
    { name: 'AMZN', value: 7000 }
  ],
  FHSA: [
    { name: 'VFV', value: 8000 },
    { name: 'NVDA', value: 4000 }
  ],
  Crypto: [
    { name: 'BTC', value: 10000 },
    { name: 'XRP', value: 3000 }
  ]
};

const MAX_VISIBLE = 6;

const collapseData = (data: { name: string; value: number }[]) => {
  if (data.length <= MAX_VISIBLE) return data;
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const visible = sorted.slice(0, MAX_VISIBLE);
  const otherValue = sorted.slice(MAX_VISIBLE).reduce((sum, item) => sum + item.value, 0);
  return [...visible, { name: 'Other', value: otherValue }];
};

const PortfolioBreakdown = () => {
  const [viewMode, setViewMode] = useState<BreakdownView>('combined');
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const rawData = mockHoldings[viewMode];
  const data = collapseData(rawData);
  const total = rawData.reduce((acc, item) => acc + item.value, 0);

  const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: windowWidth <= 768 ? 'compact' : 'standard',
      maximumFractionDigits: 0
    }).format(value);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='mt-10 w-full max-w-screen-lg rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-white shadow-md'>
      {/* Toggle View */}
      <div className='mb-4 flex flex-wrap gap-2'>
        {breakdownOptions.map((option) => (
          <button
            key={option}
            onClick={() => setViewMode(option)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition ${
              viewMode === option ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
            }`}
          >
            {option === 'combined' ? 'All Accounts' : option}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>
          Portfolio Breakdown by {viewMode === 'combined' ? 'Ticker' : viewMode}
        </h2>
      </div>

      {/* Chart */}
      <div className='flex flex-col items-center'>
        <div className='h-[400px] w-full px-4 pt-6 sm:px-6'>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                innerRadius={70}
                outerRadius={100}
                labelLine={windowWidth > 768}
                label={windowWidth > 768 ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)` : false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOURS[index % COLOURS.length]} />
                ))}
              </Pie>

              {/* Total value in center */}
              <text
                x='50%'
                y='47%'
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize={windowWidth <= 768 ? 18 : 20}
                fontWeight='600'
                fill='#ffffff'
              >
                {formatCompactCurrency(total)}
              </text>

              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#4b5563',
                  borderRadius: '0.375rem',
                  color: '#f9fafb',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.75rem'
                }}
                itemStyle={{
                  color: '#f9fafb'
                }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Legend verticalAlign='bottom' iconType='circle' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBreakdown;
