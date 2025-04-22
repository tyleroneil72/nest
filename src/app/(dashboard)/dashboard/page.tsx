import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DropdownMenu from './DropdownMenu';
import PortfolioInsights from './components/PortfolioInsights';
import StockTable from './components/StockTable';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='relative min-h-screen bg-neutral-950 px-4 py-6 text-white sm:px-8'>
      {/* Profile Dropdown in Top Right */}
      <DropdownMenu image={session.user?.image || ''} />

      {/* Greeting */}
      <div className='mt-12 mb-8 text-center'>
        <h1 className='text-3xl font-semibold sm:text-4xl'>
          Welcome, <span className='text-indigo-400'>{session.user?.name?.split(' ')[0]}</span>
        </h1>
        <p className='mt-2 text-sm text-gray-400'>Track your progress and plan your financial future with clarity.</p>
      </div>

      {/* Portfolio Insights & Stock Table Section */}
      <div className='mx-auto w-full max-w-screen-lg'>
        <PortfolioInsights />
        <StockTable />
      </div>
    </div>
  );
}
