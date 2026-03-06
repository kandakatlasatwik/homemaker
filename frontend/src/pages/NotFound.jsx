import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NotFound = () => {
  const theme = useTheme()
  return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center px-4 py-12 transition-colors duration-300`}>
      <div className={`max-w-xl w-full ${theme.bgCard} rounded-2xl ${theme.shadowCard} border ${theme.border} p-8 text-center transition-colors duration-300`}>
        <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>404</h1>
        <p className={`text-lg ${theme.textSecondary} mb-6`}>Page not found — the route you're looking for doesn't exist.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className={`px-4 py-2 rounded-lg transition ${theme.isDark ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>Go home</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
