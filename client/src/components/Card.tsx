export default function Card({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">Manage {title}</p>
        <button
          className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          onClick={onClick}
        >
          Manage {title}
        </button>
      </div>
    </div>
  );
}
