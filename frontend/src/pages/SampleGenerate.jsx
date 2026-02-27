import React from 'react'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import DisplayImageCard from '../components/ui/DisplayImageCard'

const SampleGenerate = () => {
  const payload = {
    base_image_url: 'https://via.placeholder.com/512',
    fabric_image_url: 'https://via.placeholder.com/512/ff7f7f',
    object_type: 'sofa'
  }

  return (
    <>
      <NavBar />
      <main style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
        <h2>Sample Image Generation</h2>
        <p>This page demonstrates generating an image via the backend `/generate` endpoint. The card will show a spinner while generating and until the image finishes loading.</p>

        <div style={{ marginTop: 16 }}>
          <DisplayImageCard backendUrl="/generate" generatePayload={payload} />
        </div>

        <p style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
          Tip: If your ImageGEN service is running on another origin, set `backendUrl` to the full URL (e.g. `http://localhost:8000/generate`) and ensure CORS is enabled.
        </p>
      </main>
      <Footer />
    </>
  )
}

export default SampleGenerate
