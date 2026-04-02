import { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api';
import InquiryModal from '../components/InquiryModal';

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('Any Type');

  // Modal State
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
    <div className="container" style={{ marginTop: '3rem', minHeight: '60vh' }}>
      <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Search Premium Properties</h1>
      
      {/* Dynamic Search Filters Toolbar */}
      <div className="glass" style={{
        padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap'
      }}>
        <input type="text" placeholder="Location..." value={searchLocation} onChange={e => setSearchLocation(e.target.value)} style={{flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'}} />
        <select value={searchType} onChange={e => setSearchType(e.target.value)} style={{padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent'}}>
           <option>Any Type</option>
           <option>Penthouse</option>
           <option>Villa</option>
           <option>Estate</option>
           <option>Apartment</option>
        </select>
        <button onClick={loadListings} className="btn btn-primary" style={{padding: '0 2rem'}}>Search</button>
      </div>

      {loading ? (
        <p style={{color: 'var(--color-text-light)'}}>Searching premium catalog...</p>
      ) : properties.length === 0 ? (
        <p>No listings matched your exclusive criteria.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {properties.map(prop => (
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
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${prop.price.toLocaleString()}</span>
                 <button onClick={() => setActiveInquiry(prop)} className="btn btn-primary">Contact Agent</button>
               </div>
             </div>
           </div>
          ))}
        </div>
      )}

      {/* Inquiry Trigger Overlay */}
      {activeInquiry && (
         <InquiryModal 
            propertyId={activeInquiry.id} 
            propertyTitle={activeInquiry.title} 
            onClose={() => setActiveInquiry(null)} 
         />
      )}
    </div>
  );
}
