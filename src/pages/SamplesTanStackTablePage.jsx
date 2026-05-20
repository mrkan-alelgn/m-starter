import { SamplesUsersTable } from '../components/samples/SamplesUsersTable.jsx'

export function SamplesTanStackTablePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Samples
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          TanStack Table
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Server-driven sorting, filtering, and pagination. Change controls below and watch the
          URL query string update — each change refetches from the mock API.
        </p>
      </div>
      <SamplesUsersTable />
    </div>
  )
}
