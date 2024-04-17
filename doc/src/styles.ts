import { twMerge } from "tailwind-merge"

export const button = (...classNames: string[]) =>
  twMerge(
    "py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm",
    "hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800",
    ...classNames
  )

export const checkbox = (...classNames: string[]) =>
  twMerge("rounded border-slate-300 shadow-sm text-slate-700 focus:ring-slate-500", ...classNames)

export const input = (...classNames: string[]) =>
  twMerge(
    "block w-full border-slate-300 px-2.5 py-1.5 rounded-md text-sm focus:border-slate-500 focus:ring-slate-500",
    ...classNames
  )
