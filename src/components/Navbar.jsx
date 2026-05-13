import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function AccountMenuTrigger({ open, menuId, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pl-1 pr-2 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:pr-2.5"
      aria-expanded={open}
      aria-haspopup="menu"
      aria-controls={menuId}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 sm:h-9 sm:w-9">
        <svg
          className="h-5 w-5 text-zinc-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </span>
      <svg
        className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 sm:h-5 sm:w-5 ${open ? "rotate-180" : ""}`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (session == null) return null;

  const { user } = session;

  function handleLogout() {
    setOpen(false);
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <span className="hidden truncate text-sm text-zinc-500 lg:inline">
            Dashboard
          </span>
        </div>

        <div className="relative shrink-0" ref={wrapRef}>
          <AccountMenuTrigger
            open={open}
            menuId={menuId}
            onClick={() => setOpen((v) => !v)}
            aria-label="Account menu"
          />

          {open ? (
            <div
              id={menuId}
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-zinc-200/90 bg-white py-1 shadow-lg ring-1 ring-black/5"
            >
              <div className="border-b border-zinc-100 px-3 py-2.5">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
