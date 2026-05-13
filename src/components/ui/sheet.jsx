import { cva } from 'class-variance-authority'
import { Dialog } from 'radix-ui'

import { cn } from '@/lib/utils'

function Sheet(props) {
  return <Dialog.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ asChild = false, ...props }) {
  return (
    <Dialog.Trigger data-slot="sheet-trigger" asChild={asChild} {...props} />
  )
}

function SheetClose({ asChild = false, ...props }) {
  return <Dialog.Close data-slot="sheet-close" asChild={asChild} {...props} />
}

function SheetPortal({ ...props }) {
  return <Dialog.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }) {
  return (
    <Dialog.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

const sheetVariants = cva(
  'fixed z-50 flex min-h-0 flex-col gap-0 bg-background shadow-lg ring-1 ring-foreground/10 outline-none transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=closed]:duration-300',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

function SheetContent({ side = 'right', className, children, ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        data-slot="sheet-content"
        aria-describedby={undefined}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
      </Dialog.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
