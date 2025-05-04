export default function ExportImportData() {
  return (
    <div>
      <h1 className='mb-6 text-2xl font-semibold'>Export / Import Data</h1>
      <div className='flex flex-col gap-4'>
        <button className='rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600'>Export My Data</button>
        <button className='rounded bg-gray-200 px-4 py-2 text-black hover:bg-gray-300'>Import Data</button>
      </div>
    </div>
  );
}
