'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EditGoalModal from './EditGoalModal';
import EditInsightsModal from './EditInsightsModal';

const MAX_YEARS = 50;

type Stock = {
  value: number;
};

type Insights = {
  goal: number;
  monthlyContribution: number;
  growthRate: number;
  dividendYield: number;
};

type Projection = {
  year: string;
  current: number;
  contributions: number;
  returns: number;
};

const PortfolioInsights = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [projections, setProjections] = useState<Projection[]>([]);
  const [yearsToGoal, setYearsToGoal] = useState<number | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isEditingInsights, setIsEditingInsights] = useState(false);

  const current = stocks.reduce((sum, stock) => sum + stock.value, 0);
  const progress = insights?.goal ? (current / insights.goal) * 100 : 0;

  useEffect(() => {
    const fetchData = async () => {
      const [stocksRes, insightsRes] = await Promise.all([fetch('/api/stocks'), fetch('/api/insights')]);

      const stocksJson = await stocksRes.json();
      const insightsJson = await insightsRes.json();

      setStocks(stocksJson.stocks || []);
      setInsights(insightsJson);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!insights) return;

    const data: Projection[] = [];
    let portfolio = current;
    let contributions = 0;
    let reachedAt: number | null = null;

    for (let year = 0; year <= MAX_YEARS; year++) {
      const isFirst = year === 0;
      const annualContribution = isFirst ? 0 : insights.monthlyContribution * 12;

      if (!isFirst) {
        const growth = portfolio * insights.growthRate;
        const dividends = portfolio * insights.dividendYield;
        portfolio += annualContribution + growth + dividends;
        contributions += annualContribution;
      }

      const returns = portfolio - current - contributions;
      const totalValue = current + contributions + returns;

      if (reachedAt === null && totalValue >= insights.goal) {
        reachedAt = year;
      }

      data.push({
        year: isFirst ? 'Today' : `${year} yrs`,
        current,
        contributions,
        returns: returns > 0 ? returns : 0
      });

      if (reachedAt !== null) break;
    }

    setProjections(data);
    setYearsToGoal(reachedAt ?? MAX_YEARS);
  }, [insights, current]);

  const handleSaveGoal = async (newGoal: number) => {
    if (!insights) return;

    const updated = { ...insights, goal: newGoal };
    const res = await fetch('/api/insights', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    const json = await res.json();
    setInsights(json);
  };

  const handleSaveInsights = async (updatedFields: Omit<Insights, 'goal'>) => {
    if (!insights) return;

    const updated = { ...insights, ...updatedFields };
    const res = await fetch('/api/insights', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    const json = await res.json();
    setInsights(json);
  };

  return (
    <div className='rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-white shadow-md'>
      {/* Portfolio Goal */}
      <div className='mb-6'>
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Portfolio Goal</h2>
          <button onClick={() => setIsEditingGoal(true)} className='text-sm text-purple-300 hover:underline'>
            Edit Goal
          </button>
        </div>
        <div className='text-2xl font-bold text-purple-400'>
          ${current.toLocaleString()} / ${insights?.goal.toLocaleString()}
        </div>
        <div className='mt-1 text-sm text-gray-400'>
          You’re aiming to reach this in 🎯 <span className='text-purple-300'>{yearsToGoal} years</span>
        </div>
        <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-700'>
          <div
            className='h-full bg-purple-500 transition-all'
            style={{ width: `${Math.min(progress, 100).toFixed(2)}%` }}
          />
        </div>
      </div>

      {/* Projection Chart */}
      <div className='mb-6'>
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Projections</h2>
        </div>
        <div className='mb-4 text-gray-300'>
          You’ll reach your goal of{' '}
          <span className='font-semibold text-purple-300'>${insights?.goal.toLocaleString()}</span> in approximately{' '}
          <span className='font-semibold text-purple-300'>{yearsToGoal} years</span> 🎯
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
      <div className='mb-4 grid grid-cols-1 gap-4 text-center text-sm text-gray-300 sm:grid-cols-3'>
        <div className='rounded-md bg-neutral-800 p-3'>
          💰 <span className='font-medium'>${insights?.monthlyContribution}</span>
          <div className='text-xs text-gray-400'>Monthly Deposits</div>
        </div>
        <div className='rounded-md bg-neutral-800 p-3'>
          📈 <span className='font-medium'>{((insights?.dividendYield ?? 0) * 100).toFixed(1)}%</span>
          <div className='text-xs text-gray-400'>Dividend Yield</div>
        </div>
        <div className='rounded-md bg-neutral-800 p-3'>
          📊 <span className='font-medium'>{((insights?.growthRate ?? 0) * 100).toFixed(1)}%</span>
          <div className='text-xs text-gray-400'>Portfolio Growth</div>
        </div>
      </div>

      <div className='flex justify-end'>
        <button onClick={() => setIsEditingInsights(true)} className='text-sm text-purple-300 hover:underline'>
          Edit Insights
        </button>
      </div>

      {/* Modals */}
      {isEditingGoal && insights && (
        <EditGoalModal currentGoal={insights.goal} onClose={() => setIsEditingGoal(false)} onSave={handleSaveGoal} />
      )}

      {isEditingInsights && insights && (
        <EditInsightsModal
          insights={{
            monthlyContribution: insights.monthlyContribution,
            growthRate: insights.growthRate,
            dividendYield: insights.dividendYield
          }}
          onClose={() => setIsEditingInsights(false)}
          onSave={handleSaveInsights}
        />
      )}
    </div>
  );
};

export default PortfolioInsights;
