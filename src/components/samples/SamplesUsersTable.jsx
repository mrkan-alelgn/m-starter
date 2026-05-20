import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { useSamplesUsers } from '@/hooks/useSamplesUsers.js'
import { SAMPLES_USERS_PAGE_SIZES } from '@/lib/samplesUsersParams.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** @typedef {import('../../mocks/samplesUsers.fixtures.js').SampleUser} SampleUser */

const STATUS_STYLES = {
  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-500/10 text-amber-800 dark:text-amber-400',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function SortIcon({ active, order }) {
  if (!active) return <ArrowUpDownIcon className="size-3.5 opacity-40" />
  return order === 'asc' ? (
    <ArrowUpIcon className="size-3.5" />
  ) : (
    <ArrowDownIcon className="size-3.5" />
  )
}

export function SamplesUsersTable() {
  const { params, data, loading, error, updateParams, apiQueryString } = useSamplesUsers()
  const [searchInput, setSearchInput] = useState(params.q)

  useEffect(() => {
    setSearchInput(params.q)
  }, [params.q])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (searchInput !== params.q) {
        updateParams({ q: searchInput })
      }
    }, 300)
    return () => window.clearTimeout(id)
  }, [searchInput, params.q, updateParams])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = String(getValue())
          return (
            <span
              className={cn(
                'inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize',
                STATUS_STYLES[/** @type {keyof typeof STATUS_STYLES} */ (status)] ??
                  STATUS_STYLES.inactive,
              )}
            >
              {status}
            </span>
          )
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ getValue }) => (
          <span className="capitalize text-foreground">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ getValue }) => formatDate(String(getValue())),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: data?.totalPages ?? 0,
    state: {
      pagination: {
        pageIndex: (data?.page ?? params.page) - 1,
        pageSize: data?.pageSize ?? params.pageSize,
      },
      sorting: [{ id: params.sort, desc: params.order === 'desc' }],
    },
  })

  function toggleSort(columnId) {
    if (params.sort === columnId) {
      updateParams({ sort: /** @type {typeof params.sort} */ (columnId), order: params.order === 'asc' ? 'desc' : 'asc' })
    } else {
      updateParams({ sort: /** @type {typeof params.sort} */ (columnId), order: 'asc' })
    }
  }

  const pageIndex = (data?.page ?? params.page) - 1
  const pageCount = data?.totalPages ?? 1
  const total = data?.total ?? 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters & sorting</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Table state is mirrored in the URL and sent to{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              GET /api/samples/users
            </code>
            . The mock backend applies search, filters, sort, and pagination server-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="samples-search">Search</Label>
            <Input
              id="samples-search"
              placeholder="Name, email, or department…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="samples-status">Status</Label>
            <Select
              value={params.status || 'all'}
              onValueChange={(value) =>
                updateParams({ status: value === 'all' ? '' : value })
              }
            >
              <SelectTrigger id="samples-status" className="w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="samples-role">Role</Label>
            <Select
              value={params.role || 'all'}
              onValueChange={(value) =>
                updateParams({ role: value === 'all' ? '' : value })
              }
            >
              <SelectTrigger id="samples-role" className="w-full">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-muted/40">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort() !== false
                    const columnId = header.column.id
                    const isActive = params.sort === columnId
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                      >
                        {canSort ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 hover:text-foreground"
                            onClick={() => toggleSort(columnId)}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <SortIcon active={isActive} order={params.order} />
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-destructive"
                  >
                    {error}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/70 last:border-0 hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {loading
              ? 'Fetching…'
              : `Showing ${total === 0 ? 0 : pageIndex * params.pageSize + 1}–${Math.min((pageIndex + 1) * params.pageSize, total)} of ${total}`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor="samples-page-size" className="sr-only">
              Rows per page
            </Label>
            <Select
              value={String(params.pageSize)}
              onValueChange={(value) =>
                updateParams({ pageSize: Number.parseInt(value, 10) })
              }
            >
              <SelectTrigger id="samples-page-size" size="sm" className="w-[5.5rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SAMPLES_USERS_PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={pageIndex <= 0 || loading}
                onClick={() => updateParams({ page: 1 }, { resetPage: false })}
                aria-label="First page"
              >
                <ChevronsLeftIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={pageIndex <= 0 || loading}
                onClick={() =>
                  updateParams({ page: pageIndex }, { resetPage: false })
                }
                aria-label="Previous page"
              >
                <ChevronLeftIcon />
              </Button>
              <span className="min-w-[5rem] px-2 text-center text-xs text-muted-foreground">
                Page {pageIndex + 1} / {pageCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={pageIndex >= pageCount - 1 || loading}
                onClick={() =>
                  updateParams({ page: pageIndex + 2 }, { resetPage: false })
                }
                aria-label="Next page"
              >
                <ChevronRightIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={pageIndex >= pageCount - 1 || loading}
                onClick={() => updateParams({ page: pageCount }, { resetPage: false })}
                aria-label="Last page"
              >
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-xs text-muted-foreground break-all">
        <span className="text-foreground/80">API query: </span>
        {apiQueryString || '(defaults)'}
      </p>
    </div>
  )
}
