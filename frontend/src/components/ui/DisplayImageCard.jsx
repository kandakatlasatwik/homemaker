import React, { useEffect, useState, useRef } from 'react'

const DEFAULT_POLL_INTERVAL = 2000
const DEFAULT_MAX_ATTEMPTS = 12

const DisplayImageCard = ({ imageId, backendUrl = '/api/image', alt = 'Generated', className = '', style = {}, generatePayload = null }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [src, setSrc] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const attempts = useRef(0)
  const objectUrlRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const cleanupObjectUrl = () => {
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current)
        } catch {
          // ignore
        }
        objectUrlRef.current = null
      }
    }

    const fetchImage = async () => {
      attempts.current += 1
      try {
        // If a generate payload is provided, POST to backendUrl (e.g., '/generate')
        if (generatePayload) {
          const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(generatePayload)
          })

          if (cancelled) return

          if (!res.ok) {
            const text = await res.text()
            throw new Error(text || res.statusText || 'failed to generate image')
          }

          const json = await res.json()
          const b64 = json.image_base64 || json.imageBase64 || json.image || (json.data && (json.data.image_base64 || json.data.imageBase64))
          if (!b64) throw new Error('no image_base64 in response')
          cleanupObjectUrl()
          const url = `data:image/png;base64,${b64}`
          objectUrlRef.current = url
          setSrc(url)
          setImgLoaded(false)
          setLoading(false)
          setError(null)
          return
        }

        // Otherwise, require imageId and use GET/poll flow
        if (!imageId) {
          setError('no imageId provided')
          setLoading(false)
          return
        }

        const resGet = await fetch(`${backendUrl}/${encodeURIComponent(imageId)}`, { method: 'GET' })

        if (cancelled) return

        if (resGet.status === 202) {
          // Image not ready yet, poll again
          if (attempts.current < DEFAULT_MAX_ATTEMPTS) {
            setLoading(true)
            setTimeout(fetchImage, DEFAULT_POLL_INTERVAL)
            return
          }
          throw new Error('image generation timed out')
        }

        if (!resGet.ok) {
          const text = await resGet.text()
          throw new Error(text || resGet.statusText || 'failed to fetch image')
        }

        const contentType = resGet.headers.get('content-type') || ''
        if (contentType.startsWith('image/')) {
          const blob = await resGet.blob()
          cleanupObjectUrl()
          const url = URL.createObjectURL(blob)
          objectUrlRef.current = url
          setSrc(url)
          setImgLoaded(false)
          setLoading(false)
          setError(null)
          return
        }

        const json = await resGet.json()
        const base64 = json.image_base64 || json.imageBase64 || json.imageBase64
        if (base64) {
          cleanupObjectUrl()
          const url = `data:image/png;base64,${base64}`
          objectUrlRef.current = url
          setSrc(url)
          setImgLoaded(false)
          setLoading(false)
          setError(null)
          return
        }

        throw new Error('unexpected response format')
      } catch (err) {
        if (cancelled) return
        if (attempts.current < DEFAULT_MAX_ATTEMPTS && /timed out|not ready/i.test(err.message) === false) {
          // If network error, retry a few times
          setTimeout(fetchImage, DEFAULT_POLL_INTERVAL)
          return
        }
        setError(err.message || 'unknown error')
        setLoading(false)
      }
    }

    attempts.current = 0
    fetchImage()

    return () => {
      cancelled = true
      cleanupObjectUrl()
    }
  }, [imageId, backendUrl, generatePayload])

  return (
    <div className={`display-image-card ${className}`} style={{ position: 'relative', minHeight: 160, ...style }}>
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div aria-hidden style={{ textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" stroke="#ddd" strokeWidth="5" fill="none" opacity="0.6" />
              <path d="M25 5 A20 20 0 0 1 45 25" stroke="#666" strokeWidth="5" fill="none">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
              </path>
            </svg>
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Generating image…</div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div style={{ padding: 12, color: '#b00020' }}>Error: {error}</div>
      )}

      {!loading && !error && src && (
        <div style={{ position: 'relative' }}>
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setError('failed to load image')
              setLoading(false)
            }}
          />

          {(!imgLoaded || loading) && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))', borderRadius: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" stroke="#ddd" strokeWidth="4" fill="none" opacity="0.6" />
                  <path d="M25 5 A20 20 0 0 1 45 25" stroke="#666" strokeWidth="4" fill="none">
                    <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                  </path>
                </svg>
                <div style={{ fontSize: 12, color: '#333', marginTop: 8 }}>{loading ? 'Generating image…' : 'Rendering image…'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DisplayImageCard
