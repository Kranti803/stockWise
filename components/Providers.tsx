"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import React from "react"
import { ReactQueryProvider } from "./ReactQueryProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    // </ThemeProvider>
  )
}
