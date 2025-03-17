import { type NextRequest, NextResponse } from "next/server"
import { getUserSettings, createOrUpdateUserSettings } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (implement authentication as needed)
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const settings = await getUserSettings(userId)

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        userId,
        theme: "system",
        scanSettings: {
          defaultCamera: "rear",
          autoProcess: true,
          highResolution: true,
          saveOriginalImages: true,
        },
        csvSettings: {
          defaultFormat: "comma",
          includeHeaders: true,
          defaultFilename: "exam_results",
          autoAppend: false,
        },
        ocrSettings: {
          language: "en",
          mode: "balanced",
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get user ID from session (implement authentication as needed)
    const userId = request.headers.get("x-user-id") || body.userId

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Update or create user settings
    await createOrUpdateUserSettings(userId, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}

