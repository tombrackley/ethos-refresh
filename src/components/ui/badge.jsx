import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        "status-published":
          "rounded-md border-gray-200 bg-lime-50 text-gray-700 h-6 px-1.5 gap-1",
        "status-draft":
          "rounded-md border-gray-200 bg-gray-50 text-gray-700 h-6 px-1.5 gap-1",
        "content-handbook":
          "rounded-md border-teal-200 bg-teal-50 text-teal-800 h-6 px-1.5 gap-1",
        "content-guide":
          "rounded-md border-blue-200 bg-blue-50 text-blue-800 h-6 px-1.5 gap-1",
        "content-framework":
          "rounded-md border-purple-200 bg-purple-50 text-purple-800 h-6 px-1.5 gap-1",
        "content-course":
          "rounded-md border-amber-200 bg-amber-50 text-amber-800 h-6 px-1.5 gap-1",
        "content-external":
          "rounded-md border-gray-200 bg-gray-50 text-gray-700 h-6 px-1.5 gap-1",
        "content-external-link":
          "rounded-md border-blue-200 bg-blue-50 text-blue-800 h-6 px-1.5 gap-1",
        "content-pdf":
          "rounded-md border-red-200 bg-red-50 text-red-800 h-6 px-1.5 gap-1",
        "content-video":
          "rounded-md border-purple-200 bg-purple-50 text-purple-800 h-6 px-1.5 gap-1",
        "content-document":
          "rounded-md border-amber-200 bg-amber-50 text-amber-800 h-6 px-1.5 gap-1",
        cpd:
          "rounded-md border-gray-200 bg-white text-gray-500 h-6 px-1.5 gap-1",
        "skill-proficient":
          "rounded-md border-lime-200 bg-lime-50 text-lime-900 h-6 px-1.5 gap-1",
        "skill-developing":
          "rounded-md border-blue-200 bg-blue-50 text-blue-700 h-6 px-1.5 gap-1",
        "skill-gap":
          "rounded-md border-gray-200 bg-gray-50 text-gray-700 h-6 px-1.5 gap-1",
        "importance-critical":
          "rounded-md border-red-200 bg-red-50 text-red-700 h-6 px-1.5 gap-1",
        "importance-high":
          "rounded-md border-amber-200 bg-amber-50 text-amber-700 h-6 px-1.5 gap-1",
        "importance-medium":
          "rounded-md border-blue-200 bg-blue-50 text-blue-700 h-6 px-1.5 gap-1",
        "type-certification":
          "rounded-md border-lime-200 bg-lime-50 text-lime-900 h-5 px-1.5 gap-1",
        "type-completion":
          "rounded-md border-blue-200 bg-blue-50 text-blue-700 h-5 px-1.5 gap-1",
        "type-milestone":
          "rounded-md border-amber-200 bg-amber-50 text-amber-700 h-5 px-1.5 gap-1",
        category:
          "rounded bg-gray-100 text-gray-700/80 px-2 gap-1 text-xs font-medium leading-5",
        "category-teal":
          "rounded-[6px] bg-teal-50 text-teal-900 h-6 px-2 gap-1",
        "category-blue":
          "rounded-[6px] bg-blue-50 text-blue-900 h-6 px-2 gap-1",
        "category-purple":
          "rounded-[6px] bg-purple-50 text-purple-900 h-6 px-2 gap-1",
        "category-amber":
          "rounded-[6px] bg-amber-50 text-amber-900 h-6 px-2 gap-1",
        "category-cyan":
          "rounded-[6px] bg-cyan-50 text-cyan-900 h-6 px-2 gap-1",
        "category-rose":
          "rounded-[6px] bg-rose-50 text-rose-900 h-6 px-2 gap-1",
        "category-indigo":
          "rounded-[6px] bg-indigo-50 text-indigo-900 h-6 px-2 gap-1",
        "category-orange":
          "rounded-[6px] bg-orange-50 text-orange-900 h-6 px-2 gap-1",
        "status-booked":
          "rounded-md border-emerald-200 bg-emerald-50 text-emerald-800 h-6 px-1.5 gap-1",
        "status-attending":
          "rounded-md border-emerald-200 bg-emerald-50 text-emerald-800 h-6 px-1.5 gap-1",
        "status-waitlist":
          "rounded-md border-red-200 bg-red-50 text-red-700 h-6 px-1.5 gap-1",
        "status-waitlisted":
          "rounded-md border-amber-200 bg-amber-50 text-amber-700 h-6 px-1.5 gap-1",
        "status-suggested":
          "rounded-md border-indigo-200 bg-indigo-50 text-indigo-700 h-6 px-1.5 gap-1",
        "status-rsvp":
          "rounded-md border-gray-200 bg-white text-gray-700 h-6 px-1.5 gap-1",
        "status-certified":
          "rounded-md border-brand-200 bg-brand-50 text-brand-700 h-6 px-1.5 gap-1",
        "status-complete":
          "rounded-md border-emerald-200 bg-emerald-50 text-emerald-800 h-6 px-1.5 gap-1",
        points:
          "rounded-md border-gray-200 bg-gray-50 text-gray-700 h-6 px-1.5 gap-1",
        "content-regulatory":
          "rounded-md border-blue-200 bg-blue-50 text-blue-700 h-6 px-1.5 gap-1",
        "content-enforcement":
          "rounded-md border-red-200 bg-red-50 text-red-700 h-6 px-1.5 gap-1",
        "content-news":
          "rounded-md border-slate-200 bg-slate-50 text-slate-700 h-6 px-1.5 gap-1",
        "content-articles":
          "rounded-md border-violet-200 bg-violet-50 text-violet-700 h-6 px-1.5 gap-1",
        "content-podcasts":
          "rounded-md border-orange-200 bg-orange-50 text-orange-700 h-6 px-1.5 gap-1",
        "content-webinars":
          "rounded-md border-emerald-200 bg-emerald-50 text-emerald-700 h-6 px-1.5 gap-1",
        "priority-critical":
          "rounded-md border-red-200 bg-red-100 text-red-700 h-6 px-1.5 gap-1",
        "priority-high":
          "rounded-md border-amber-200 bg-amber-100 text-amber-700 h-6 px-1.5 gap-1",
        "urgency-high":
          "rounded-md bg-red-100 text-red-700 h-6 px-1.5 gap-1",
        "urgency-elevated":
          "rounded-md bg-amber-100 text-amber-700 h-6 px-1.5 gap-1",
        "urgency-medium":
          "rounded-md bg-yellow-100 text-yellow-700 h-6 px-1.5 gap-1",
        "urgency-low":
          "rounded-md bg-slate-100 text-slate-600 h-6 px-1.5 gap-1",
        "resource-policy":
          "rounded-md border-brand-200 bg-brand-50 text-brand-800 h-6 px-1.5 gap-1",
        "resource-template":
          "rounded-md border-violet-200 bg-violet-50 text-violet-800 h-6 px-1.5 gap-1",
        "resource-playbook":
          "rounded-md border-orange-200 bg-orange-50 text-orange-800 h-6 px-1.5 gap-1",
        "resource-article":
          "rounded-md border-cyan-200 bg-cyan-50 text-cyan-800 h-6 px-1.5 gap-1",
        "resource-legislation":
          "rounded-md border-slate-200 bg-slate-100 text-slate-800 h-6 px-1.5 gap-1",
        "resource-guide":
          "rounded-md border-blue-200 bg-blue-50 text-blue-800 h-6 px-1.5 gap-1",
        "resource-approved":
          "rounded-md border-emerald-200 bg-emerald-50 text-emerald-800 h-6 px-1.5 gap-1",
        "resource-draft":
          "rounded-md border-gray-200 bg-gray-50 text-gray-600 h-6 px-1.5 gap-1",
        "resource-under-review":
          "rounded-md border-amber-200 bg-amber-50 text-amber-700 h-6 px-1.5 gap-1",
        "classification-public":
          "rounded-md border-slate-200 bg-slate-50 text-slate-600 h-6 px-1.5 gap-1",
        "classification-internal":
          "rounded-md border-blue-200 bg-blue-50 text-blue-700 h-6 px-1.5 gap-1",
        "classification-confidential":
          "rounded-md border-amber-200 bg-amber-50 text-amber-800 h-6 px-1.5 gap-1",
        "classification-legal-privilege":
          "rounded-md border-purple-200 bg-purple-50 text-purple-800 h-6 px-1.5 gap-1",
        "classification-board-confidential":
          "rounded-md border-red-200 bg-red-50 text-red-700 h-6 px-1.5 gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
