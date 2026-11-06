import { useRef, useState } from 'react'
import { useSearchHistory } from 'react-hooks-search-history'
import { CheckIcon, FilterIcon, SearchIcon, XIcon } from 'lucide-react'
import { cn } from '../utils/cn'
import { preventDefault } from '../utils/events'
import { entries } from '../utils/object'

type QueryValue = {
  value: string
  filter: Filter
}

type Filter = {
  hasLink: boolean
  hasFile: boolean
  hasImage: boolean
  hasVideo: boolean
}

const filterTypes = {
  hasLink: 'has:link',
  hasFile: 'has:file',
  hasImage: 'has:image',
  hasVideo: 'has:video',
}

export function SearchWithFilter() {
  const { history, addQuery, removeQuery, clearHistory } =
    useSearchHistory<QueryValue>({
      key: 'rhsh-search-filter',
    })

  const [value, setValue] = useState('')
  const [filter, setFilter] = useState<Filter>({
    hasLink: false,
    hasFile: false,
    hasImage: false,
    hasVideo: false,
  })
  const [isFilterOpen, setIsFilterOpen] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)

  const setValueFromQuery = (query: QueryValue) => {
    setValue(query.value)
    setFilter(query.filter)
  }

  const submitHandler = (e: React.SubmitEvent) => {
    e.preventDefault()
    addQuery({ value, filter })
    setValue('')
    inputRef.current?.focus()
  }

  const toggleFilter = (key: keyof Filter) => {
    setFilter({ ...filter, [key]: !filter[key] })
  }

  const hasFilter = Object.values(filter).some(Boolean)

  return (
    <form onSubmit={submitHandler} className="relative mt-10">
      <input
        type="text"
        className="peer w-80 rounded-sm border px-2 py-1 pr-8 select-none"
        placeholder="Search with filters..."
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
      />
      <div
        className="absolute top-0 right-0 mr-1 flex h-full items-center text-gray-400 *:h-full *:cursor-pointer *:px-1 *:hover:text-gray-700"
        onMouseDown={preventDefault}
      >
        <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <div
            className={cn(
              'rounded-sm p-1',
              hasFilter && 'bg-gray-300 text-gray-700',
            )}
          >
            <FilterIcon size={16} />
          </div>
        </button>
        <button type="submit">
          <SearchIcon size={16} />
        </button>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute top-0 left-full ml-1 min-w-40 -translate-x-6 overflow-hidden rounded-sm border border-gray-400 opacity-0 shadow-sm transition-[opacity,translate] select-none',
          isFilterOpen &&
            'peer-focus:pointer-events-auto peer-focus:translate-x-0 peer-focus:opacity-100',
        )}
      >
        <div className="flex items-center gap-x-1 px-2 py-1">
          <FilterIcon size={16} />
          Filters:
        </div>
        <div className="text-gray-400" onMouseDown={preventDefault}>
          {entries(filterTypes).map(([key, text]) => (
            <div
              className={cn(
                'flex cursor-pointer items-center justify-between px-2 py-0.5 transition-colors duration-100 hover:bg-gray-100 hover:text-gray-700',
                filter[key] && 'bg-gray-300! text-gray-700',
              )}
              key={key}
              onClick={() => toggleFilter(key)}
            >
              {text}
              {filter[key] && <CheckIcon size={16} />}
            </div>
          ))}
        </div>
      </div>
      {history.length > 0 && (
        <div
          className="absolute top-full mt-1 w-full origin-top scale-y-0 overflow-hidden rounded-sm border border-gray-400 opacity-0 shadow-sm transition-[opacity,scale] peer-focus:scale-y-100 peer-focus:opacity-100"
          onMouseDown={preventDefault}
        >
          {history.map((query) => (
            <div
              key={query.value}
              className="peer flex cursor-pointer items-center justify-between py-1 pl-2 transition-colors hover:bg-gray-100"
              onClick={() => setValueFromQuery(query)}
            >
              <span className="line-clamp-2 wrap-anywhere">
                {query.value}
                <span className="ml-2 space-x-1 gap-x-1 text-sm text-gray-400">
                  {entries(query.filter).map(
                    ([key, value]) =>
                      value && <span key={key}>{filterTypes[key]}</span>,
                  )}
                </span>
              </span>
              <div
                className="mr-1 p-1 text-gray-400 transition-colors hover:text-gray-700"
                onClick={(e) => {
                  removeQuery(query)
                  e.stopPropagation()
                }}
              >
                <XIcon size={16} />
              </div>
            </div>
          ))}
          <div
            className="hidden px-2 py-0.5 text-end peer-[*]:block"
            onClick={clearHistory}
          >
            <span className="cursor-pointer text-sm text-gray-400 hover:underline">
              Clear History
            </span>
          </div>
        </div>
      )}
    </form>
  )
}
