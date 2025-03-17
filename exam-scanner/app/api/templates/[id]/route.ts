import { type NextRequest, NextResponse } from "next/server"
import { getTemplateById, updateTemplate, deleteTemplate } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const template = await getTemplateById(id)

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error fetching template:", error)
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const result = await updateTemplate(id, body)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await deleteTemplate(id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}

