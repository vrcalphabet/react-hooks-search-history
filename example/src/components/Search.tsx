import { useRef, useState } from 'react'
import { useSearchHistory } from 'react-hooks-search-history'
import { SearchIcon, XIcon } from 'lucide-react'

export function Search() {
  const { history, addQuery, removeQuery, clearHistory } = useSearchHistory({
    key: 'rhsh-search',
  })
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submitHandler = (e: React.SubmitEvent) => {
    e.preventDefault()
    addQuery(value)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={submitHandler} className="relative mt-10">
      <input
        type="text"
        className="peer w-80 rounded-sm border px-2 py-1 pr-8 select-none"
        placeholder="Search..."
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
      />
      <button
        type="submit"
        className="absolute top-0 right-0 mr-1 flex h-full cursor-pointer items-center px-1 text-gray-400 hover:text-black"
        onMouseDown={(e) => e.preventDefault()}
      >
        <SearchIcon size={16} />
      </button>
      {history.length > 0 && (
        <div
          className="bg-white z-1 absolute top-full mt-1 w-full origin-top scale-y-0 overflow-hidden rounded-sm border border-gray-400 opacity-0 shadow-sm transition-[opacity,scale] peer-focus:scale-y-100 peer-focus:opacity-100"
          onMouseDown={(e) => e.preventDefault()}
        >
          {history.map((query) => (
            <div
              key={query}
              className="peer flex cursor-pointer items-center justify-between py-1 pl-2 transition-colors hover:bg-gray-100"
              onClick={() => setValue(query)}
            >
              <span className="line-clamp-2 text-black">
                {query}
              </span>
              <div
                className="mr-1 p-1 text-gray-400 transition-colors hover:text-black"
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
