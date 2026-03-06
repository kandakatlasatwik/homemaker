import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import { useTheme } from '../context/ThemeContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const theme = useTheme()

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const navigate = useNavigate()

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    console.log('Attempting login to:', `${api}/seller/login`)
    try {
      const body = new URLSearchParams()
      body.append('username', email)
      body.append('password', password)

      const res = await fetch(`${api}/seller/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Login failed' }))
        setErrors({ general: err.detail || 'Login failed' })
        setSubmitting(false)
        return
      }

      const data = await res.json()
      // store token and navigate to owner page
      localStorage.setItem('access_token', data.access_token)
      
      // Redirect to the originally requested page or default to /owner
      const redirectTo = location.state?.from || '/owner'
      navigate(redirectTo, { replace: true })

    } catch (err) {
      setErrors({ general: 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 pt-20`}>
      <NavBar />
      <div className="flex items-center justify-center px-6 pt-24 pb-12" style={{ minHeight: '70vh' }}>
        <form onSubmit={handleSubmit} className={`w-full max-w-[420px] p-6 rounded-lg ${theme.bgCard} ${theme.shadowCard} border ${theme.border} flex flex-col transition-colors duration-300`} aria-labelledby="login-heading">
          <div className="flex items-center gap-3 mb-2">
            <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className={`bg-transparent border-none ${theme.text} text-sm cursor-pointer px-2 py-1.5`}>
              ← Back
            </button>
            <h2 id="login-heading" className={`m-0 mb-4 text-xl font-semibold ${theme.text}`}>Welcome back</h2>
          </div>

          <label className={`text-[13px] mb-1.5 ${theme.textSecondary}`} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`px-3 py-2.5 text-sm rounded-md border ${theme.border} ${theme.bgInput} ${theme.text} outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <div className="text-red-500 text-[13px] mt-1.5 mb-1.5">{errors.email}</div>}

          <label className={`text-[13px] mb-1.5 mt-3 ${theme.textSecondary}`} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`px-3 py-2.5 text-sm rounded-md border ${theme.border} ${theme.bgInput} ${theme.text} outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password && <div className="text-red-500 text-[13px] mt-1.5 mb-1.5">{errors.password}</div>}

          <div className="flex items-center justify-between mt-2.5">
            <label className={`text-[13px] flex items-center gap-2 ${theme.textSecondary}`}>
              <input type="checkbox" className="w-3.5 h-3.5" /> Remember me
            </label>
          </div>

          {errors.general && <div className="text-red-500 text-sm mt-3 px-3 py-2.5 bg-red-50 rounded-md text-center">{errors.general}</div>}

          <button type="submit" className={`mt-4 px-3.5 py-2.5 rounded-md border-none font-semibold cursor-pointer transition ${theme.isDark ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-900 text-white hover:bg-gray-800'}`} disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className={`mt-3 text-[13px] ${theme.textMuted} text-center`}>login is only for owner</div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
