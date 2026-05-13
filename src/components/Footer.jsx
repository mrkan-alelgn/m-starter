export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200/80 bg-white/80 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500">
          © {year} m-starter. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
