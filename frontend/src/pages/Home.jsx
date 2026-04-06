import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../services/api';
import { MapPin, Building } from 'lucide-react';

export default function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch(err) {
        console.error("Error fetching featured properties", err);
      }
    }
    load();
  }, []);

  return (
    <div>
      {/* Luxury Hero Section */}
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background Image with Dark Gradient Overlay */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'linear-gradient(to bottom, rgba(11,15,25,0.4) 0%, rgba(11,15,25,1) 100%), url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80) center/cover' 
        }}></div>
        
        <div className="container animate-in" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h1 className="title" style={{ fontSize: '5rem', color: '#fff', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            The Art of <br/><span className="luxury-text">Living.</span>
          </h1>
          <p style={{ fontSize: '1.35rem', color: 'var(--color-text-light)', maxWidth: '700px', margin: '0 auto 3.5rem auto', fontWeight: 300, letterSpacing: '0.02em' }}>
            Curating the World's Most Prestigious Real Estate Collections.
          </p>
          <Link to="/listings" className="btn btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '0.9rem', borderRadius: '0' }}>
            Explore the Collection
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <h2 className="title" style={{ fontSize: '2.5rem' }}>Featured Estates</h2>
          <Link to="/listings" style={{ color: 'var(--color-primary)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.9rem' }}>View All Collections &rarr;</Link>
        </div>
        
        {properties.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)' }}>Curating the gallery...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '3rem'
          }}>
            {properties.slice(0, 3).map((prop) => (
              <Link to={`/listings/${prop.id}`} key={prop.id} className="glass hover-lift" style={{ borderRadius: '0', overflow: 'hidden', display: 'block' }}>
                <div style={{ height: '300px', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {prop.image_url ? (
                    <img src={prop.image_url} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--color-text-light)' }}>No Imagery Available</span>
                  )}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', color: '#fff', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Featured
                  </div>
                </div>
                <div style={{ padding: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 300, letterSpacing: '-0.02em' }}>{prop.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> {prop.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Building size={14} color="var(--color-primary)" /> {prop.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                    <span className="luxury-text" style={{ fontSize: '1.5rem' }}>${prop.price.toLocaleString()}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.4rem 1rem', textTransform: 'uppercase' }}>Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
