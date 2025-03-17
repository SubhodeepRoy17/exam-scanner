"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { getProcessingResult } from "@/lib/ocr-api"

interface ScanProgressProps {
  taskId: string
  onComplete: (result: any) => void
  onError: (error: string) => void
}

export default function ScanProgress({ taskId, onComplete, onError }: ScanProgressProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("processing")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!taskId) return

    const checkProgress = async () => {
      try {
        const result = await getProcessingResult(taskId)

        if (result.status === "completed") {
          setProgress(100)
          setStatus("completed")
          onComplete(result)
          return
        }

        if (result.status === "failed") {
          setStatus("failed")
          setError(result.error || "Processing failed")
          onError(result.error || "Processing failed")
          return
        }

        // Update progress
        setProgress(result.progress || 0)

        // Continue polling
        setTimeout(checkProgress, 1000)
      } catch (error) {
        console.error("Error checking progress:", error)
        setStatus("failed")
        setError("Failed to check processing status")
        onError("Failed to check processing status")
      }
    }

    checkProgress()
  }, [taskId, onComplete, onError])

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          {status === "processing" && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h3 className="text-lg font-medium">Processing Document</h3>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {progress < 30 && "Analyzing document..."}
                {progress >= 30 && progress < 60 && "Extracting text..."}
                {progress >= 60 && progress < 90 && "Structuring data..."}
                {progress >= 90 && "Finalizing results..."}
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="rounded-full bg-destructive/10 p-3">
                <svg
                  className="h-6 w-6 text-destructive"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Processing Failed</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

