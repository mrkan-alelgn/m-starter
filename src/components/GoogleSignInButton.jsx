import googleIconUrl from '../assets/icons/google.svg'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function GoogleSignInButton({ loading, disabled, onClick, error }) {
  const busy = loading || disabled

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-full px-5 shadow-sm"
        onClick={onClick}
        disabled={busy}
      >
        <img src={googleIconUrl} alt="" className="h-5 w-5 shrink-0" width={20} height={20} />
        {loading ? 'Connecting…' : 'Sign in with Google'}
      </Button>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="text-center sm:text-left">{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
