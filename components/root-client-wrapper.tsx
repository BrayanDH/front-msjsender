"use client"

import type React from "react"
import { AuthProvider } from "@/features/auth/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function RootClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}
