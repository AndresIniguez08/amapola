export default function CategoryFilter({ active, onChange, categories = [] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
      <button
        onClick={() => onChange('todo')}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          active === 'todo'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-surface text-text-secondary hover:bg-primary-light hover:text-primary border border-border'
        }`}
      >
        Todo
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.name)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            active === cat.name
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-text-secondary hover:bg-primary-light hover:text-primary border border-border'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
