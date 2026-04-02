import { useState } from 'react';
import { sendInquiry } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InquiryModal({ propertyId, propertyTitle, onClose }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (!user) throw new Error("Please sign in or register to contact agents.");
      
      await sendInquiry(propertyId, user.email, message);
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setStatus(`error: ${err.message}`);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass" style={{
        padding: '2rem', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '500px',
        backgroundColor: 'var(--color-surface)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Contact Agent</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>Regarding: <strong>{propertyTitle}</strong></p>
        
        {status === 'success' ? (
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: 'var(--radius-md)' }}>
            Message sent successfully! The agent will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea 
              placeholder={user ? "Write your inquiry here..." : "You must be signed in to submit inquiries."}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              disabled={!user || status === 'sending'}
              rows="5"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
            />
            {status.startsWith('error') && <p style={{ color: 'red', fontSize: '0.9rem' }}>{status.replace('error: ', '')}</p>}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={onClose} className="btn" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
              <button type="submit" disabled={!user || status === 'sending'} className="btn btn-primary">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
