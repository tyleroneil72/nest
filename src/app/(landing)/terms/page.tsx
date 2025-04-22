'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12 text-sm text-gray-300'>
      <h1 className='mb-6 text-2xl font-semibold text-white'>Terms of Service</h1>

      <p className='mb-4'>
        Welcome to Nest. By using this application, you agree to the following terms and conditions. If you do not
        agree, please do not use the service.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>1. Overview</h2>
      <p className='mb-4'>
        Nest is a portfolio tracking and visualization tool designed for educational and personal use. It allows users
        to manually input their investment data and visualize potential growth over time.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>2. Not Financial Advice</h2>
      <p className='mb-4'>
        Nest does not provide financial, investment, legal, or tax advice. All information and features within the
        application are for informational purposes only and should not be relied upon for financial decisions.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>3. User Data</h2>
      <p className='mb-4'>
        Your data is stored securely and is only accessible to you. Nest does not sell or share your personal
        information. However, you are responsible for the accuracy of any data you input into the application.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>4. Limitation of Liability</h2>
      <p className='mb-4'>
        Nest is provided &quot;as is&quot; without any warranties or guarantees. The developer of Nest shall not be held
        liable for any losses or damages, including financial losses, arising from the use of this application.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>5. Service Availability</h2>
      <p className='mb-4'>
        Nest is an evolving tool and may experience downtime, maintenance, or changes at any time without prior notice.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>6. Modifications</h2>
      <p className='mb-4'>
        These terms may be updated at any time. Continued use of Nest after changes have been made constitutes your
        acceptance of the updated Terms of Service.
      </p>

      <h2 className='mt-6 mb-2 text-lg font-semibold text-white'>7. Contact</h2>
      <p>
        For any questions about these terms, please contact the developer at <code>tyleroneildev@gmail.com</code>.
      </p>

      <div className='mt-10 flex justify-center'>
        <Link
          href='/dashboard'
          className='inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500'
        >
          <FaArrowLeft className='text-xs' />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
