export default function HomePage() {
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
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Browse Exclusive Listings
          </button>
        </div>
      </section>

      {/* Placeholder for Featured Listings */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Featured Properties</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Card Mockup */}
          <div className="glass hover-lift" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ height: '200px', backgroundColor: 'var(--color-border)' }}></div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Luxury Penthouse</h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>Downtown Metro, Level 42</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>$2,450,000</span>
                <button className="btn" style={{ border: '1px solid var(--color-border)' }}>View</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
