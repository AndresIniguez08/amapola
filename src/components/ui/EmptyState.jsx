import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-text-secondary text-sm mb-6">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
