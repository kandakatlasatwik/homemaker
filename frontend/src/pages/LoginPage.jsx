import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()

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
    <div>
      <NavBar />
      <div style={styles.page}>
        <form onSubmit={handleSubmit} style={styles.card} aria-labelledby="login-heading">
        <div style={styles.headerRow}>
          <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} style={styles.backButton}>
            ← Back
          </button>
          <h2 id="login-heading" style={styles.heading}>Welcome back</h2>
        </div>

        <label style={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <div style={styles.error}>{errors.email}</div>}

        <label style={{ ...styles.label, marginTop: 12 }} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && <div style={styles.error}>{errors.password}</div>}

        <div style={styles.row}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" style={styles.checkbox} /> Remember me
          </label>
        </div>

        {errors.general && <div style={styles.generalError}>{errors.general}</div>}

        <button type="submit" style={styles.button} disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <div style={styles.footerText}> login is only for owner</div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 96,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    margin: 0,
    marginBottom: 18,
    fontSize: 20,
    fontWeight: 600,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#111827',
    fontSize: 14,
    cursor: 'pointer',
    padding: '6px 8px',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    padding: '10px 12px',
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    marginTop: 18,
    padding: '10px 14px',
    borderRadius: 6,
    border: 'none',
    background: '#111827',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    color: '#b00020',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  generalError: {
    color: '#b00020',
    fontSize: 14,
    marginTop: 12,
    padding: '10px 12px',
    background: '#ffebee',
    borderRadius: 6,
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxLabel: {
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
  },
  footerText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
}

export default LoginPage
