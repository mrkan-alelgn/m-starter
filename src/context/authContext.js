import { createContext } from "react";

/**
 * @typedef {import('../api/auth.js').AuthUser} AuthUser
 */

/**
 * @typedef {{ id: string; name: string; slug?: string }} Workspace
 */

/**
 * @typedef {{
 *   user: AuthUser
 *   accessToken: string
 *   workspaces: Workspace[]
 *   activeWorkspaceId: string | null
 * }} Session
 */

/**
 * @typedef {{
 *   session: Session | null
 *   activeWorkspace: Workspace | null
 *   signIn: (data: { user: AuthUser; accessToken: string; workspaces?: Workspace[]; activeWorkspaceId?: string | null }) => void
 *   signOut: () => void
 *   setActiveWorkspace: (workspaceId: string) => void
 * }} AuthContextValue
 */

/** @type {React.Context<AuthContextValue | null>} */
export const AuthContext = createContext(null);
