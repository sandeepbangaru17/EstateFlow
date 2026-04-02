import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyById } from '../services/api';
import { MapPin, Building, ArrowLeft } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeInquiry, setActiveInquiry] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="container animate-in" style={{ marginTop: '10rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-text-light)' }}>Bypassing security protocols...</div>;
  if (!property) return <div className="container" style={{ marginTop: '10rem', textAlign: 'center' }}>Asset Not Found or Highly Classified.</div>;

  return (
    <div className="animate-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Image Section */}
      <div style={{ height: '65vh', position: 'relative', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
        {property.image_url ? (
           <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{color: 'var(--color-text-light)'}}>Imagery Unavailable</span></div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(11,15,25,1) 0%, rgba(11,15,25,0.1) 60%)' }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0 }}>
           <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', transition: 'color 0.2s' }}><ArrowLeft size={16} /> Back to Gallery</Link>
           <h1 className="title" style={{ fontSize: '4.5rem', color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{property.title}</h1>
           <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-light)', fontSize: '1.1rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={20} /> {property.location}</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={20} /> {property.type}</span>
           </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '4rem', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '300px' }}>
           <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: 300, color: 'var(--color-primary)' }}>The Details</h3>
           <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontWeight: 300 }}>
             {property.description}
           </p>
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
           <div className="glass" style={{ padding: '2.5rem', borderRadius: '0', position: 'sticky', top: '100px', borderTop: '4px solid var(--color-primary)' }}>
             <p style={{ color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Offered At</p>
             <h2 style={{ fontSize: '3rem', fontWeight: 300, color: '#fff', marginBottom: '2.5rem' }}>${property.price.toLocaleString()}</h2>
             <button onClick={() => setActiveInquiry(true)} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>Request Private Showing</button>
           </div>
        </div>
      </div>

      {activeInquiry && <InquiryModal propertyId={property.id} propertyTitle={property.title} onClose={() => setActiveInquiry(false)} />}
    </div>
  );
}
