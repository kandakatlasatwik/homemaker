import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeftCircle, Clock, CheckCircle2, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['sofa', 'curtains', 'bedsheets', 'cushions', 'rugs', 'upholstery', 'other']

const initialForm = {
  name: '',
  category: 'curtains',
  price: '',
  color: '',
  stock: '',
}

const AssistantPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // --- Submissions list ---
  const [submissions, setSubmissions] = useState([])
  const [subsLoading, setSubsLoading] = useState(false)

  const fetchSubmissions = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    setSubsLoading(true)
    fetch(`${api}/pending/my-submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((data) => setSubmissions(data))
      .catch(() => setSubmissions([]))
      .finally(() => setSubsLoading(false))
  }, [api])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitted(false)
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setSubmitted(false)
    setError('')
  }

  const validate = () => {
    if (!form.name.trim()) return 'Product name is required.'
    if (form.price && (isNaN(form.price) || Number(form.price) < 0)) return 'Enter a valid price.'
    if (!form.color.trim()) return 'Color is required.'
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) return 'Enter a valid stock quantity.'
    if (!imageFile) return 'Please upload a product image.'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setSubmitting(true)

    const payload = new FormData()
    payload.append('name', form.name)
    payload.append('category', form.category)
    payload.append('price', Number(form.price))
    payload.append('color', form.color)
    payload.append('stock', Number(form.stock))
    payload.append('image', imageFile)

    const token = localStorage.getItem('access_token')

    fetch(`${api}/pending/`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: payload,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      })
      .then(() => {
        setSubmitted(true)
        setError('')
        setSubmitting(false)
        fetchSubmissions()
      })
      .catch((err) => {
        console.error(err)
        setError('Upload failed. Please try again.')
        setSubmitted(false)
        setSubmitting(false)
      })
  }

  const handleReset = () => {
    setForm(initialForm)
    setImageFile(null)
    setPreview('')
    setSubmitted(false)
    setError('')
  }

  const handleBack = () => window.history.back()

  const handleLogout = async () => {
    if (!window.confirm('Logging out will delete your assistant account. Are you sure?')) return
    const token = localStorage.getItem('access_token')
    try {
      await fetch(`${api}/seller/delete-account`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch (err) {
      // proceed with logout even if delete fails
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_role')
    navigate('/login-page', { replace: true })
  }

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col items-center px-4 py-12 transition-colors duration-300 pt-20`}>
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mt-2 mb-4">
        <button
          className={`flex items-center gap-2 ${theme.text} ${theme.isDark ? 'hover:text-amber-300' : 'hover:text-gray-500'} text-base font-medium px-2 py-1 rounded-lg transition-colors`}
          onClick={handleBack}
        >
          <ArrowLeftCircle size={22} />
          <span>Back</span>
        </button>
        <button
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition ${theme.isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Upload Form */}
      <div className={`animate-float-up w-full max-w-2xl ${theme.bgCard} rounded-2xl ${theme.shadowCard} overflow-hidden border ${theme.border} transition-colors duration-300`}>
        <div className={`bg-gray-900 px-8 py-6`}>
          <h1 className="text-2xl font-semibold text-white tracking-wide">Submit Fabric for Approval</h1>
          <p className="text-gray-400 text-sm mt-1">Upload a fabric product. It will be sent to the owner for approval.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {/* Product Name */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Luxury Silk Curtain"
              className={`w-full border ${theme.border} rounded-lg px-4 py-2.5 text-sm ${theme.bgInput} ${theme.text} focus:outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full border ${theme.border} rounded-lg px-4 py-2.5 text-sm ${theme.bgInput} ${theme.text} focus:outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 2500"
                min="0"
                className={`w-full border ${theme.border} rounded-lg px-4 py-2.5 text-sm ${theme.bgInput} ${theme.text} focus:outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="0"
                className={`w-full border ${theme.border} rounded-lg px-4 py-2.5 text-sm ${theme.bgInput} ${theme.text} focus:outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="e.g. gold"
              className={`w-full border ${theme.border} rounded-lg px-4 py-2.5 text-sm ${theme.bgInput} ${theme.text} focus:outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Product Image <span className="text-red-500">*</span>
            </label>
            <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed ${theme.border} rounded-lg cursor-pointer ${theme.isDark ? 'hover:border-amber-400 hover:bg-gray-800' : 'hover:border-gray-900 hover:bg-gray-50'} transition`}>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className={`flex flex-col items-center ${theme.textMuted}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a3 3 0 014.243 0L16 16m-2-2l1.586-1.586a3 3 0 014.242 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Click to upload an image</span>
                  <span className="text-xs mt-1">PNG, JPG, WEBP up to 10MB</span>
                </div>
              )}
            </label>
            {imageFile && <p className={`text-xs ${theme.textMuted} mt-1.5`}>{imageFile.name}</p>}
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
          )}
          {submitted && (
            <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              Fabric submitted for owner approval!
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${theme.isDark ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {submitting ? 'Submitting…' : 'Submit for Approval'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={`flex-1 border ${theme.border} ${theme.textSecondary} rounded-lg py-2.5 text-sm font-medium ${theme.bgHover} transition`}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* ─── My Submissions ─── */}
      <div className="w-full max-w-4xl mt-10">
        <h2 className={`text-xl font-semibold ${theme.text} mb-4 transition-colors duration-300`}>My Submissions</h2>

        {subsLoading ? (
          <div className="flex justify-center py-12">
            <svg className={`animate-spin h-8 w-8 ${theme.textMuted}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : submissions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {submissions.map((item, index) => (
              <div
                key={item.id}
                className={`animate-float-up relative rounded-2xl overflow-hidden ${theme.shadowCard} hover:shadow-xl transition-shadow duration-300 ${theme.isDark ? 'bg-gray-900' : 'bg-white'} border ${theme.border}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-4/3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Status badge */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'approved'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-500'
                }`}>
                  {item.status === 'approved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {item.status === 'approved' ? 'Approved' : 'Pending'}
                </div>

                <div className={`p-3 ${theme.isDark ? 'bg-gray-900' : 'bg-white'}`}>
                  <p className={`text-base font-semibold ${theme.text}`}>{item.name}</p>
                  <p className={`text-xs ${theme.textMuted} mt-0.5`}>{item.category} &bull; {item.color}</p>
                  <p className={`text-xs ${theme.textMuted}`}>Price: ₹{item.price} &bull; Stock: {item.stock}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center ${theme.textMuted} py-8`}>No submissions yet. Upload a fabric above!</p>
        )}
      </div>
    </div>
  )
}

export default AssistantPage
