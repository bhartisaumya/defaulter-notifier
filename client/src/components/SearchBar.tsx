
export default function SearchBar(props: any) {
    const {searchTerm, setSearchTerm} = props 
  return (
    <div className="mb-6">
        <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
  )
}
