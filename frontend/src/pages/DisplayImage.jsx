import React, { useState, useEffect } from 'react'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import DisplayImageCard from '../components/ui/DisplayImageCard'
import SofaImg from '../assets/images/Sofa.png'
import { useLocation } from 'react-router-dom'

const OBJECT_TYPES = ['sofa', 'bed', 'curtain', 'carpet', 'cushion']

const DisplayImage = () => {
  const [baseImageUrl, setBaseImageUrl] = useState(SofaImg)
  const [fabricImageUrl, setFabricImageUrl] = useState('https://via.placeholder.com/512/ff7f7f')
  const [objectType, setObjectType] = useState('sofa')
  const [payload, setPayload] = useState(null)
  const [backendUrl, setBackendUrl] = useState('/generate')
  const location = useLocation()

  useEffect(() => {
    if (location && location.state) {
      const s = location.state
      if (s.base_image_url) setBaseImageUrl(s.base_image_url)
      if (s.fabric_image_url) setFabricImageUrl(s.fabric_image_url)
      if (s.object_type) setObjectType(s.object_type)
      if (s.backendUrl) setBackendUrl(s.backendUrl)
      // Immediately set payload to trigger generation in DisplayImageCard
      setPayload({ base_image_url: s.base_image_url || SofaImg, fabric_image_url: s.fabric_image_url || fabricImageUrl, object_type: s.object_type || objectType })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const handleGenerate = (e) => {
    e.preventDefault()
    setPayload({ base_image_url: baseImageUrl, fabric_image_url: fabricImageUrl, object_type: objectType })
  }

  return (
    <>
      <NavBar />
      <main style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
        <h2>Generate / Preview Image</h2>

        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Base Image URL</label>
            <input value={baseImageUrl} onChange={(e) => setBaseImageUrl(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Fabric Image URL</label>
            <input value={fabricImageUrl} onChange={(e) => setFabricImageUrl(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Object Type</label>
            <select value={objectType} onChange={(e) => setObjectType(e.target.value)} style={{ width: '100%' }}>
              {OBJECT_TYPES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Backend `/generate` URL</label>
            <input value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={{ padding: '8px 16px' }}>Generate</button>
          </div>
        </form>

        <section style={{ marginTop: 20 }}>
          <DisplayImageCard backendUrl={backendUrl} generatePayload={payload} />
        </section>
      </main>
      <Footer />
    </>
  )
}

export default DisplayImage
