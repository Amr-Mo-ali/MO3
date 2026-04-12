'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
}

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [envStatus, setEnvStatus] = useState<{
    checking: boolean
    configured: boolean
    details: string
  }>({ checking: false, configured: false, details: '' })

  async function checkEnv() {
    setEnvStatus({ checking: true, configured: false, details: '' })
    try {
      const response = await fetch('/api/admin/check-env')
      const data = await response.json()

      if (response.ok) {
        setEnvStatus({
          checking: false,
          configured: true,
          details: JSON.stringify(data, null, 2)
        })
        toast.success('Environment variables are properly configured!')
      } else {
        setEnvStatus({
          checking: false,
          configured: false,
          details: JSON.stringify(data, null, 2)
        })
        toast.error('Environment variables are missing or incorrect')
      }
    } catch (error: any) {
      setEnvStatus({
        checking: false,
        configured: false,
        details: error?.message || 'Failed to check environment'
      })
      toast.error('Failed to check environment variables')
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }

  async function handleUpload() {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data?.error || 'Upload failed')
        return
      }

      setUploadResult(data)
      toast.success('Upload successful!')
    } catch (error: any) {
      toast.error(error?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-3xl font-semibold text-white">Upload Test & Debugging</h1>
        <p className="mt-2 text-sm text-slate-400">
          Test file uploads and verify environment variable configuration.
        </p>
      </div>

      {/* Environment Check Section */}
      <div className="rounded-3xl border border-slate-800 bg-[#111111] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Environment Variables</h2>
        <button
          onClick={checkEnv}
          disabled={envStatus.checking}
          className="rounded-2xl bg-[#E31212] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b10d0d] disabled:opacity-60"
        >
          {envStatus.checking ? 'Checking...' : 'Check Environment'}
        </button>

        {envStatus.details && (
          <div className="mt-4 max-h-64 overflow-auto rounded-2xl bg-slate-950 p-4">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
              {envStatus.details}
            </pre>
          </div>
        )}

        {envStatus.configured && (
          <div className="mt-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-sm text-emerald-300">
            ✓ All Cloudinary environment variables are configured
          </div>
        )}
      </div>

      {/* Upload Test Section */}
      <div className="rounded-3xl border border-slate-800 bg-[#111111] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Test File Upload</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-2xl file:border file:border-slate-700 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-300 hover:file:bg-slate-800"
            />
          </div>

          {preview && (
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <p className="mb-2 text-xs text-slate-400">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-32 rounded-lg object-cover border border-slate-700"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="rounded-2xl bg-[#E31212] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b10d0d] disabled:opacity-60 w-full"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {uploadResult && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4">
              <p className="text-sm font-medium text-emerald-300 mb-3">Upload Success!</p>
              <div className="space-y-2 text-xs text-emerald-200">
                <p><strong>URL:</strong> <code className="bg-slate-950 px-2 py-1 rounded break-all">{uploadResult.url}</code></p>
                <p><strong>Public ID:</strong> <code className="bg-slate-950 px-2 py-1 rounded">{uploadResult.publicId}</code></p>
                {uploadResult.width && uploadResult.height && (
                  <p><strong>Dimensions:</strong> {uploadResult.width}x{uploadResult.height}px</p>
                )}
              </div>
            </div>

            {uploadResult.url && (
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <p className="mb-2 text-xs text-slate-400">Uploaded Image:</p>
                <img
                  src={uploadResult.url}
                  alt="Uploaded"
                  className="mx-auto max-h-64 rounded-lg border border-slate-700"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload History */}
      <div className="rounded-3xl border border-slate-800 bg-[#111111] p-6">
        <h2 className="text-xl font-semibold text-white">Notes</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-400 list-disc list-inside">
          <li>This page is only available in admin mode</li>
          <li>Test your Cloudinary configuration before using in production</li>
          <li>Check the browser console and server logs for detailed error messages</li>
          <li>Maximum file size is 10MB</li>
          <li>Supported formats: JPEG, PNG, WebP, GIF</li>
        </ul>
      </div>
    </div>
  )
}
