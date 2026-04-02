import { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api';

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch(err) {
        console.error("Error fetching full listings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container" style={{ marginTop: '3rem', minHeight: '60vh' }}>
      <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Search Premium Properties</h1>
      
      {/* Search Filters Toolbar */}
      <div className="glass" style={{
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        gap: '1rem',
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        <input type="text" placeholder="Location..." style={{flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'}} />
        <select style={{padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent'}}>
           <option>Any Type</option>
           <option>Penthouse</option>
           <option>Villa</option>
           <option>Estate</option>
        </select>
        <button className="btn btn-primary" style={{padding: '0 2rem'}}>Search</button>
      </div>

      {loading ? (
        <p style={{color: 'var(--color-text-light)'}}>Loading premium catalog...</p>
      ) : properties.length === 0 ? (
        <p>No listings exist in the database.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {properties.map(prop => (
             <div key={prop.id} className="glass hover-lift" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
             <div style={{ height: '200px', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{color: 'var(--color-text-light)'}}>Property Image</span>
             </div>
             <div style={{ padding: '1.5rem' }}>
               <h3 style={{ marginBottom: '0.5rem' }}>{prop.title}</h3>
               <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>{prop.location} &bull; {prop.type}</p>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${prop.price.toLocaleString()}</span>
                 <button className="btn" style={{ border: '1px solid var(--color-border)' }}>View</button>
               </div>
             </div>
           </div>
          ))}
        </div>
      )}
    </div>
  );
}
