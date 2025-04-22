'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const mockGoal = 1_000_000;
const mockCurrent = 18_073.54;
const mockMonthlyContribution = 1650;
const mockGrowthRate = 0.072; // 7.2%
const mockDividendYield = 0.013;

const MAX_YEARS = 50;

const calculateProjections = () => {
  const data = [];
  let totalPortfolio = mockCurrent;
  let totalContributions = 0;
  let reachedGoalAt: number | null = null;

  for (let year = 0; year <= MAX_YEARS; year++) {
    const isFirst = year === 0;
    const annualContribution = isFirst ? 0 : mockMonthlyContribution * 12;

    if (!isFirst) {
      const growth = totalPortfolio * mockGrowthRate;
      const dividends = totalPortfolio * mockDividendYield;
      totalPortfolio += annualContribution + growth + dividends;
      totalContributions += annualContribution;
    }

    const returns = totalPortfolio - mockCurrent - totalContributions;
    const totalValue = mockCurrent + totalContributions + returns;

    if (reachedGoalAt === null && totalValue >= mockGoal) {
      reachedGoalAt = year;
    }

    data.push({
      year: isFirst ? 'Today' : `${year} years`,
      current: mockCurrent,
      contributions: totalContributions,
      returns: returns > 0 ? returns : 0
    });

    if (reachedGoalAt !== null) break;
  }

  return {
    data,
    yearsToGoal: reachedGoalAt ?? MAX_YEARS
  };
};

const PortfolioInsights = () => {
  const [goal] = useState(mockGoal);
  const progress = (mockCurrent / goal) * 100;

  const { data: projections, yearsToGoal } = calculateProjections();

  return (
    <div className='rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-white shadow-md'>
      {/* Portfolio Goal */}
      <div className='mb-6'>
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Portfolio Goal</h2>
          <button className='text-sm text-purple-300 hover:underline'>Edit</button>
        </div>
        <div className='text-2xl font-bold text-purple-400'>
          ${mockCurrent.toLocaleString()} / ${goal.toLocaleString()}
        </div>
        <div className='mt-1 text-sm text-gray-400'>
          You’re aiming to reach this in 🎯 <span className='text-purple-300'>{yearsToGoal} years</span>
        </div>
        <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-700'>
          <div className='h-full bg-purple-500 transition-all' style={{ width: `${progress.toFixed(2)}%` }} />
        </div>
      </div>

      {/* Projection Chart */}
      <div className='mb-6'>
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Projections</h2>
          <button className='text-sm text-purple-300 hover:underline'>Edit</button>
        </div>
        <div className='mb-4 text-gray-300'>
          You’ll reach your goal of <span className='font-semibold text-purple-300'>${goal.toLocaleString()}</span> in
          approximately <span className='font-semibold text-purple-300'>{yearsToGoal} years</span> 🎯
        </div>

        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={projections} margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#333' />
            <XAxis dataKey='year' stroke='#ccc' />
            <YAxis
              stroke='#ccc'
              tickFormatter={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            />
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              }
              labelStyle={{ color: '#fff' }}
              contentStyle={{ backgroundColor: '#111', borderColor: '#444', color: '#fff' }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Legend
              wrapperStyle={{ color: '#ccc' }}
              formatter={(value) => {
                const names = {
                  current: 'Current Amount',
                  contributions: 'Contributions',
                  returns: 'Returns'
                };
                return names[value as keyof typeof names] || value;
              }}
            />

            <Bar dataKey='current' stackId='a' fill='#ddd6fe' name='Current Amount' />
            <Bar dataKey='contributions' stackId='a' fill='#c4b5fd' name='Contributions' />
            <Bar dataKey='returns' stackId='a' fill='#a78bfa' name='Returns' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stat Blocks */}
      <div className='grid grid-cols-1 gap-4 text-center text-sm text-gray-300 sm:grid-cols-3'>
        <div className='rounded-md bg-neutral-800 p-3'>
          💰 <span className='font-medium'>${mockMonthlyContribution}</span>
          <div className='text-xs text-gray-400'>Monthly Deposits</div>
        </div>
        <div className='rounded-md bg-neutral-800 p-3'>
          📈 <span className='font-medium'>{(mockDividendYield * 100).toFixed(1)}%</span>
          <div className='text-xs text-gray-400'>Dividend Yield</div>
        </div>
        <div className='rounded-md bg-neutral-800 p-3'>
          📊 <span className='font-medium'>{(mockGrowthRate * 100).toFixed(1)}%</span>
          <div className='text-xs text-gray-400'>Portfolio Growth</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInsights;
