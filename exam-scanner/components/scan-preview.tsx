import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ScanPreviewProps {
  result: {
    title?: string
    timestamp?: string
    data: any[]
    confidence?: number
  }
}

export default function ScanPreview({ result }: ScanPreviewProps) {
  const { title, timestamp, data, confidence = 85 } = result

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title || "Extracted Data"}</CardTitle>
            <CardDescription>
              {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant={confidence > 80 ? "default" : "outline"}>{confidence}% Confidence</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {data.length > 0 &&
                  Object.keys(data[0]).map((header) => (
                    <TableHead key={header} className="capitalize">
                      {header}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={`${rowIndex}-${cellIndex}`}>{value as string}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

