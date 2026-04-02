import { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api';
import { Link } from 'react-router-dom';
import { MapPin, Building, Search } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('Any Type');
  const [activeInquiry, setActiveInquiry] = useState(null);
  
  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await fetchProperties(searchLocation, searchType);
      setProperties(data);
    } catch(err) {
      console.error("Error fetching full listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container animate-in" style={{ marginTop: '4rem', minHeight: '60vh', paddingBottom: '4rem' }}>
      <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>The Portfolio</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '3rem', fontSize: '1.1rem' }}>Browse our exclusive collection of premium real estate.</p>
      
      {/* Dynamic Search Filters Toolbar */}
      <div className="glass" style={{
        padding: '1.5rem', borderRadius: '0', display: 'flex', gap: '1.5rem', marginBottom: '4rem', flexWrap: 'wrap',
        borderLeft: '4px solid var(--color-primary)'
      }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          <input type="text" placeholder="Search by Global Location..." value={searchLocation} onChange={e => setSearchLocation(e.target.value)} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0', border: '1px solid var(--color-border)', fontSize: '1rem' }} />
        </div>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
           <Building size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
           <select value={searchType} onChange={e => setSearchType(e.target.value)} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '1rem', appearance: 'none' }}>
              <option>Any Type</option>
              <option>Penthouse</option>
              <option>Villa</option>
              <option>Estate</option>
              <option>Mansion</option>
           </select>
        </div>
        <button onClick={loadListings} className="btn btn-primary" style={{ padding: '0 3rem', fontSize: '1rem', borderRadius: '0' }}><Search size={20} style={{marginRight: '0.5rem'}}/> Indulge</button>
      </div>

      {loading ? (
        <p style={{color: 'var(--color-text-light)', fontSize: '1.2rem', textAlign: 'center', padding: '4rem 0'}}>Searching the exclusive archives...</p>
      ) : properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-light)' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.2rem' }}>No listings matched your highly specific criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
          {properties.map(prop => (
             <div key={prop.id} className="glass hover-lift" style={{ borderRadius: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             
             {/* Cloud Image */}
             <div style={{ height: '240px', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                 {prop.image_url ? (
                   <img src={prop.image_url} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                   <span style={{color: 'var(--color-text-light)'}}>Classified Image</span>
                 )}
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, rgba(11,15,25,0.9))' }}></div>
                 <h3 style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', color: '#fff', fontSize: '1.5rem', fontWeight: 400 }}>{prop.title}</h3>
             </div>

             <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
               <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {prop.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Building size={16} /> {prop.type}</span>
               </p>
               <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                 <span style={{ fontWeight: 300, color: 'var(--color-primary)', fontSize: '1.2rem' }}>${prop.price.toLocaleString()}</span>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setActiveInquiry(prop)} className="btn" style={{ border: '1px solid var(--color-border)', padding: '0.5rem 1rem' }}>Inquire</button>
                    <Link to={`/listings/${prop.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Explore</Link>
                 </div>
               </div>
             </div>
           </div>
          ))}
        </div>
      )}

      {/* Inquiry Trigger Overlay */}
      {activeInquiry && (
         <InquiryModal propertyId={activeInquiry.id} propertyTitle={activeInquiry.title} onClose={() => setActiveInquiry(null)} />
      )}
    </div>
  );
}
