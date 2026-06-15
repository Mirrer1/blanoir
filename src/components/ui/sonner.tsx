'use client'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-center"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
          error:
            '!border-red-200 !bg-red-50 !text-red-900 dark:!border-red-900/50 dark:!bg-red-950/60 dark:!text-red-200',
          success:
            '!border-green-200 !bg-green-50 !text-green-900 dark:!border-green-900/50 dark:!bg-green-950/60 dark:!text-green-200',
          warning:
            '!border-amber-200 !bg-amber-50 !text-amber-900 dark:!border-amber-900/50 dark:!bg-amber-950/60 dark:!text-amber-200',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
