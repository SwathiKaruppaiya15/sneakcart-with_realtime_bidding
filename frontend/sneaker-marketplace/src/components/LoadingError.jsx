import './LoadingError.css'

export function LoadingSpinner() {
  return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-wrap">
      <p className="error-icon">⚠️</p>
      <p className="error-msg">{message}</p>
      {onRetry && <button className="btn-retry" onClick={onRetry}>Try Again</button>}
    </div>
  )
}
