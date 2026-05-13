import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithGoogle,
  fetchWorkspaces,
  AuthApiError,
} from "../api/index.js";
import { useAuth } from "../hooks/useAuth.js";
import { GoogleSignInButton } from "../components/GoogleSignInButton.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LandingPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session != null) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  async function handleGoogleSignIn() {
    setError(null);
    setStatus("loading");
    try {
      const result = await signInWithGoogle();
      let workspaces = Array.isArray(result.workspaces)
        ? result.workspaces
        : [];
      if (workspaces.length === 0) {
        try {
          const { workspaces: list } = await fetchWorkspaces(
            result.accessToken,
          );
          workspaces = list;
        } catch {
          workspaces = [];
        }
      }
      signIn({
        user: result.user,
        accessToken: result.accessToken,
        workspaces,
      });
    } catch (e) {
      const message =
        e instanceof AuthApiError
          ? e.message
          : "Something went wrong. Try again.";
      setError(message);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-sm gap-6 border py-8 shadow-lg backdrop-blur-sm sm:gap-8 sm:py-10 px-6 rounded-4xl">
        <CardHeader className="text-center gap-2 sm:gap-3">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Continue with your Google account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-stretch gap-4 pb-4 pt-0">
          <GoogleSignInButton
            loading={status === "loading"}
            onClick={handleGoogleSignIn}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
