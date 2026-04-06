import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { createProperty, fetchInquiries, fetchProperties, deleteProperty } from '../services/api';
import { LayoutDashboard, Users, Building, Trash2, Mail, ExternalLink } from 'lucide-react';

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
  const [imageFile, setImageFile] = useState(null);
  
  const [createLoading, setCreateLoading] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  // Dashboard Data state
  const [inquiries, setInquiries] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, inquiries, post

  const loadDashboardData = async () => {
    if (!session) return;
    setDataLoading(true);
    try {
      const [inqData, propData] = await Promise.all([
        fetchInquiries(session.access_token),
        fetchProperties() // Simplified: fetching all for demo
      ]);
      setInquiries(inqData);
      setMyProperties(propData);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

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
      
      let imageUrl = null;
      if (imageFile) {
        setCreateMsg("Uploading high-res image to the cloud...");
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('property-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);
        
        const { data: publicUrlData } = supabase.storage.from('property-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
      
      setCreateMsg("Publishing listing to database...");
      const payload = {
        title,
        price: parseFloat(price),
        location,
        type,
        description,
        image_url: imageUrl
      };
      
      // Pass the JWT Session token directly into the API
      await createProperty(payload, session.access_token);
      setCreateMsg("Property published successfully to the FastAPI & Redis!");
      setTitle(''); setPrice(''); setLocation(''); setDescription(''); setImageFile(null);
    } catch (err) {
      setCreateMsg(`Error: ${err.message}`);
    } finally {
      setCreateLoading(false);
      loadDashboardData(); // Refresh list after adding
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to archive this listing forever?")) return;
    try {
      await deleteProperty(id, session.access_token);
      loadDashboardData();
    } catch (err) {
      alert("Failed to archive: " + err.message);
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

  // 2. Authenticated View (The Platinum Command Center)
  return (
    <div className="container" style={{ marginTop: '3rem', paddingBottom: '6rem' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
        <div>
           <h1 className="title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Platinum Command</h1>
           <p style={{color: 'var(--color-text-light)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem'}}>Access Granted: <span style={{color: 'var(--color-primary)'}}>{user.email}</span></p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--color-border)', borderRadius: '0', padding: '0.75rem 2rem' }}>Deactivate Session</button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
           <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Active Portfolio</p>
           <h2 className="luxury-text" style={{ fontSize: '2.5rem' }}>{myProperties.length} <span style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--color-text-light)' }}>Estates</span></h2>
        </div>
        <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid #fff' }}>
           <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Pending Leads</p>
           <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>{inquiries.length} <span style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--color-text-light)' }}>Inquiries</span></h2>
        </div>
        <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
           <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Network Status</p>
           <h2 className="luxury-text" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Operational</h2>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={() => setActiveTab('inventory')} style={{ padding: '1rem 0', color: activeTab === 'inventory' ? 'var(--color-primary)' : 'var(--color-text-light)', borderBottom: activeTab === 'inventory' ? '2px solid var(--color-primary)' : 'none', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>Inventory</button>
        <button onClick={() => setActiveTab('inquiries')} style={{ padding: '1rem 0', color: activeTab === 'inquiries' ? 'var(--color-primary)' : 'var(--color-text-light)', borderBottom: activeTab === 'inquiries' ? '2px solid var(--color-primary)' : 'none', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>Leads</button>
        <button onClick={() => setActiveTab('post')} style={{ padding: '1rem 0', color: activeTab === 'post' ? 'var(--color-primary)' : 'var(--color-text-light)', borderBottom: activeTab === 'post' ? '2px solid var(--color-primary)' : 'none', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>New Listing</button>
      </div>

      {/* Main Content Area */}
      <div className="animate-in">
        
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {myProperties.length === 0 ? (
               <p style={{color: 'var(--color-text-light)', textAlign: 'center', padding: '4rem'}}>No assets currently in the cloud.</p>
            ) : (
               myProperties.map(prop => (
                 <div key={prop.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                   <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                     <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
                        {prop.image_url ? <img src={prop.image_url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Building size={20}/></div>}
                     </div>
                     <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{prop.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{prop.location} • <span style={{color: 'var(--color-primary)'}}>${prop.price.toLocaleString()}</span></p>
                     </div>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <Link to={`/listings/${prop.id}`} className="btn" style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}><ExternalLink size={14}/></Link>
                      <button onClick={() => handleDelete(prop.id)} className="btn" style={{ padding: '0.5rem 1rem', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.8rem' }}><Trash2 size={14}/></button>
                   </div>
                 </div>
               ))
            )}
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {inquiries.length === 0 ? (
               <p style={{color: 'var(--color-text-light)', textAlign: 'center', padding: '4rem'}}>No leads detected in the secure channel.</p>
            ) : (
               inquiries.map(inq => (
                 <div key={inq.id} className="glass" style={{ padding: '2rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Property Interest</p>
                        <h3 className="luxury-text" style={{ fontSize: '1.1rem' }}>{inq.properties?.title || 'Unknown Asset'}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Date Received</p>
                        <p style={{ fontSize: '0.85rem' }}>{new Date(inq.created_at).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <Mail size={18} color="var(--color-primary)" style={{marginTop: '0.2rem'}}/>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{inq.user_email}</p>
                        <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6', fontStyle: 'italic' }}>"{inq.message}"</p>
                      </div>
                   </div>
                 </div>
               ))
            )}
          </div>
        )}

        {/* POSTING TAB */}
        {activeTab === 'post' && (
          <div className="glass" style={{ padding: '3rem', borderTop: '4px solid var(--color-primary)' }}>
            <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.5rem' }}>Secure Asset Publication</h2>
            
            {createMsg && (
               <div className="glass" style={{
                  padding: '1.5rem', marginBottom: '2rem',
                  borderLeft: `4px solid ${createMsg.includes('Error') ? '#ef4444' : 'var(--color-primary)'}`,
                  color: createMsg.includes('Error') ? '#ef4444' : 'var(--color-primary)'
               }}>
                   {createMsg}
               </div>
            )}

            <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '300px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Asset Designation</label>
                  <input type="text" placeholder="e.g. Skyline Oasis" value={title} onChange={e => setTitle(e.target.value)} required style={{width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0'}} />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Valuation (USD)</label>
                  <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required style={{width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0'}} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '300px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Global Coordinates</label>
                  <input type="text" placeholder="e.g. Beverly Hills, CA" value={location} onChange={e => setLocation(e.target.value)} required style={{width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0'}} />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Asset Category</label>
                  <select value={type} onChange={e => setType(e.target.value)} style={{width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0', backgroundColor: 'var(--color-surface)'}}>
                    <option>Villa</option>
                    <option>Penthouse</option>
                    <option>Estate</option>
                    <option>Mansion</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Intellectual Brief</label>
                <textarea 
                  placeholder="Premium amenities..." 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required
                  rows="6"
                  style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0', fontFamily: 'inherit', resize: 'vertical' }}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Visual Asset (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  style={{ width: '100%', padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: '0' }}
                />
              </div>

              <button type="submit" disabled={createLoading} className="btn btn-primary" style={{ padding: '1.25rem 4rem', alignSelf: 'flex-start' }}>
                {createLoading ? 'Establishing Uplink...' : 'Publish to Network'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
