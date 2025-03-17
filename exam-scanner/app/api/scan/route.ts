import { type NextRequest, NextResponse } from "next/server"
import { processImageWithOCR } from "@/lib/ocr-processor"
import { createScanResult } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, options = {} } = body

    if (!image) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    // Set default mode to accurate for maximum accuracy
    const enhancedOptions = {
      ...options,
      mode: options.mode || "accurate",
    }

    // Process the image with OCR
    const result = await processImageWithOCR(image, enhancedOptions)

    // Save the result to the database
    await createScanResult(result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing scan:", error)
    return NextResponse.json({ error: "Failed to process scan" }, { status: 500 })
  }
}

