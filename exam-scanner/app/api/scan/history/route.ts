import { type NextRequest, NextResponse } from "next/server"
import { getScanResults } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (implement authentication as needed)
    const userId = request.headers.get("x-user-id") || undefined

    const results = await getScanResults(userId)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching scan history:", error)
    return NextResponse.json({ error: "Failed to fetch scan history" }, { status: 500 })
  }
}

