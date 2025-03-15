import Link from "next/link"
import { ArrowRight, Camera, FileSpreadsheet, Pencil, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TutorialPage() {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="mb-2 text-3xl font-bold">How to Use ExamScan</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Follow this step-by-step guide to scan and process exam results efficiently.
      </p>

      <Tabs defaultValue="scanning" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="editing">Editing</TabsTrigger>
          <TabsTrigger value="exporting">Exporting</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
        </TabsList>

        <TabsContent value="scanning" className="mt-6">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Document Scanning</h2>
                <p className="mb-4 text-muted-foreground">
                  Learn how to properly scan exam result documents for the best accuracy.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Good Lighting</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure the document is well-lit without shadows or glare.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Flat Surface</p>
                      <p className="text-sm text-muted-foreground">
                        Place the document on a flat surface to avoid distortion.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Frame the Document</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure the entire document is visible in the camera frame.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Hold Steady</p>
                      <p className="text-sm text-muted-foreground">Keep your device steady when capturing the image.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="Document scanning example"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-medium">Scanning Process</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Open the scanner page</li>
                      <li>Position the document within the frame</li>
                      <li>Ensure good lighting and a steady hand</li>
                      <li>Tap the capture button</li>
                      <li>Review the captured image</li>
                      <li>Process the document</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="gradient-btn action-btn" asChild>
                <Link href="/scan">
                  Try Scanning Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editing" className="mt-6">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Editing Extracted Data</h2>
                <p className="mb-4 text-muted-foreground">
                  After scanning, you can review and edit the extracted data to ensure accuracy.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Review All Fields</p>
                      <p className="text-sm text-muted-foreground">
                        Check each field for accuracy, especially numeric values.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Edit Inline</p>
                      <p className="text-sm text-muted-foreground">
                        Click the Edit button to make changes directly in the table.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Add Missing Rows</p>
                      <p className="text-sm text-muted-foreground">
                        Use the Add Row button to include any missing student records.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Save Changes</p>
                      <p className="text-sm text-muted-foreground">
                        Don't forget to save your changes before exporting.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="Data editing example"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-medium">Editing Tools</h3>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Pencil className="h-4 w-4 text-primary" />
                        <span>Edit button - Enables editing mode</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span>Tab key - Navigate between cells</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-primary" />
                        <span>Export - Save your data as CSV</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exporting" className="mt-6">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Exporting to CSV</h2>
                <p className="mb-4 text-muted-foreground">
                  Learn how to export your data to CSV format for use in spreadsheet applications.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Create New File</p>
                      <p className="text-sm text-muted-foreground">Export to a new CSV file with a custom filename.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Append to Existing</p>
                      <p className="text-sm text-muted-foreground">
                        Add new records to an existing CSV file for batch processing.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Compatible Format</p>
                      <p className="text-sm text-muted-foreground">
                        CSV files can be opened in Excel, Google Sheets, and other applications.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="CSV export example"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-medium">Export Options</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>When exporting to CSV, you have two main options:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Create a new CSV file with the current data</li>
                        <li>Append the current data to an existing CSV file</li>
                      </ol>
                      <p className="mt-4">
                        Appending is useful when processing multiple exam papers for the same class or semester.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
          <div className="space-y-8">
            <h2 className="mb-4 text-2xl font-bold">Tips & Best Practices</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Scanning Tips</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Use the rear camera for better quality</li>
                    <li>Scan in landscape mode for wider documents</li>
                    <li>Avoid shadows across the document</li>
                    <li>Keep the document flat and unwrinkled</li>
                    <li>Ensure text is clearly visible and in focus</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Data Management</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Create consistent naming conventions</li>
                    <li>Organize files by semester or subject</li>
                    <li>Back up your CSV files regularly</li>
                    <li>Review data before finalizing</li>
                    <li>Use batch scanning for multiple documents</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Working with CSV</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Open CSV files in Excel or Google Sheets</li>
                    <li>Use filters to analyze student performance</li>
                    <li>Create charts and graphs from the data</li>
                    <li>Sort by columns to rank students</li>
                    <li>Calculate averages and other statistics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-muted p-6">
              <h3 className="mb-4 text-xl font-medium">Keyboard Shortcuts</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-md bg-background p-3">
                  <span className="text-sm font-medium">Edit Mode</span>
                  <kbd className="rounded bg-muted px-2 py-1 text-xs">E</kbd>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background p-3">
                  <span className="text-sm font-medium">Save Changes</span>
                  <kbd className="rounded bg-muted px-2 py-1 text-xs">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background p-3">
                  <span className="text-sm font-medium">Export CSV</span>
                  <kbd className="rounded bg-muted px-2 py-1 text-xs">Ctrl+E</kbd>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background p-3">
                  <span className="text-sm font-medium">Add Row</span>
                  <kbd className="rounded bg-muted px-2 py-1 text-xs">Ctrl+Enter</kbd>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background p-3">
                  <span className="text-sm font-medium">Next Cell</span>
                  <kbd className="rounded bg-muted px-2 py-1 text-xs">Tab</kbd>
                </div>
                <div className="flex items-center justify-between rounded-md bg-background p-3">
                  <span className="text-sm font-medium">Previous Cell</span>
                  <kbd className="rounded bg-muted px-2 py-1 text-xs">Shift+Tab</kbd>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex justify-center">
        <Button size="lg" className="gradient-btn action-btn" asChild>
          <Link href="/scan">
            Start Using ExamScan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

