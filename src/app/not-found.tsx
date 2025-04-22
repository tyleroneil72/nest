import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function NotFound() {
  const session = await getServerSession(authOptions);
  const backHref = session ? '/dashboard' : '/';
  const backLabel = session ? 'Back to Dashboard' : 'Back to Home';

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6 text-center'>
      <h1 className='text-5xl font-bold'>404</h1>
      <p className='text-muted-foreground mt-2 text-lg'>Oops! The page you were looking for doesn’t exist.</p>
      <Link
        href={backHref}
        className='mt-6 inline-block rounded bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200'
      >
        {backLabel}
      </Link>
    </div>
  );
}
