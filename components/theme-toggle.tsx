"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="size-9 shrink-0">
        <Sun className="size-4" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="size-9 shrink-0 transition-colors duration-200"
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-amber-400" />
      ) : (
        <Moon className="size-4 text-slate-700" />
      )}
      <span className="sr-only">
        {theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      </span>
    </Button>
  )
}
