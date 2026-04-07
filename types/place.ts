export type CategoryType = 'Commercial Ad' | 'Reel' | 'Podcast' | 'Video Clip' | 'Other'

export interface Place {
  id: string
  project_name: string
  client_name?: string
  city: string
  governorate?: string
  lat: number
  lng: number
  category: string
  description?: string
  project_url?: string
  created_at?: string
}

export interface WorkLocation extends Place {}

export interface WorkLocationForm extends Omit<Place, 'id' | 'created_at'> {}

export type PlaceCategory = 
  | 'All'
  | 'Commercial Ad'
  | 'Reel'
  | 'Podcast'
  | 'Video Clip'
  | 'Other'
