//lib\db.tslib\db.ts

import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

// Define collection types
export interface ScanResult {
  _id?: ObjectId
  title: string
  timestamp: Date
  data: any[]
  confidence: number
  userId?: string
  originalImage?: string
  processedImage?: string
}

export interface Template {
  _id?: ObjectId
  name: string
  description: string
  fields: string[]
  lastUsed: Date
  isDefault: boolean
  userId?: string
}

export interface UserSettings {
  _id?: ObjectId
  userId: string
  theme: "light" | "dark" | "system"
  scanSettings: {
    defaultCamera: "rear" | "front"
    autoProcess: boolean
    highResolution: boolean
    saveOriginalImages: boolean
  }
  csvSettings: {
    defaultFormat: "comma" | "semicolon" | "tab"
    includeHeaders: boolean
    defaultFilename: string
    autoAppend: boolean
  }
  ocrSettings: {
    language: string
    mode: "fast" | "balanced" | "accurate"
  }
}

// Database helper functions
export async function getScanResults(userId?: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  const query = userId ? { userId } : {}
  return db.collection("scanResults").find(query).sort({ timestamp: -1 }).toArray()
}

export async function getScanResultById(id: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  return db.collection("scanResults").findOne({ _id: new ObjectId(id) })
}

export async function createScanResult(scanResult: any) {
  const client = await clientPromise;
  const db = client.db("examscan");

  const result = await db.collection("scanResults").insertOne({
    ...scanResult,
    timestamp: new Date(scanResult.timestamp),
  });

  return result;
}

export async function updateScanResult(id: string, scanResult: Partial<ScanResult>) {
  const client = await clientPromise
  const db = client.db("examscan")

  const result = await db.collection("scanResults").updateOne({ _id: new ObjectId(id) }, { $set: scanResult })

  return result
}

export async function deleteScanResult(id: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  const result = await db.collection("scanResults").deleteOne({ _id: new ObjectId(id) })

  return result
}

// Template functions
export async function getTemplates(userId?: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  const query = userId ? { userId } : {}
  return db.collection("templates").find(query).sort({ lastUsed: -1 }).toArray()
}

export async function getTemplateById(id: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  return db.collection("templates").findOne({ _id: new ObjectId(id) })
}

export async function createTemplate(template: Template) {
  const client = await clientPromise
  const db = client.db("examscan")

  // If this is set as default, update other templates
  if (template.isDefault && template.userId) {
    await db
      .collection("templates")
      .updateMany({ userId: template.userId, isDefault: true }, { $set: { isDefault: false } })
  }

  const result = await db.collection("templates").insertOne({
    ...template,
    lastUsed: new Date(template.lastUsed),
  })

  return result
}

export async function updateTemplate(id: string, template: Partial<Template>) {
  const client = await clientPromise
  const db = client.db("examscan")

  // If this is set as default, update other templates
  if (template.isDefault && template.userId) {
    await db
      .collection("templates")
      .updateMany({ userId: template.userId, isDefault: true }, { $set: { isDefault: false } })
  }

  const result = await db.collection("templates").updateOne({ _id: new ObjectId(id) }, { $set: template })

  return result
}

export async function deleteTemplate(id: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  const result = await db.collection("templates").deleteOne({ _id: new ObjectId(id) })

  return result
}

// User settings functions
export async function getUserSettings(userId: string) {
  const client = await clientPromise
  const db = client.db("examscan")

  return db.collection("userSettings").findOne({ userId })
}

export async function createOrUpdateUserSettings(userId: string, settings: Partial<UserSettings>) {
  const client = await clientPromise
  const db = client.db("examscan")

  const result = await db.collection("userSettings").updateOne({ userId }, { $set: settings }, { upsert: true })

  return result
}

