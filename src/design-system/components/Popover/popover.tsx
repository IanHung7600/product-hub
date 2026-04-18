import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { SurfaceHeader, SurfaceBody, SurfaceFooter } from "@/design-system/patterns/overlay-surface/overlay-surface"

/**
 * Popover — Radix Popover + 設計系統 token
 *
 * ── 視覺 ──
 * 與 Dialog 對齊：bg-surface-raised / rounded-lg / border-border / elevation-200。
 * density 永遠鎖 md（non-modal 輕量浮層不隨頁面 density 放大）。
 *
 * ── 結構 ──
 * PopoverContent：外殼（bg / border / radius / shadow / density），無內距。
 * PopoverHeader / PopoverBody / PopoverFooter：消費 overlay-surface pattern
 * 共用的 SurfaceHeader / SurfaceBody / SurfaceFooter primitives(padding SSOT)。
 */

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      data-density="md"
      className={cn(
        "z-50 w-72 rounded-lg border border-border bg-surface-raised text-foreground shadow-[var(--elevation-200)] outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "origin-[var(--radix-popover-content-transform-origin)]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverHeader = SurfaceHeader
const PopoverBody = SurfaceBody
const PopoverFooter = SurfaceFooter

const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-body font-medium truncate", className)}
    {...props}
  />
))
PopoverTitle.displayName = "PopoverTitle"

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverTitle,
}
