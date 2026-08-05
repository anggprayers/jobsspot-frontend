"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      closeButton
      gap={12}
      visibleToasts={4}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5" />
        ),
        info: (
          <InfoIcon className="size-5" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5" />
        ),
        error: (
          <OctagonXIcon className="size-5" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--width": "360px",
        } as React.CSSProperties
      }
      toastOptions={{
        duration: 4500,
        classNames: {
          toast:
            "cn-toast min-h-18 rounded-xl border px-4 py-4 shadow-lg",
          content: "gap-1.5",
          title: "text-base font-semibold leading-6",
          description:
            "text-sm leading-5 text-muted-foreground",
          icon: "mt-0.5",
          closeButton:
            "border-border bg-background text-foreground hover:bg-muted",
          actionButton:
            "bg-primary text-primary-foreground",
          cancelButton:
            "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
