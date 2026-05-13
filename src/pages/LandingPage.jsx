import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle, fetchWorkspaces, AuthApiError } from '../api/index.js'
import { useAuth } from '../hooks/useAuth.js'
import { GoogleSignInButton } from '../components/GoogleSignInButton.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md border shadow-lg backdrop-blur-sm sm:p-2">
        <CardHeader className="text-center">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Continue with your Google account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-stretch pt-2">
          <GoogleSignInButton
            loading={status === 'loading'}
            onClick={handleGoogleSignIn}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  )
}
