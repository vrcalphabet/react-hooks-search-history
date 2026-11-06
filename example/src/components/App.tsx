import { Search } from './Search'
import { SearchWithFilter } from './SearchWithFilter'

export function App() {
  return (
    <div className="flex flex-col gap-y-2 text-gray-700">
      <Search />
      <SearchWithFilter />
    </div>
  )
}
