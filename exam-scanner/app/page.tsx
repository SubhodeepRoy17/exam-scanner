import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileSpreadsheet, ScanLine, Waves } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "ExamScan - Document Scanner for Exam Results",
  description: "Scan exam results and convert them to CSV files with ease",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ExamScan</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/history" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              History
            </Link>
            <Link href="/csv-templates" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Templates
            </Link>
            <Link href="/batch" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Batch
            </Link>
            <Link href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <Waves className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Transform Exam Results into <span className="text-primary">Structured Data</span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Scan exam results and automatically generate CSV files. Perfect for exam cells managing semester-wise
              student marks.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gradient-btn action-btn" asChild>
                <Link href="/scan">
                  Start Scanning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="glass-card action-btn" asChild>
                <Link href="/tutorial">View Tutorial</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:grid-cols-3">
            <Card className="glass-card transition-all duration-300 hover:shadow-lg float">
              <CardHeader>
                <CardTitle>Scan Documents</CardTitle>
                <CardDescription>Use your device camera to scan exam results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-20 items-center justify-center rounded-md bg-primary/10">
                  <ScanLine className="h-10 w-10 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/scan">Try Now</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card
              className="glass-card transition-all duration-300 hover:shadow-lg float"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle>Generate CSV</CardTitle>
                <CardDescription>Automatically extract data into CSV format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-20 items-center justify-center rounded-md bg-primary/10">
                  <FileSpreadsheet className="h-10 w-10 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/csv-templates">View Templates</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card
              className="glass-card transition-all duration-300 hover:shadow-lg float"
              style={{ animationDelay: "0.4s" }}
            >
              <CardHeader>
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>Process multiple student results at once</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-20 items-center justify-center rounded-md bg-primary/10">
                  <svg
                    className="h-10 w-10 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2V5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 2V5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 8H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 11H8.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 11H16.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 15H8.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 15H16.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/batch">Try Batch Processing</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">How It Works</h2>
            <p className="max-w-[750px] text-lg text-muted-foreground">
              Our intelligent scanning technology makes it easy to convert paper exam results into digital format.
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Scan Document</h3>
                <p className="text-muted-foreground">Use your device camera to capture the exam result sheet</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Review & Edit</h3>
                <p className="text-muted-foreground">Verify the extracted data and make any necessary corrections</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Export to CSV</h3>
                <p className="text-muted-foreground">Download the data as a CSV file or append to an existing file</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 ExamScan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

