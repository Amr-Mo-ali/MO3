export type CategoryType = 'Commercial Ad' | 'Reel' | 'Podcast' | 'Video Clip' | 'Other'

export interface WorkLocation {
  id: string
  project_name: string
  client_name: string
  city: string
  governorate?: string
  lat: number
  lng: number
  category: CategoryType
  description?: string
  project_url?: string
  created_at: string
}

export interface WorkLocationForm {
  project_name: string
  client_name: string
  city: string
  governorate: string
  lat: number
  lng: number
  category: CategoryType
  description: string
  project_url: string
}
