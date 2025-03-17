export function convertToCSV(
  data: any[],
  options: {
    delimiter?: string
    includeHeaders?: boolean
  } = {},
) {
  if (!data || data.length === 0) {
    return ""
  }

  const delimiter = options.delimiter || ","
  const includeHeaders = options.includeHeaders !== false

  // Get headers from the first object
  const headers = Object.keys(data[0])

  // Create CSV content
  let csvContent = ""

  // Add headers if needed
  if (includeHeaders) {
    csvContent += headers.join(delimiter) + "\n"
  }

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header]

      // Handle special cases (commas, quotes, etc.)
      if (value === null || value === undefined) {
        return ""
      } else if (
        typeof value === "string" &&
        (value.includes(delimiter) || value.includes('"') || value.includes("\n"))
      ) {
        return `"${value.replace(/"/g, '""')}"`
      } else {
        return value
      }
    })

    csvContent += values.join(delimiter) + "\n"
  })

  return csvContent
}

export function downloadCSV(csvContent: string, filename: string) {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  // Add the link to the DOM and click it
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function appendToCSV(
  existingCSV: string,
  newData: any[],
  options: {
    delimiter?: string
    includeHeaders?: boolean
  } = {},
) {
  const newCSV = convertToCSV(newData, { ...options, includeHeaders: false })

  return existingCSV + newCSV
}

