import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'

function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export default function SearchBar({ value, onChange }) {
  const [local, setLocal] = useState(value)

  const debouncedChange = useCallback(
    debounce((v) => onChange(v), 300),
    [onChange],
  )

  function handleChange(e) {
    setLocal(e.target.value)
    debouncedChange(e.target.value)
  }

  function clear() {
    setLocal('')
    onChange('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        type="search"
        value={local}
        onChange={handleChange}
        placeholder="Buscar productos..."
        className="w-full pl-9 pr-9 py-2.5 text-sm bg-surface border border-border rounded-btn text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      {local && (
        <button
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-text-muted hover:text-text-primary transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
