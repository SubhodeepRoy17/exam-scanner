"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Download, Edit, FileSpreadsheet, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Mock template data
const mockTemplates = [
  {
    id: "template-001",
    name: "Standard Exam",
    description: "Basic exam result template with student ID, name, subject, and marks",
    fields: ["id", "name", "subject", "marks"],
    lastUsed: "2025-03-10T09:30:00Z",
    isDefault: true,
  },
  {
    id: "template-002",
    name: "Multiple Choice Test",
    description: "Template for multiple choice exams with correct answers and percentage",
    fields: ["id", "name", "correct", "total", "percentage"],
    lastUsed: "2025-03-05T14:15:00Z",
    isDefault: false,
  },
  {
    id: "template-003",
    name: "Practical Assessment",
    description: "Template for practical exams with multiple task scores",
    fields: ["id", "name", "task1", "task2", "task3", "total"],
    lastUsed: "2025-02-28T11:20:00Z",
    isDefault: false,
  },
  {
    id: "template-004",
    name: "Semester Report",
    description: "Comprehensive semester report with multiple subjects",
    fields: ["id", "name", "math", "science", "english", "history", "average"],
    lastUsed: "2025-02-20T10:00:00Z",
    isDefault: false,
  },
]

export default function CSVTemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState(mockTemplates)
  const [activeTab, setActiveTab] = useState("all")
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false)
  const [showEditTemplateDialog, setShowEditTemplateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    fields: "",
    isDefault: false,
  })

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle creating a new template
  const handleCreateTemplate = () => {
    const fieldsArray = newTemplate.fields.split(",").map((field) => field.trim())

    const template = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      fields: fieldsArray,
      lastUsed: new Date().toISOString(),
      isDefault: newTemplate.isDefault,
    }

    // If this is set as default, update other templates
    let updatedTemplates = [...templates]
    if (newTemplate.isDefault) {
      updatedTemplates = updatedTemplates.map((t) => ({
        ...t,
        isDefault: false,
      }))
    }

    setTemplates([...updatedTemplates, template])
    setShowNewTemplateDialog(false)
    setNewTemplate({
      name: "",
      description: "",
      fields: "",
      isDefault: false,
    })

    toast({
      title: "Template Created",
      description: `Template "${template.name}" has been created successfully.`,
    })
  }

  // Handle editing a template
  const handleEditTemplate = () => {
    if (!selectedTemplate) return

    const fieldsArray =
      typeof selectedTemplate.fields === "string"
        ? selectedTemplate.fields.split(",").map((field: string) => field.trim())
        : selectedTemplate.fields

    const updatedTemplate = {
      ...selectedTemplate,
      fields: fieldsArray,
      lastUsed: new Date().toISOString(),
    }

    // If this is set as default, update other templates
    const updatedTemplates = templates.map((t) =>
      t.id === updatedTemplate.id ? updatedTemplate : updatedTemplate.isDefault ? { ...t, isDefault: false } : t,
    )

    setTemplates(updatedTemplates)
    setShowEditTemplateDialog(false)

    toast({
      title: "Template Updated",
      description: `Template "${updatedTemplate.name}" has been updated successfully.`,
    })
  }

  // Handle deleting a template
  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return

    const updatedTemplates = templates.filter((t) => t.id !== selectedTemplate.id)
    setTemplates(updatedTemplates)
    setShowDeleteDialog(false)

    toast({
      title: "Template Deleted",
      description: `Template "${selectedTemplate.name}" has been deleted.`,
    })
  }

  // Handle setting a template as default
  const handleSetDefault = (templateId: string) => {
    const updatedTemplates = templates.map((t) => ({
      ...t,
      isDefault: t.id === templateId,
    }))

    setTemplates(updatedTemplates)

    toast({
      title: "Default Template Updated",
      description: "The default template has been updated successfully.",
    })
  }

  // Handle duplicating a template
  const handleDuplicateTemplate = (template: any) => {
    const duplicatedTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      lastUsed: new Date().toISOString(),
      isDefault: false,
    }

    setTemplates([...templates, duplicatedTemplate])

    toast({
      title: "Template Duplicated",
      description: `Template "${template.name}" has been duplicated.`,
    })
  }

  // Filter templates based on active tab
  const filteredTemplates =
    activeTab === "all"
      ? templates
      : activeTab === "default"
        ? templates.filter((t) => t.isDefault)
        : templates.filter((t) => !t.isDefault)

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">CSV Templates</h1>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">Manage your CSV templates for different exam formats.</p>

        <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-btn action-btn">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Define a new CSV template for exam results.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Midterm Exam"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Describe the purpose of this template"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="template-fields">Fields (comma separated)</Label>
                <Textarea
                  id="template-fields"
                  value={newTemplate.fields}
                  onChange={(e) => setNewTemplate({ ...newTemplate, fields: e.target.value })}
                  placeholder="id, name, subject, marks"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Enter field names separated by commas. These will become the CSV column headers.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="template-default"
                  checked={newTemplate.isDefault}
                  onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, isDefault: checked })}
                />
                <Label htmlFor="template-default">Set as default template</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTemplateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                className="gradient-btn"
                disabled={!newTemplate.name || !newTemplate.fields}
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No templates found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.description}</TableCell>
                        <TableCell>
                          {Array.isArray(template.fields) ? template.fields.join(", ") : template.fields}
                        </TableCell>
                        <TableCell>{formatDate(template.lastUsed)}</TableCell>
                        <TableCell>{template.isDefault && <Badge>Default</Badge>}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTemplate(template)
                                setShowEditTemplateDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDuplicateTemplate(template)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            {!template.isDefault && (
                              <Button variant="ghost" size="icon" onClick={() => handleSetDefault(template.id)}>
                                <FileSpreadsheet className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTemplate(template)
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
        </TabsContent>
      </Tabs>

      {/* Edit Template Dialog */}
      <Dialog open={showEditTemplateDialog} onOpenChange={setShowEditTemplateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update your CSV template settings.</DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input
                  id="edit-template-name"
                  value={selectedTemplate.name}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-template-description">Description</Label>
                <Textarea
                  id="edit-template-description"
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-template-fields">Fields (comma separated)</Label>
                <Textarea
                  id="edit-template-fields"
                  value={
                    Array.isArray(selectedTemplate.fields)
                      ? selectedTemplate.fields.join(", ")
                      : selectedTemplate.fields
                  }
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, fields: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-template-default"
                  checked={selectedTemplate.isDefault}
                  onCheckedChange={(checked) => setSelectedTemplate({ ...selectedTemplate, isDefault: checked })}
                />
                <Label htmlFor="edit-template-default">Set as default template</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTemplate} className="gradient-btn">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Template Preview</h2>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>CSV Structure</CardTitle>
            <CardDescription>Preview how your data will be structured in the CSV file.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {templates
                      .find((t) => t.isDefault)
                      ?.fields.map((field: string, index: number) => (
                        <TableHead key={index}>{field}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {templates
                      .find((t) => t.isDefault)
                      ?.fields.map((field: string, index: number) => (
                        <TableCell key={index} className="text-muted-foreground">
                          {field === "id"
                            ? "S001"
                            : field === "name"
                              ? "John Smith"
                              : field === "subject"
                                ? "Mathematics"
                                : field === "marks"
                                  ? "85"
                                  : field === "correct"
                                    ? "42"
                                    : field === "total"
                                      ? "50"
                                      : field === "percentage"
                                        ? "84%"
                                        : field === "task1"
                                          ? "18/20"
                                          : field === "task2"
                                            ? "15/20"
                                            : field === "task3"
                                              ? "19/20"
                                              : field === "math"
                                                ? "92"
                                                : field === "science"
                                                  ? "88"
                                                  : field === "english"
                                                    ? "78"
                                                    : field === "history"
                                                      ? "85"
                                                      : field === "average"
                                                        ? "85.75"
                                                        : "Sample data"}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    {templates
                      .find((t) => t.isDefault)
                      ?.fields.map((field: string, index: number) => (
                        <TableCell key={index} className="text-muted-foreground">
                          {field === "id"
                            ? "S002"
                            : field === "name"
                              ? "Emily Johnson"
                              : field === "subject"
                                ? "Mathematics"
                                : field === "marks"
                                  ? "92"
                                  : field === "correct"
                                    ? "48"
                                    : field === "total"
                                      ? "50"
                                      : field === "percentage"
                                        ? "96%"
                                        : field === "task1"
                                          ? "19/20"
                                          : field === "task2"
                                            ? "18/20"
                                            : field === "task3"
                                              ? "20/20"
                                              : field === "math"
                                                ? "95"
                                                : field === "science"
                                                  ? "90"
                                                  : field === "english"
                                                    ? "88"
                                                    : field === "history"
                                                      ? "82"
                                                      : field === "average"
                                                        ? "88.75"
                                                        : "Sample data"}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Sample CSV
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

