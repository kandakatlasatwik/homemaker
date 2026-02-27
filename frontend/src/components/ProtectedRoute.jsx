import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const [checked, setChecked] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setAllowed(false)
        setChecked(true)
        return
      }

      const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      try {
        const res = await fetch(`${api}/seller/me`, { headers: { Authorization: `Bearer ${token}` } })

        if (res.ok) {
          setAllowed(true)
        } else {
          localStorage.removeItem('access_token')
          setAllowed(false)
        }
      } catch (err) {
        setAllowed(false)
      } finally {
        setChecked(true)
      }
    }

    check()
  }, [])

  if (!checked) return null

  if (!allowed) {
    return <Navigate to="/login-page" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
