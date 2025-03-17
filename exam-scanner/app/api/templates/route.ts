import { type NextRequest, NextResponse } from "next/server"
import { getTemplates, createTemplate } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (implement authentication as needed)
    const userId = request.headers.get("x-user-id") || undefined

    const templates = await getTemplates(userId)

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.fields) {
      return NextResponse.json({ error: "Name and fields are required" }, { status: 400 })
    }

    // Create the template
    const result = await createTemplate({
      ...body,
      lastUsed: new Date(),
    })

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}

