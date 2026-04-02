import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { createProperty } from '../services/api';

export default function Dashboard() {
  const { user, session } = useAuth();
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Property Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Villa');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    // Attempt standard sign in
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        // Fallback: If wrong credentials, attempt to sign them up quickly for smooth demo
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
           setAuthError(signUpError.message);
        } else {
           setAuthError("Account created! Check your email to confirm, or you may already be logged in.");
        }
      } else {
        setAuthError(error.message);
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateMsg('');
    
    try {
      if (!session) throw new Error("You must be signed in to post.");
      
      const payload = {
        title,
        price: parseFloat(price),
        location,
        type,
        description
      };
      
      // Pass the JWT Session token directly into the 
      await createProperty(payload, session.access_token);
      setCreateMsg("Property published successfully to the FastAPI & Redis!");
      setTitle(''); setPrice(''); setLocation(''); setDescription('');
    } catch (err) {
      setCreateMsg(`Error: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  // 1. Unauthenticated View
  if (!user) {
    return (
      <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Partner Access</h2>
          {authError && <p style={{color: 'red', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center'}}>{authError}</p>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
            <input 
              type="password" 
              placeholder="Secure Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
            <button type="submit" disabled={authLoading} className="btn btn-primary" style={{marginTop: '0.5rem'}}>
              {authLoading ? 'Authenticating Vault...' : 'Sign In / Register'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated View (The Dashboard)
  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <h1 className="title">Agent Dashboard</h1>
           <p style={{color: 'var(--color-text-light)'}}>Welcome back, {user.email}</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--color-border)' }}>Sign Out</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Add Property Form Panel */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>List a New Property</h2>
          
          {createMsg && (
             <div style={{
                padding: '1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)',
                backgroundColor: createMsg.includes('Error') ? '#fee2e2' : '#dcfce7',
                color: createMsg.includes('Error') ? '#991b1b' : '#166534'
             }}>
                 {createMsg}
             </div>
          )}

          <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Luxurious Title (e.g. Skyline Oasis)" value={title} onChange={e => setTitle(e.target.value)} required style={{flex: 2, minWidth: '200px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'}} />
              <input type="number" placeholder="Price (USD)" value={price} onChange={e => setPrice(e.target.value)} required style={{flex: 1, minWidth: '120px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'}} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Location Name" value={location} onChange={e => setLocation(e.target.value)} required style={{flex: 2, minWidth: '200px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'}} />
              <select value={type} onChange={e => setType(e.target.value)} style={{flex: 1, minWidth: '120px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent'}}>
                <option>Villa</option>
                <option>Penthouse</option>
                <option>Estate</option>
                <option>Mansion</option>
              </select>
            </div>

            <textarea 
              placeholder="Describe the premium features of this property..." 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required
              rows="5"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical' }}
            ></textarea>

            <button type="submit" disabled={createLoading} className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
              {createLoading ? 'Publishing to Network...' : 'Publish Property Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
