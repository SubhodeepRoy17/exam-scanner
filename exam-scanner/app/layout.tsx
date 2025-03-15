import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ExamScan - Document Scanner for Exam Results",
  description: "Scan exam results and convert them to CSV files with ease",
  keywords: "exam scanner, OCR, document scanning, CSV export, exam results",
  authors: [{ name: "ExamScan" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Ocean background with improved z-index handling */}
          <div className="fixed inset-0 z-[-1]">
            <div className="ocean-bg">
              <div className="wave wave1"></div>
              <div className="wave wave2"></div>
              <div className="wave wave3"></div>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-0 flex min-h-screen flex-col">{children}</div>

          {/* Toaster for notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'