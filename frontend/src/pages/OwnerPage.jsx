import React, { useState, useEffect, useReducer, useCallback } from 'react'
import { Trash2, ArrowLeftCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['sofa', 'curtains', 'bedsheets', 'cushions', 'rugs', 'upholstery', 'other']

const initialForm = {
  name: '',
  category: 'curtains',
  price: '',
  color: '',
  stock: '',
}

function fabricsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const OwnerPage = () => {
  const theme = useTheme()
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState('curtains')

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // --- Fabric list state ---
  const [fabricsState, dispatch] = useReducer(fabricsReducer, {
    data: [],
    loading: false,
    error: null,
  })

  const [deletingIds, setDeletingIds] = useState([])

  const fetchFabrics = useCallback((category) => {
    dispatch({ type: 'FETCH_START' })
    fetch(`${api}/fabrics/?category=${encodeURIComponent(category)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products')
        return res.json()
      })
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((err) => dispatch({ type: 'FETCH_ERROR', payload: err.message }))
  }, [api])

  // Fetch on mount and when active category changes
  useEffect(() => {
    fetchFabrics(activeCategory)
  }, [activeCategory, fetchFabrics])

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const token = localStorage.getItem('access_token')
    setDeletingIds((p) => [...p, id])

    fetch(`${api}/fabrics/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed')
        // refresh list for current category
        fetchFabrics(activeCategory)
      })
      .catch((err) => {
        console.error(err)
        alert('Delete failed. Check console for details.')
      })
      .finally(() => setDeletingIds((p) => p.filter((x) => x !== id)))
  }

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

    // Append required fields. texture input was removed from the UI, use default.
    const DEFAULT_TEXTURE = 'silk'

    payload.append('name', form.name)
    payload.append('category', form.category)
    payload.append('price', Number(form.price))
    payload.append('color', form.color)
    payload.append('stock', Number(form.stock))
    payload.append('image', imageFile)

    const token = localStorage.getItem('access_token')

    fetch(`${api}/fabrics/`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: payload,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      })
      .then((data) => {
        console.log('Upload success', data)
        setSubmitted(true)
        setError('')
        setSubmitting(false)
        // Refresh the list for the submitted category so it appears immediately
        if (form.category === activeCategory) {
          fetchFabrics(activeCategory)
        } else {
          setActiveCategory(form.category)
        }
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

  const handleBack = () => window.history.back();

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col items-center px-4 py-12 transition-colors duration-300 pt-20`}>
      {/* Back Button */}
      <div className="w-full max-w-2xl flex items-center mt-2 mb-4">
        <button
          className={`flex items-center gap-2 ${theme.text} ${theme.isDark ? 'hover:text-amber-300' : 'hover:text-gray-500'} text-base font-medium px-2 py-1 rounded-lg transition-colors`}
          onClick={handleBack}
        >
          <ArrowLeftCircle size={22} />
          <span>Back</span>
        </button>
      </div>
      <div className={`animate-float-up w-full max-w-2xl ${theme.bgCard} rounded-2xl ${theme.shadowCard} overflow-hidden border ${theme.border} transition-colors duration-300`}>
        {/* Header */}
        <div className={`${theme.isDark ? 'bg-gray-900' : 'bg-gray-900'} px-8 py-6`}>
          <h1 className="text-2xl font-semibold text-white tracking-wide">Add New Product</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details to list a new fabric product.</p>
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
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
                Price (₹)
              </label>
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Product preview"
                  className="h-full w-full object-cover rounded-lg"
                />
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
            {imageFile && (
              <p className={`text-xs ${theme.textMuted} mt-1.5`}>{imageFile.name}</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Success */}
          {submitted && (
            <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              Product added successfully!
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${theme.isDark ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {submitting ? 'Uploading…' : 'Add Product'}
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

      {/* ─── Product Listing Section ─── */}
      <div className="w-full max-w-4xl mt-10">
        <h2 className={`text-xl font-semibold ${theme.text} mb-4 transition-colors duration-300`}>Your Products</h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? theme.isDark
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-gray-900 text-white border-gray-900'
                  : theme.isDark
                    ? 'bg-gray-900 text-gray-300 border-gray-700 hover:border-amber-400'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Fabric Grid */}
        {fabricsState.loading ? (
          <div className="flex justify-center py-12">
            <svg className={`animate-spin h-8 w-8 ${theme.textMuted}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : fabricsState.error ? (
          <p className="text-center text-red-400 py-6">{fabricsState.error}</p>
        ) : fabricsState.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {fabricsState.data.map((fabric, index) => (
              <div
                key={fabric.id}
                className={`animate-float-up relative group rounded-2xl overflow-hidden ${theme.shadowCard} hover:shadow-xl transition-shadow duration-300 ${theme.isDark ? 'bg-gray-900' : 'bg-white'} aspect-4/3 border ${theme.border}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={fabric.image}
                  alt={fabric.name}
                  className="w-full h-full object-cover"
                />

                {/* Delete button overlay */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(fabric.id); }}
                  disabled={deletingIds.includes(fabric.id)}
                  className="absolute top-2 right-2 z-20 bg-white/90 text-red-600 p-2.5 rounded-full shadow hover:bg-white hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label={`Delete ${fabric.name}`}
                  title="Delete product"
                >
                  {deletingIds.includes(fabric.id) ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>

                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 text-center">
                  <p className="text-base font-semibold tracking-wide">{fabric.name}</p>
                  <p className="text-xs mt-1 opacity-80">{fabric.color}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center ${theme.textMuted} py-8`}>No products in this category yet.</p>
        )}
      </div>
    </div>
  )
}

export default OwnerPage
