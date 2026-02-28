import React, { useState } from 'react'

const CATEGORIES = ['curtains', 'bedsheets', 'cushions', 'rugs', 'upholstery', 'sofa', 'other']

const initialForm = {
  name: '',
  category: 'curtains',
  price: '',
  color: '',
  stock: '',
}

const OwnerPage = () => {
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

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
    const payload = new FormData()
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    // Append required fields. texture input was removed from the UI, use default.
    const DEFAULT_TEXTURE = 'silk'

    payload.append('name', form.name)
    payload.append('category', form.category)
    payload.append('price', Number(form.price))
    payload.append('color', form.color)
    payload.append('texture', DEFAULT_TEXTURE)
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
      })
      .catch((err) => {
        console.error(err)
        setError('Upload failed. Please try again.')
        setSubmitted(false)
      })
  }

  const handleReset = () => {
    setForm(initialForm)
    setImageFile(null)
    setPreview('')
    setSubmitted(false)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black px-8 py-6">
          <h1 className="text-2xl font-semibold text-white tracking-wide">Add New Product</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details to list a new fabric product.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {/* Owner Name removed */}
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Luxury Silk Curtain"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 2500"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="e.g. gold"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black hover:bg-gray-50 transition">
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
                <div className="flex flex-col items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a3 3 0 014.243 0L16 16m-2-2l1.586-1.586a3 3 0 014.242 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Click to upload an image</span>
                  <span className="text-xs mt-1">PNG, JPG, WEBP up to 10MB</span>
                </div>
              )}
            </label>
            {imageFile && (
              <p className="text-xs text-gray-500 mt-1.5">{imageFile.name}</p>
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
              className="flex-1 bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-900 transition"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OwnerPage
