"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Check, Download, FileSpreadsheet, Loader2, Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock templates data
const mockTemplates = [
  { id: "template-001", name: "Standard Exam" },
  { id: "template-002", name: "Multiple Choice Test" },
  { id: "template-003", name: "Practical Assessment" },
  { id: "template-004", name: "Semester Report" },
]

export default function BatchPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<string>("upload")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [batchName, setBatchName] = useState<string>("")
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [processedResults, setProcessedResults] = useState<any[] | null>(null)
  const [showResultsDialog, setShowResultsDialog] = useState<boolean>(false)

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const newFiles = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

        if (newFiles.length === 0) {
          toast({
            title: "Invalid Files",
            description: "Please drop image files only.",
            variant: "destructive",
          })
          return
        }

        setFiles((prev) => [...prev, ...newFiles])

        // Create preview URLs
        const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
        setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
      }
    },
    [toast],
  )

  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  // Remove file
  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])

    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  // Process batch
  const processBatch = async () => {
    if (files.length === 0 || !selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please select files and a template before processing.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Simulate processing with progress updates
      const totalFiles = files.length
      const mockResults: any[] = []

      for (let i = 0; i < totalFiles; i++) {
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update progress
        const progress = Math.round(((i + 1) / totalFiles) * 100)
        setProcessingProgress(progress)

        // Create mock result for this file
        mockResults.push({
          filename: files[i].name,
          status: Math.random() > 0.1 ? "success" : "error", // 10% chance of error
          data: {
            id: `S${(i + 1).toString().padStart(3, "0")}`,
            name: `Student ${i + 1}`,
            subject: "Mathematics",
            marks: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
          },
        })
      }

      // Set processed results
      setProcessedResults(mockResults)

      // Show success message
      toast({
        title: "Batch Processing Complete",
        description: `Successfully processed ${mockResults.filter((r) => r.status === "success").length} out of ${totalFiles} files.`,
      })

      // Show results dialog
      setShowResultsDialog(true)
    } catch (error) {
      console.error("Error processing batch:", error)
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the batch.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Export results to CSV
  const exportToCSV = () => {
    if (!processedResults) return

    // Get successful results
    const successfulResults = processedResults.filter((r) => r.status === "success")

    if (successfulResults.length === 0) {
      toast({
        title: "No Valid Results",
        description: "There are no valid results to export.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = Object.keys(successfulResults[0].data).join(",")
    const rows = successfulResults.map((result) => Object.values(result.data).join(",")).join("\n")
    const csvContent = `${headers}\n${rows}`

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${batchName || "batch_results"}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV Exported",
      description: `${batchName || "batch_results"}.csv has been downloaded.`,
    })
  }

  // Reset batch
  const resetBatch = () => {
    // Revoke all object URLs to avoid memory leaks
    previewUrls.forEach((url) => URL.revokeObjectURL(url))

    setFiles([])
    setPreviewUrls([])
    setProcessedResults(null)
    setProcessingProgress(0)
    setBatchName("")
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Batch Processing</h1>
      </div>

      <p className="mb-6 text-muted-foreground">
        Process multiple exam result documents at once and export them to a single CSV file.
      </p>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch Name</Label>
          <Input
            id="batch-name"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="e.g., Math Midterm Results"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">CSV Template</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {mockTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="camera">Use Camera</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Upload multiple exam result documents to process them in batch.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Upload Images</h3>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                  <p className="text-xs text-muted-foreground">Supports: JPG, PNG, HEIC, PDF</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-medium">Selected Files ({files.length})</h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="p-2 text-xs truncate">{files[index].name}</div>
                      </div>
                    ))}

                    <div
                      className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground mt-2">Add More</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetBatch} disabled={files.length === 0 || isProcessing}>
                Clear All
              </Button>
              <Button
                onClick={processBatch}
                disabled={files.length === 0 || !selectedTemplate || isProcessing}
                className={isProcessing ? "" : "gradient-btn"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing... ({processingProgress}%)
                  </>
                ) : (
                  <>
                    Process Batch
                    <FileSpreadsheet className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {isProcessing && (
            <div className="mt-4">
              <Progress value={processingProgress} className="h-2" />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Processing file {Math.ceil((processingProgress / 100) * files.length)} of {files.length}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="camera" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Camera Capture</CardTitle>
              <CardDescription>Use your camera to capture multiple documents in sequence.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Camera className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-lg font-medium">Camera Batch Mode</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  This feature allows you to capture multiple documents in sequence using your device camera.
                </p>
                <Button className="mt-4 gradient-btn action-btn">Start Camera Capture</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Batch Processing Results</DialogTitle>
            <DialogDescription>Review the results of your batch processing.</DialogDescription>
          </DialogHeader>

          {processedResults && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Successfully processed {processedResults.filter((r) => r.status === "success").length} out of{" "}
                    {processedResults.length} files.
                  </p>
                </div>
                <Button onClick={exportToCSV} className="gradient-btn">
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs truncate max-w-[150px]">{result.filename}</TableCell>
                        <TableCell>
                          <Badge variant={result.status === "success" ? "default" : "destructive"}>
                            {result.status === "success" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : (
                              <X className="mr-1 h-3 w-3" />
                            )}
                            {result.status}
                          </Badge>
                        </TableCell>
                        {result.status === "success" ? (
                          <>
                            <TableCell>{result.data.id}</TableCell>
                            <TableCell>{result.data.name}</TableCell>
                            <TableCell>{result.data.subject}</TableCell>
                            <TableCell>{result.data.marks}</TableCell>
                          </>
                        ) : (
                          <TableCell colSpan={4} className="text-muted-foreground">
                            Failed to extract data
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Batch Processing Tips</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Image Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Ensure good lighting for all documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Avoid shadows and glare on the paper</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Capture the entire document in frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Use high resolution for better accuracy</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Document Format</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Use consistent document formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Ensure text is clear and legible</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Tables should have clear borders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Match document layout to selected template</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Select the appropriate template</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Review results before exporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Process similar documents in one batch</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span>Use meaningful batch names for organization</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

