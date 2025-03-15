"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Eye, FileSpreadsheet, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock history data
const mockHistory = [
  {
    id: "scan-001",
    title: "Semester 1 Mathematics",
    date: "2025-03-10T09:30:00Z",
    records: 32,
    status: "completed",
    filename: "sem1_math_results.csv",
  },
  {
    id: "scan-002",
    title: "Semester 1 Physics",
    date: "2025-03-09T14:15:00Z",
    records: 28,
    status: "completed",
    filename: "sem1_physics_results.csv",
  },
  {
    id: "scan-003",
    title: "Midterm Chemistry",
    date: "2025-03-05T11:20:00Z",
    records: 30,
    status: "completed",
    filename: "midterm_chem_results.csv",
  },
  {
    id: "scan-004",
    title: "Semester 1 English",
    date: "2025-03-01T10:00:00Z",
    records: 35,
    status: "completed",
    filename: "sem1_english_results.csv",
  },
  {
    id: "scan-005",
    title: "Practical Computer Science",
    date: "2025-02-28T13:45:00Z",
    records: 25,
    status: "completed",
    filename: "practical_cs_results.csv",
  },
]

export default function HistoryPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedScan, setSelectedScan] = useState<any | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Filter history based on search query and status
  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Handle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been deleted.`,
    })
    setSelectedItems([])
    setShowDeleteDialog(false)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Scan History</h1>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or filename..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          {selectedItems.length > 0 && (
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedItems.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {selectedItems.length} selected items? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedItems.length === filteredHistory.length && filteredHistory.length > 0}
                    onChange={() => {
                      if (selectedItems.length === filteredHistory.length) {
                        setSelectedItems([])
                      } else {
                        setSelectedItems(filteredHistory.map((item) => item.id))
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No scan history found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.records}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "completed" ? "default" : "outline"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.filename}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/results?id=${item.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedScan(item)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Statistics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockHistory.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockHistory.reduce((sum, item) => sum + item.records, 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockHistory.filter((item) => {
                    const date = new Date(item.date)
                    const now = new Date()
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">CSV Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{mockHistory.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

