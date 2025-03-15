"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add a useEffect to initialize theme based on system preference or saved preference
  React.useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Get the saved theme from localStorage
      const savedTheme = localStorage.getItem("theme")

      if (savedTheme) {
        // Apply the saved theme
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else if (savedTheme === "light") {
          document.documentElement.classList.remove("dark")
        }
      } else {
        // Apply system preference if no saved theme
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (prefersDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

