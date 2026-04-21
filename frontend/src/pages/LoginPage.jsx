import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import { useTheme } from '../context/ThemeContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginRole, setLoginRole] = useState('seller') // 'seller' = owner, 'assistant'
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regMsg, setRegMsg] = useState({ type: '', text: '' })
  const [registering, setRegistering] = useState(false)
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

    const api = import.meta.env.VITE_API_URL || 'https://homemakerbackend.onrender.com'
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

      // Validate that the role matches what the user selected
      if (data.role !== loginRole) {
        const expectedLabel = loginRole === 'seller' ? 'Owner' : 'Assistant'
        const actualLabel = data.role === 'seller' ? 'Owner' : 'Assistant'
        setErrors({ general: `You selected "${expectedLabel}" but this account is registered as "${actualLabel}". Please switch the role and try again.` })
        setSubmitting(false)
        return
      }

      // store token and role, then navigate based on role
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user_role', data.role || 'seller')
      
      // Redirect based on role
      const defaultRedirect = data.role === 'assistant' ? '/assistant' : '/owner'
      const redirectTo = location.state?.from || defaultRedirect
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
      <div className={`flex items-center justify-center px-6 pt-24 pb-12 gap-6 ${loginRole === 'assistant' && showRegister ? 'flex-row flex-wrap' : ''}`} style={{ minHeight: '70vh' }}>
        <form onSubmit={handleSubmit} className={`w-full max-w-[420px] p-6 rounded-lg ${theme.bgCard} ${theme.shadowCard} border ${theme.border} flex flex-col transition-colors duration-300 ${loginRole === 'assistant' && showRegister ? 'self-start' : ''}`} aria-labelledby="login-heading">
          <div className="flex items-center gap-3 mb-2">
            <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className={`bg-transparent border-none ${theme.text} text-sm cursor-pointer px-2 py-1.5`}>
              ← Back
            </button>
            <h2 id="login-heading" className={`m-0 mb-4 text-xl font-semibold ${theme.text}`}>Welcome back</h2>
          </div>

          {/* Role Toggle */}
          <div className="mb-5">
            <label className={`block text-[13px] mb-2 ${theme.textSecondary}`}>Login as</label>
            <div className={`flex rounded-lg border ${theme.border} overflow-hidden`}>
              <button
                type="button"
                onClick={() => { setLoginRole('seller'); setErrors({}) }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  loginRole === 'seller'
                    ? theme.isDark
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-900 text-white'
                    : `${theme.bgInput} ${theme.textSecondary}`
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => { setLoginRole('assistant'); setErrors({}) }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  loginRole === 'assistant'
                    ? theme.isDark
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-900 text-white'
                    : `${theme.bgInput} ${theme.textSecondary}`
                }`}
              >
                Assistant
              </button>
            </div>
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
            {submitting ? 'Signing in…' : loginRole === 'seller' ? 'Sign in as Owner' : 'Sign in as Assistant'}
          </button>

          <div className={`mt-3 text-[13px] ${theme.textMuted} text-center`}>
            {loginRole === 'seller'
              ? 'Logging in as Owner — uploads go live directly'
              : 'Logging in as Assistant — uploads need owner approval'}
          </div>

          {loginRole === 'assistant' && (
            <div className={`mt-4 pt-4 border-t ${theme.border}`}>
              <button
                type="button"
                onClick={() => { setShowRegister(!showRegister); setRegMsg({ type: '', text: '' }) }}
                className={`w-full text-center text-[13px] font-medium ${theme.isDark ? 'text-amber-400 hover:text-amber-300' : 'text-gray-700 hover:text-gray-900'} transition cursor-pointer bg-transparent border-none`}
              >
                {showRegister ? 'Already have an account? Login' : "Don't have an account? Register as Assistant"}
              </button>
            </div>
          )}
        </form>

        {/* Assistant Registration Form */}
        {loginRole === 'assistant' && showRegister && (
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
                setRegMsg({ type: 'error', text: 'All fields are required' })
                return
              }
              if (regPassword.length < 6) {
                setRegMsg({ type: 'error', text: 'Password must be at least 6 characters' })
                return
              }
              setRegistering(true)
              const api = import.meta.env.VITE_API_URL || 'https://homemakerbackend.onrender.com'
              try {
                const res = await fetch(`${api}/seller/register-assistant-self`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.detail || 'Registration failed')
                setRegMsg({ type: 'success', text: 'Registered! You can now login as Assistant.' })
                setRegName(''); setRegEmail(''); setRegPassword('')
              } catch (err) {
                setRegMsg({ type: 'error', text: err.message })
              } finally {
                setRegistering(false)
              }
            }}
            className={`w-full max-w-[420px] p-6 rounded-lg ${theme.bgCard} ${theme.shadowCard} border ${theme.border} flex flex-col transition-colors duration-300 self-start`}
          >
            <h3 className={`text-lg font-semibold ${theme.text} mb-3`}>Register as Assistant</h3>

            <label className={`text-[13px] mb-1.5 ${theme.textSecondary}`}>Name</label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className={`px-3 py-2.5 text-sm rounded-md border ${theme.border} ${theme.bgInput} ${theme.text} outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
              placeholder="Your name"
            />

            <label className={`text-[13px] mb-1.5 mt-3 ${theme.textSecondary}`}>Email</label>
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className={`px-3 py-2.5 text-sm rounded-md border ${theme.border} ${theme.bgInput} ${theme.text} outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
              placeholder="assistant@example.com"
            />

            <label className={`text-[13px] mb-1.5 mt-3 ${theme.textSecondary}`}>Password</label>
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className={`px-3 py-2.5 text-sm rounded-md border ${theme.border} ${theme.bgInput} ${theme.text} outline-none focus:ring-2 ${theme.isDark ? 'focus:ring-amber-500' : 'focus:ring-gray-900'} transition`}
              placeholder="Min 6 characters"
            />

            {regMsg.text && (
              <div className={`text-sm mt-3 px-3 py-2.5 rounded-md text-center ${
                regMsg.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
              }`}>{regMsg.text}</div>
            )}

            <button
              type="submit"
              disabled={registering}
              className={`mt-4 px-3.5 py-2.5 rounded-md border-none font-semibold cursor-pointer transition ${theme.isDark ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {registering ? 'Registering\u2026' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage
