import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Page not found — the route you're looking for doesn't exist.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="px-4 py-2 bg-black text-white rounded-lg">Go home</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
