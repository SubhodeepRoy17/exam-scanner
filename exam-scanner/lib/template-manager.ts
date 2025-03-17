export async function getTemplates() {
  try {
    const response = await fetch("/api/templates")

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch templates")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching templates:", error)
    throw error
  }
}

export async function getTemplate(id: string) {
  try {
    const response = await fetch(`/api/templates/${id}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch template")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching template:", error)
    throw error
  }
}

export async function createTemplate(template: any) {
  try {
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create template")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating template:", error)
    throw error
  }
}

export async function updateTemplate(id: string, template: any) {
  try {
    const response = await fetch(`/api/templates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update template")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating template:", error)
    throw error
  }
}

export async function deleteTemplate(id: string) {
  try {
    const response = await fetch(`/api/templates/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete template")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting template:", error)
    throw error
  }
}

