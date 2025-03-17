import { processImage, getProcessingResult, uploadFile } from "./ocr-api"
import { createScanResult } from "./db"

// Updated version that uses the FastAPI backend
export async function scanDocument(imageDataUrl: string, options = {}): Promise<any> {
  try {
    // Start the OCR processing
    const taskId = await processImage(imageDataUrl, options)

    // Poll for the result
    const result = await pollForResult(taskId)

    // Save the result to the database
    await createScanResult({
      title: result.title,
      timestamp: new Date(),
      data: result.data,
      confidence: result.confidence,
      originalImage: imageDataUrl,
      processedImage: result.processedImage,
    })

    return result
  } catch (error) {
    console.error("Error scanning document:", error)
    throw error
  }
}

// Poll for the result of an OCR processing task
async function pollForResult(taskId: string, maxAttempts = 60, interval = 1000): Promise<any> {
  let attempts = 0

  while (attempts < maxAttempts) {
    const result = await getProcessingResult(taskId)

    if (result.status === "completed") {
      return result
    }

    if (result.status === "failed") {
      throw new Error(result.error || "Processing failed")
    }

    // Wait before trying again
    await new Promise((resolve) => setTimeout(resolve, interval))
    attempts++
  }

  throw new Error("Processing timed out")
}

// Upload a file for OCR processing
export async function uploadForScanning(file: File, options = {}): Promise<any> {
  try {
    // Upload the file and start OCR processing
    const taskId = await uploadFile(file, options)

    // Poll for the result
    const result = await pollForResult(taskId)

    // Save the result to the database
    await createScanResult({
      title: result.title,
      timestamp: new Date(),
      data: result.data,
      confidence: result.confidence,
      processedImage: result.processedImage,
    })

    return result
  } catch (error) {
    console.error("Error uploading for scanning:", error)
    throw error
  }
}

export async function getScanHistory() {
  try {
    const response = await fetch("/api/scan/history")

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch scan history")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching scan history:", error)
    throw error
  }
}

export async function getScanResult(id: string) {
  try {
    const response = await fetch(`/api/scan/${id}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch scan result")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching scan result:", error)
    throw error
  }
}

export async function updateScanResult(id: string, data: any) {
  try {
    const response = await fetch(`/api/scan/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update scan result")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating scan result:", error)
    throw error
  }
}

export async function deleteScanResult(id: string) {
  try {
    const response = await fetch(`/api/scan/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete scan result")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting scan result:", error)
    throw error
  }
}

