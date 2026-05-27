/**
 * Image Storage Service
 *
 * Uses Supabase Storage for unit images.
 * Only available for logged-in users.
 */

import { supabase } from './supabase'

const BUCKET = 'unit-images'

/** Upload a unit image. Returns the public URL or null. */
export async function uploadUnitImage(
  userId: string,
  unitId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${userId}/${unitId}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })

  if (error) {
    console.error('Failed to upload image:', error)
    return null
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  // Append cache-buster so browser doesn't serve stale image on replace
  return `${data.publicUrl}?t=${Date.now()}`
}

/** Delete a unit image */
export async function deleteUnitImage(userId: string, unitId: string, imageUrl: string): Promise<void> {
  // Strip query params before extracting path
  const cleanUrl = imageUrl.split('?')[0]
  const parts = cleanUrl.split(`${BUCKET}/`)
  if (parts.length < 2) return
  const path = parts[1]

  await supabase.storage.from(BUCKET).remove([path])
}
