import googleIconUrl from '../assets/icons/google.svg'

export function GoogleSignInButton({ loading, disabled, onClick, error }) {
  const busy = loading || disabled

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-zinc-200/90 bg-white px-5 text-sm font-medium text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:pointer-events-none disabled:opacity-55"
      >
        <img src={googleIconUrl} alt="" className="h-5 w-5 shrink-0" width={20} height={20} />
        <span>{loading ? 'Connecting…' : 'Sign in with Google'}</span>
      </button>
      {error ? (
        <p className="text-center text-sm leading-relaxed text-red-600 sm:text-left" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
