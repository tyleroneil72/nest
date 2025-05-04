'use client';

import { useState } from 'react';
import ExportImportData from './ExportImportData';
import ManageAccount from './ManageAccount';
import SideBar from './SideBar';

export default function SettingsLayoutClient() {
  const [section, setSection] = useState<'manage' | 'export'>('manage');

  return (
    <div className='flex h-screen'>
      <SideBar current={section} setSection={setSection} />
      <main className='flex-1 p-6'>
        {section === 'manage' && <ManageAccount />}
        {section === 'export' && <ExportImportData />}
      </main>
    </div>
  );
}
