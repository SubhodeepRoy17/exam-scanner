"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, FileSpreadsheet, Plus, Save, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResultsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [scanResult, setScanResult] = useState<any | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [editedData, setEditedData] = useState<any[]>([])
  const [fileName, setFileName] = useState<string>("exam_results")
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [saveMode, setSaveMode] = useState<"new" | "append">("new")
  const [existingFiles, setExistingFiles] = useState<string[]>([
    "semester1_results.csv",
    "semester2_results.csv",
    "midterm_results.csv",
  ])
  const [selectedFile, setSelectedFile] = useState<string>("")

  // Load scan result from localStorage on mount
  useEffect(() => {
    const savedResult = localStorage.getItem("lastScanResult")
    if (savedResult) {
      const parsed = JSON.parse(savedResult)
      setScanResult(parsed)
      setEditedData(parsed.data || [])
    } else {
      // Fallback demo data if no result is found
      const demoData = {
        title: "Semester 1 Exam Results",
        timestamp: new Date().toISOString(),
        data: [
          { id: "S001", name: "John Smith", subject: "Mathematics", marks: 85 },
          { id: "S002", name: "Emily Johnson", subject: "Mathematics", marks: 92 },
          { id: "S003", name: "Michael Brown", subject: "Mathematics", marks: 78 },
          { id: "S004", name: "Sarah Davis", subject: "Mathematics", marks: 88 },
          { id: "S005", name: "David Wilson", subject: "Mathematics", marks: 76 },
        ],
      }
      setScanResult(demoData)
      setEditedData(demoData.data)
    }
  }, [])

  // Handle cell edit
  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    const updatedData = [...editedData]
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [field]: field === "marks" ? Number.parseInt(value, 10) || 0 : value,
    }
    setEditedData(updatedData)
  }

  // Save changes
  const saveChanges = () => {
    setScanResult({
      ...scanResult,
      data: editedData,
    })
    setEditMode(false)
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved successfully.",
    })
  }

  // Download as CSV
  const downloadCSV = () => {
    if (!scanResult) return

    // Create CSV content
    const headers = Object.keys(editedData[0]).join(",")
    const rows = editedData.map((row) => Object.values(row).join(",")).join("\n")
    const csvContent = `${headers}\n${rows}`

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${fileName}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV Downloaded",
      description: `${fileName}.csv has been downloaded successfully.`,
    })
  }

  // Handle save dialog confirm
  const handleSaveConfirm = () => {
    if (saveMode === "new") {
      downloadCSV()
    } else if (saveMode === "append" && selectedFile) {
      // In a real app, this would append to an existing file
      toast({
        title: "Data Appended",
        description: `Data has been appended to ${selectedFile}`,
      })
    }
    setShowSaveDialog(false)
  }

  // Go back to scanner
  const goBackToScanner = () => {
    router.push("/scan")
  }

  if (!scanResult) {
    return (
      <div className="container py-8 text-center">
        <p>Loading results...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goBackToScanner}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{scanResult.title || "Scan Results"}</h1>
        </div>

        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={saveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button className="gradient-btn">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Data to CSV</DialogTitle>
                    <DialogDescription>Choose how you want to save the extracted data.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="save-mode">Save Mode</Label>
                      <Select value={saveMode} onValueChange={(value: "new" | "append") => setSaveMode(value)}>
                        <SelectTrigger>
                          <SelectValue>
                            {(saveMode === "new" ? "Create New File" : "Append to Existing File") as string}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Create New File</SelectItem>
                          <SelectItem value="append">Append to Existing File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {saveMode === "new" ? (
                      <div className="grid gap-2">
                        <Label htmlFor="file-name">File Name</Label>
                        <Input id="file-name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="existing-file">Select Existing File</Label>
                        <Select value={selectedFile} onValueChange={setSelectedFile}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a file" />
                          </SelectTrigger>
                          <SelectContent>
                            {existingFiles.map((file) => (
                              <SelectItem key={file} value={file}>
                                {file}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveConfirm}
                      className="gradient-btn"
                      disabled={saveMode === "append" && !selectedFile}
                    >
                      {saveMode === "new" ? "Download" : "Append"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {editedData.length > 0 &&
                    Object.keys(editedData[0]).map((header) => (
                      <TableHead key={header} className="capitalize">
                        {header}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.entries(row).map(([key, value], cellIndex) => (
                      <TableCell key={`${rowIndex}-${cellIndex}`}>
                        {editMode ? (
                          <Input
                            value={typeof value === "string" ? value : String(value ?? "")} // Ensure string
                            onChange={(e) => handleCellEdit(rowIndex, key, e.target.value)}
                            className="h-8 w-full"
                          />
                        ) : (
                          String(value ?? "") // Ensure it displays correctly
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {editMode && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newRow = Object.fromEntries(
                    Object.keys(editedData[0]).map((key) => [
                      key,
                      key === "id" ? `S${(editedData.length + 1).toString().padStart(3, "0")}` : "",
                    ]),
                  )
                  setEditedData([...editedData, newRow])
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Statistics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{editedData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {editedData.length > 0
                  ? Math.round(
                      editedData.reduce((sum, row) => sum + (Number.parseInt(row.marks as string) || 0), 0) /
                        editedData.length,
                    )
                  : 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {editedData.length > 0
                  ? Math.max(...editedData.map((row) => Number.parseInt(row.marks as string) || 0))
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

