/**
 * API client for the OCR FastAPI backend
 */

// Base URL for the FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_OCR_API_URL || "http://localhost:8000"

interface OCROptions {
  mode?: "fast" | "balanced" | "accurate"
  language?: string
  templateId?: string
}

interface OCRResult {
  id: string
  title: string
  data: any[]
  confidence: number
  processedImage?: string
  status: "processing" | "completed" | "failed"
  progress?: number
  error?: string
}

/**
 * Process an image with OCR
 */
export async function processImage(imageDataUrl: string, options: OCROptions = {}): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageDataUrl,
        options: {
          mode: options.mode || "accurate",
          language: options.language || "eng",
          templateId: options.templateId,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to process image")
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Error processing image:", error)
    throw error
  }
}

/**
 * Get the status and result of an OCR processing task
 */
export async function getProcessingResult(taskId: string): Promise<OCRResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan/${taskId}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to get processing result")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting processing result:", error)
    throw error
  }
}

/**
 * Upload a file for OCR processing
 */
export async function uploadFile(file: File, options: OCROptions = {}): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("mode", options.mode || "accurate")
    formData.append("language", options.language || "eng")

    if (options.templateId) {
      formData.append("templateId", options.templateId)
    }

    const response = await fetch(`${API_BASE_URL}/api/scan/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to upload file")
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

/**
 * Check if the OCR API is healthy
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    const data = await response.json()
    return data.status === "healthy"
  } catch (error) {
    console.error("API health check failed:", error)
    return false
  }
}

