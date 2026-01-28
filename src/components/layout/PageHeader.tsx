export default function PageHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-gray-200 bg-white shadow-sm shadow-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-semibold text-xl text-gray-800 leading-tight">{title}</h1>
      </div>
    </div>
  );
}
