"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Moon, Save, Sun, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SettingsPage() {
  const { toast } = useToast()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [scanSettings, setScanSettings] = useState({
    defaultCamera: "rear",
    autoProcess: true,
    highResolution: true,
    saveOriginalImages: true,
  })
  const [csvSettings, setCSVSettings] = useState({
    defaultFormat: "comma",
    includeHeaders: true,
    defaultFilename: "exam_results",
    autoAppend: false,
  })
  const [userSettings, setUserSettings] = useState({
    name: "Exam Administrator",
    email: "admin@example.com",
    notifications: true,
  })
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largerText: false,
    highContrast: false,
    reduceMotion: false,
  })
  const [language, setLanguage] = useState("en")
  const [ocrLanguage, setOcrLanguage] = useState("en")
  const [ocrMode, setOcrMode] = useState("accurate")
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // Load current theme on mount
  useEffect(() => {
    // Check if dark class is present on html element
    const isDark = document.documentElement.classList.contains("dark")
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark" | "system")
    } else {
      setTheme(isDark ? "dark" : "light")
    }

    // Load other settings from localStorage if available
    const savedScanSettings = localStorage.getItem("scanSettings")
    if (savedScanSettings) {
      setScanSettings(JSON.parse(savedScanSettings))
    }

    const savedCsvSettings = localStorage.getItem("csvSettings")
    if (savedCsvSettings) {
      setCSVSettings(JSON.parse(savedCsvSettings))
    }

    const savedUserSettings = localStorage.getItem("userSettings")
    if (savedUserSettings) {
      setUserSettings(JSON.parse(savedUserSettings))
    }

    const savedAccessibilitySettings = localStorage.getItem("accessibilitySettings")
    if (savedAccessibilitySettings) {
      setAccessibilitySettings(JSON.parse(savedAccessibilitySettings))
    }

    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const savedOcrLanguage = localStorage.getItem("ocrLanguage")
    if (savedOcrLanguage) {
      setOcrLanguage(savedOcrLanguage)
    }

    const savedOcrMode = localStorage.getItem("ocrMode")
    if (savedOcrMode) {
      setOcrMode(savedOcrMode)
    }
  }, [])

  // Apply accessibility settings
  useEffect(() => {
    if (accessibilitySettings.largerText) {
      document.documentElement.style.fontSize = "112.5%"
    } else {
      document.documentElement.style.fontSize = "100%"
    }

    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    if (accessibilitySettings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [accessibilitySettings])

  // Toggle theme
  const toggleTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem("language", value)
  }

  // Handle OCR language change
  const handleOcrLanguageChange = (value: string) => {
    setOcrLanguage(value)
    localStorage.setItem("ocrLanguage", value)
  }

  // Handle OCR mode change
  const handleOcrModeChange = (value: string) => {
    setOcrMode(value)
    localStorage.setItem("ocrMode", value)
  }

  // Handle accessibility toggle
  const handleAccessibilityToggle = (setting: keyof typeof accessibilitySettings, value: boolean) => {
    const newSettings = { ...accessibilitySettings, [setting]: value }
    setAccessibilitySettings(newSettings)
    localStorage.setItem("accessibilitySettings", JSON.stringify(newSettings))
  }

  // Save settings
  const saveSettings = () => {
    // Save all settings to localStorage
    localStorage.setItem("scanSettings", JSON.stringify(scanSettings))
    localStorage.setItem("csvSettings", JSON.stringify(csvSettings))
    localStorage.setItem("userSettings", JSON.stringify(userSettings))

    // Show success message
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })

    // Visual feedback
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 2000)
  }

  // Export all data
  const handleExportData = () => {
    // Create a data object with all settings
    const exportData = {
      theme,
      scanSettings,
      csvSettings,
      userSettings,
      accessibilitySettings,
      language,
      ocrLanguage,
      ocrMode,
      exportDate: new Date().toISOString(),
    }

    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2)

    // Create download link
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "examscan_settings.json")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Data Exported",
      description: "Your settings have been exported successfully.",
    })
  }

  // Delete all data
  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      // Clear all localStorage items
      localStorage.removeItem("theme")
      localStorage.removeItem("scanSettings")
      localStorage.removeItem("csvSettings")
      localStorage.removeItem("userSettings")
      localStorage.removeItem("accessibilitySettings")
      localStorage.removeItem("language")
      localStorage.removeItem("ocrLanguage")
      localStorage.removeItem("ocrMode")
      localStorage.removeItem("lastScanResult")
      localStorage.removeItem("scanHistory")

      // Reset state to defaults
      setTheme("system")
      setScanSettings({
        defaultCamera: "rear",
        autoProcess: true,
        highResolution: true,
        saveOriginalImages: true,
      })
      setCSVSettings({
        defaultFormat: "comma",
        includeHeaders: true,
        defaultFilename: "exam_results",
        autoAppend: false,
      })
      setUserSettings({
        name: "Exam Administrator",
        email: "admin@example.com",
        notifications: true,
      })
      setAccessibilitySettings({
        largerText: false,
        highContrast: false,
        reduceMotion: false,
      })
      setLanguage("en")
      setOcrLanguage("en")
      setOcrMode("accurate")

      // Apply system theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      toast({
        title: "Data Deleted",
        description: "All your data has been deleted successfully.",
      })
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="csv">CSV Export</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how ExamScan looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className={theme === "light" ? "w-full gradient-btn" : "w-full"}
                    onClick={() => toggleTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className={theme === "dark" ? "w-full gradient-btn" : "w-full"}
                    onClick={() => toggleTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className={theme === "system" ? "w-full gradient-btn" : "w-full"}
                    onClick={() => toggleTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Adjust settings to make ExamScan more accessible.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="font-size">Larger Text</Label>
                  <p className="text-sm text-muted-foreground">Increase the text size throughout the application</p>
                </div>
                <Switch
                  id="font-size"
                  checked={accessibilitySettings.largerText}
                  onCheckedChange={(checked) => handleAccessibilityToggle("largerText", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Enhance visual distinction between elements</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={accessibilitySettings.highContrast}
                  onCheckedChange={(checked) => handleAccessibilityToggle("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-motion">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations throughout the interface</p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={accessibilitySettings.reduceMotion}
                  onCheckedChange={(checked) => handleAccessibilityToggle("reduceMotion", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanning" className="mt-6 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Camera Settings</CardTitle>
              <CardDescription>Configure how the scanner captures documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Camera</Label>
                <RadioGroup
                  value={scanSettings.defaultCamera}
                  onValueChange={(value) => setScanSettings({ ...scanSettings, defaultCamera: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rear" id="rear" />
                    <Label htmlFor="rear">Rear Camera (Recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="front" id="front" />
                    <Label htmlFor="front">Front Camera</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-resolution">High Resolution</Label>
                  <p className="text-sm text-muted-foreground">Capture images at maximum resolution (may be slower)</p>
                </div>
                <Switch
                  id="high-resolution"
                  checked={scanSettings.highResolution}
                  onCheckedChange={(checked) => setScanSettings({ ...scanSettings, highResolution: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-process">Auto Process</Label>
                  <p className="text-sm text-muted-foreground">Automatically process documents after capture</p>
                </div>
                <Switch
                  id="auto-process"
                  checked={scanSettings.autoProcess}
                  onCheckedChange={(checked) => setScanSettings({ ...scanSettings, autoProcess: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-original">Save Original Images</Label>
                  <p className="text-sm text-muted-foreground">Keep original scanned images for reference</p>
                </div>
                <Switch
                  id="save-original"
                  checked={scanSettings.saveOriginalImages}
                  onCheckedChange={(checked) => setScanSettings({ ...scanSettings, saveOriginalImages: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>OCR Settings</CardTitle>
              <CardDescription>Configure how text is recognized from images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ocr-language">OCR Language</Label>
                <Select value={ocrLanguage} onValueChange={handleOcrLanguageChange}>
                  <SelectTrigger id="ocr-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocr-mode">Recognition Mode</Label>
                <Select value={ocrMode} onValueChange={handleOcrModeChange}>
                  <SelectTrigger id="ocr-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast (Lower Accuracy)</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="accurate">Accurate (Slower)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="mt-6 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>CSV Export Settings</CardTitle>
              <CardDescription>Configure how data is exported to CSV files.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-filename">Default Filename</Label>
                <Input
                  id="default-filename"
                  value={csvSettings.defaultFilename}
                  onChange={(e) => setCSVSettings({ ...csvSettings, defaultFilename: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>CSV Format</Label>
                <RadioGroup
                  value={csvSettings.defaultFormat}
                  onValueChange={(value) => setCSVSettings({ ...csvSettings, defaultFormat: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comma" id="comma" />
                    <Label htmlFor="comma">Comma Separated (,)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semicolon" id="semicolon" />
                    <Label htmlFor="semicolon">Semicolon Separated (;)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tab" id="tab" />
                    <Label htmlFor="tab">Tab Separated</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-headers">Include Headers</Label>
                  <p className="text-sm text-muted-foreground">Add column headers to CSV files</p>
                </div>
                <Switch
                  id="include-headers"
                  checked={csvSettings.includeHeaders}
                  onCheckedChange={(checked) => setCSVSettings({ ...csvSettings, includeHeaders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-append">Auto-Append Mode</Label>
                  <p className="text-sm text-muted-foreground">Automatically append to existing files when possible</p>
                </div>
                <Switch
                  id="auto-append"
                  checked={csvSettings.autoAppend}
                  onCheckedChange={(checked) => setCSVSettings({ ...csvSettings, autoAppend: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Data Templates</CardTitle>
              <CardDescription>Manage templates for different exam formats.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Standard Exam</TableCell>
                      <TableCell>ID, Name, Subject, Marks</TableCell>
                      <TableCell>2 days ago</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Template Editor",
                              description: "Opening template editor...",
                            })
                            setTimeout(() => {
                              window.location.href = "/csv-templates"
                            }, 500)
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Multiple Choice</TableCell>
                      <TableCell>ID, Name, Correct, Total, Percentage</TableCell>
                      <TableCell>1 week ago</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Template Editor",
                              description: "Opening template editor...",
                            })
                            setTimeout(() => {
                              window.location.href = "/csv-templates"
                            }, 500)
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Practical Assessment</TableCell>
                      <TableCell>ID, Name, Task1, Task2, Task3, Total</TableCell>
                      <TableCell>2 weeks ago</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Template Editor",
                              description: "Opening template editor...",
                            })
                            setTimeout(() => {
                              window.location.href = "/csv-templates"
                            }, 500)
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Template Creator",
                      description: "Opening template creator...",
                    })
                    setTimeout(() => {
                      window.location.href = "/csv-templates"
                    }, 500)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userSettings.name}
                  onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                </div>
                <Switch
                  id="notifications"
                  checked={userSettings.notifications}
                  onCheckedChange={(checked) => setUserSettings({ ...userSettings, notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Storage</Label>
                <p className="text-sm text-muted-foreground">
                  Your data is stored locally on your device. No data is sent to our servers unless you explicitly
                  choose to back it up.
                </p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" onClick={handleExportData}>
                  Export All Data
                </Button>
              </div>

              <div className="space-y-2">
                <Button variant="destructive" onClick={handleDeleteData}>
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={saveSettings} className={showSaveSuccess ? "bg-green-500 hover:bg-green-600" : "gradient-btn"}>
          <Save className="mr-2 h-4 w-4" />
          {showSaveSuccess ? "Settings Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}

