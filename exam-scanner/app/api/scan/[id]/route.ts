import { type NextRequest, NextResponse } from "next/server"
import { createScanResult, getScanResultById, updateScanResult, deleteScanResult } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await getScanResultById(id)

    if (!result) {
      return NextResponse.json({ error: "Scan result not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching scan result:", error)
    return NextResponse.json({ error: "Failed to fetch scan result" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body); // Log the request body

    // Validate required fields
    if (!body.title || !body.timestamp || !body.data || !body.confidence) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save the scan result to the database
    const result = await createScanResult(body);
    console.log("Database result:", result); // Log the database result

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error saving scan result:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save scan result" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const result = await updateScanResult(id, body)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Scan result not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error updating scan result:", error)
    return NextResponse.json({ error: "Failed to update scan result" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await deleteScanResult(id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Scan result not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting scan result:", error)
    return NextResponse.json({ error: "Failed to delete scan result" }, { status: 500 })
  }
}

