import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../services/api';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch real data from FastAPI
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--color-text)',
        color: 'white',
        padding: '6rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Find Your Next Premium Horizon</h1>
          <p style={{ color: 'var(--color-border)', fontSize: '1.25rem', marginBottom: '2rem' }}>
            Experience real estate management redefined with AI-driven insights and curated listings.
          </p>
          <Link to="/listings" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Browse Exclusive Listings
          </Link>
        </div>
      </section>

      {/* Featured Properties Feed */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Featured Properties</h2>
        
        {loading ? (
          <p style={{fontStyle: 'italic', color: 'var(--color-text-light)'}}>Loading premium listings from our servers...</p>
        ) : properties.length === 0 ? (
          <div className="glass" style={{padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)'}}>
            <h3>No properties found</h3>
            <p>Go to your FastAPI Swagger UI to post your first property!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {properties.slice(0, 6).map((prop) => (
              <div key={prop.id} className="glass hover-lift" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {/* Cloud Image Rendering */}
                <div style={{ height: '200px', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {prop.image_url ? (
                    <img src={prop.image_url} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{color: 'var(--color-text-light)'}}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{prop.title}</h3>
                  <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>{prop.location} &bull; {prop.type}</p>
                  <p style={{ color: 'var(--color-text)', marginBottom: '1rem', height: '3rem', overflow: 'hidden' }}>{prop.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${prop.price.toLocaleString()}</span>
                    <button className="btn" style={{ border: '1px solid var(--color-border)' }}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
