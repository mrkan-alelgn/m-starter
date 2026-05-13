import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle, fetchWorkspaces, AuthApiError } from '../api/index.js'
import { useAuth } from '../hooks/useAuth.js'
import { GoogleSignInButton } from '../components/GoogleSignInButton.jsx'

export function LandingPage() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session != null) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, navigate])

  async function handleGoogleSignIn() {
    setError(null)
    setStatus('loading')
    try {
      const result = await signInWithGoogle()
      let workspaces = Array.isArray(result.workspaces) ? result.workspaces : []
      if (workspaces.length === 0) {
        try {
          const { workspaces: list } = await fetchWorkspaces(result.accessToken)
          workspaces = list
        } catch {
          workspaces = []
        }
      }
      signIn({ user: result.user, accessToken: result.accessToken, workspaces })
    } catch (e) {
      const message = e instanceof AuthApiError ? e.message : 'Something went wrong. Try again.'
      setError(message)
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:p-10">
        <p className="text-center text-sm font-medium text-zinc-500">Sign in</p>
        <div className="mt-8 flex flex-col items-stretch">
          <GoogleSignInButton
            loading={status === 'loading'}
            onClick={handleGoogleSignIn}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
