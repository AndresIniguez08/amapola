const CATEGORIES = [
  { value: 'todo', label: 'Todo' },
  { value: 'Medialunas', label: 'Medialunas' },
  { value: 'Panes', label: 'Panes' },
  { value: 'Budines', label: 'Budines' },
  { value: 'Snacks', label: 'Snacks' },
]

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            active === cat.value
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-text-secondary hover:bg-primary-light hover:text-primary border border-border'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
