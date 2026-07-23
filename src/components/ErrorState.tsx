import { RefreshCw, WifiOff } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

/**
 * Friendly full-width error panel shown when the catalog request fails.
 * Instead of crashing, the app explains what went wrong and offers a
 * "try again" button that re-triggers the fetch.
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
        <WifiOff className="h-7 w-7 text-rose-500" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">Что-то пошло не так</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        <RefreshCw className="h-4 w-4" />
        Повторить попытку
      </button>
    </div>
  )
}
