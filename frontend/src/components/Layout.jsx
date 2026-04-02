import { Outlet, Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <nav className="glass" style={{
        position: 'sticky', top: 0, zIndex: 50, padding: '1rem', borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
            <Home color="var(--color-primary)" />
            EstateFlow
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/listings" className="title" style={{ fontWeight: 500 }}>Listings</Link>
            <Link to="/dashboard" className="title" style={{ fontWeight: 500 }}>Dashboard</Link>
          </div>
        </div>
      </nav>

      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '3rem 0', marginTop: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p>&copy; 2026 EstateFlow Premium Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
