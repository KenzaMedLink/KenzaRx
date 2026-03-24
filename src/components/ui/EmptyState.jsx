import { Button } from './Button'

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state panel">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  )
}
