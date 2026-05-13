import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

/** @param {{ className?: string }} [props] */
export function WorkspaceSwitcher({ className = "" }) {
  const { session, activeWorkspace, setActiveWorkspace } = useAuth();
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

  const { workspaces } = session;
  const label = activeWorkspace?.name ?? "Workspace";

  if (workspaces.length === 0) {
    return (
      <span
        className={[
          "block truncate rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-500",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        No workspaces
      </span>
    );
  }

  return (
    <div
      className={[
        "relative min-w-0 max-w-[min(100%,14rem)] sm:max-w-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      ref={wrapRef}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full max-w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-xs font-semibold uppercase text-indigo-800">
          {label.slice(0, 2)}
        </span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label="Workspaces"
          className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-zinc-200/90 bg-white py-1 shadow-lg ring-1 ring-black/5 sm:left-0 sm:right-auto sm:min-w-[16rem]"
        >
          {workspaces.map((w) => {
            const selected = w.id === session.activeWorkspaceId;
            return (
              <li key={w.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none ${
                    selected
                      ? "bg-zinc-50 font-medium text-zinc-900"
                      : "text-zinc-700"
                  }`}
                  onClick={() => {
                    setActiveWorkspace(w.id);
                    setOpen(false);
                  }}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[10px] font-semibold uppercase text-zinc-700">
                    {w.name.slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{w.name}</span>
                  {selected ? (
                    <svg
                      className="h-4 w-4 shrink-0 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
