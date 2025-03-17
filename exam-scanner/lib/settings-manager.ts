export async function getUserSettings() {
  try {
    const response = await fetch("/api/settings")

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch user settings")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user settings:", error)
    throw error
  }
}

export async function updateUserSettings(settings: any) {
  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update user settings")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user settings:", error)
    throw error
  }
}

