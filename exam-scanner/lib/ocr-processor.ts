import { spawn } from "child_process"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { ScanResult } from "./db"

interface OCROptions {
  language?: string
  mode?: "fast" | "balanced" | "accurate"
  templateId?: string
}

export async function processImageWithOCR(imageBase64: string, options: OCROptions = {}): Promise<ScanResult> {
  try {
    // Create a temporary file for the image
    const imageId = uuidv4()
    const tempDir = path.join(process.cwd(), "temp")

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const imagePath = path.join(tempDir, `${imageId}.jpg`)

    // Remove the data:image/jpeg;base64, part if it exists
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "")

    // Write the image to a temporary file
    fs.writeFileSync(imagePath, Buffer.from(base64Data, "base64"))

    // Prepare options for the Python script
    const scriptOptions = [
      "--image",
      imagePath,
      "--language",
      options.language || "eng",
      "--mode",
      options.mode || "accurate", // Default to accurate mode for maximum accuracy
    ]

    if (options.templateId) {
      scriptOptions.push("--template", options.templateId)
    }

    // Run the Python script
    const result = await runPythonScript("ocr_model.py", scriptOptions)

    // Parse the result
    const ocrResult = JSON.parse(result)

    // Clean up the temporary file
    fs.unlinkSync(imagePath)

    // Format the result as a ScanResult
    return {
      title: ocrResult.title || "Scanned Document",
      timestamp: new Date(),
      data: ocrResult.data || [],
      confidence: ocrResult.confidence || 85,
      originalImage: imageBase64,
      processedImage: ocrResult.processedImage,
    }
  } catch (error) {
    console.error("OCR processing error:", error)
    throw new Error("Failed to process image with OCR")
  }
}

function runPythonScript(scriptName: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "python", scriptName)

    // Log the command being executed for debugging
    console.log(`Executing: python ${scriptPath} ${args.join(" ")}`)

    const pythonProcess = spawn("python", [scriptPath, ...args])

    let result = ""
    let errorOutput = ""

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString()
      console.error(`Python stderr: ${data}`)
    })

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${errorOutput}`))
      } else {
        resolve(result)
      }
    })

    // Handle process errors
    pythonProcess.on("error", (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`))
    })
  })
}

