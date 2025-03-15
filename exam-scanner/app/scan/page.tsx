"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, FlipHorizontal, ImageIcon, Maximize, Minimize, X, Check, Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import ScanPreview from "@/components/scan-preview"
import { scanDocument } from "@/lib/scan-document"

export default function ScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<string>("camera")
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [scanResult, setScanResult] = useState<any | null>(null)

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }

      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }, [cameraStream, facingMode, toast])

  // Initialize camera on mount and when facing mode changes
  useEffect(() => {
    if (activeTab === "camera") {
      initializeCamera()
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [activeTab, facingMode, initializeCamera, cameraStream])

  // Toggle camera facing mode
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)
      }
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCapturedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Process the captured image
  const processImage = async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    try {
      // This would be replaced with actual OCR and data extraction logic
      const result = await scanDocument(capturedImage)
      setScanResult(result)

      toast({
        title: "Document Scanned",
        description: "Successfully extracted data from the document.",
      })
    } catch (error) {
      console.error("Error processing image:", error)
      toast({
        title: "Processing Error",
        description: "Failed to process the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset the scan process
  const resetScan = () => {
    setCapturedImage(null)
    setScanResult(null)
  }

  // Navigate to results page
  const goToResults = () => {
    if (scanResult) {
      // In a real app, you'd store the result and navigate
      localStorage.setItem("lastScanResult", JSON.stringify(scanResult))
      router.push("/results")
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Document Scanner</h1>

      {!capturedImage ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <Button variant="secondary" size="icon" onClick={toggleCameraFacing}>
                      <FlipHorizontal className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={captureImage}
                      size="lg"
                      className="rounded-full h-14 w-14 p-0 flex items-center justify-center gradient-btn"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>

                    <Button variant="secondary" size="icon" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <canvas ref={canvasRef} className="hidden" />
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Upload an Image</h3>
                    <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured document"
              className="w-full rounded-lg border"
            />
            <Button variant="secondary" size="icon" className="absolute top-2 right-2" onClick={resetScan}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {scanResult ? (
            <div className="space-y-6">
              <ScanPreview result={scanResult} />

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={resetScan}>
                  Scan Another
                </Button>
                <Button onClick={goToResults} className="gradient-btn">
                  Continue to Results <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={resetScan}>
                Cancel
              </Button>
              <Button onClick={processImage} disabled={isProcessing} className={isProcessing ? "" : "gradient-btn"}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process Document
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

