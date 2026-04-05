'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { WorkLocation, WorkLocationForm } from '@/types/place'
import PlaceTable from './components/PlaceTable'
import PlaceModal from './components/PlaceModal'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminPlacesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [locations, setLocations] = useState<WorkLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<WorkLocation | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Fetch locations
  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('work_locations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setLocations(data as WorkLocation[])
    } catch (error) {
      console.error('Error fetching locations:', error)
      toast.error('Failed to load locations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingLocation(null)
    setIsModalOpen(true)
  }

  const handleEdit = (location: WorkLocation) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingLocation(null)
  }

  const handleSubmit = async (formData: WorkLocationForm) => {
    try {
      setIsSaving(true)

      if (editingLocation) {
        // Update
        const { error } = await supabase
          .from('work_locations')
          .update(formData)
          .eq('id', editingLocation.id)

        if (error) throw error
        toast.success('Location updated successfully!')
      } else {
        // Create
        const { error } = await supabase
          .from('work_locations')
          .insert([formData])

        if (error) throw error
        toast.success('Location added successfully!')
      }

      handleModalClose()
      fetchLocations()
    } catch (error) {
      console.error('Error saving location:', error)
      toast.error('Failed to save location')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('work_locations')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Location deleted successfully!')
      fetchLocations()
    } catch (error) {
      console.error('Error deleting location:', error)
      toast.error('Failed to delete location')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Work Locations</h1>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Work Locations</h1>
        <p className="text-gray-400">Manage projects and their filming locations across Egypt</p>
      </div>

      <PlaceTable
        locations={locations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      <PlaceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        editingLocation={editingLocation}
        isLoading={isSaving}
      />
    </div>
  )
}
