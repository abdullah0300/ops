export default function ProductLoading() {
  return (
    <div className="pdp-page" style={{ background: '#F3F3F3', minHeight: '100vh' }}>

      {/* Breadcrumb skeleton */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 0', display: 'flex', gap: 8 }}>
        {[60, 60, 80].map((w, i) => (
          <div key={i} style={{ height: 14, width: w, borderRadius: 4, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>

      {/* Hero grid skeleton */}
      <div style={{ maxWidth: 1280, margin: '28px auto 0', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

        {/* Image panel */}
        <div>
          <div style={{ background: '#e0e0e0', borderRadius: 24, aspectRatio: '1', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 70, borderRadius: 12, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ height: 24, width: 120, borderRadius: 100, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 44, width: '80%', borderRadius: 8, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 44, width: '60%', borderRadius: 8, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          </div>
          <div style={{ height: 20, width: '90%', borderRadius: 6, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: 20, width: '70%', borderRadius: 6, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: 220, borderRadius: 20, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: 56, borderRadius: 100, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ height: 48, borderRadius: 100, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 48, borderRadius: 100, background: '#e0e0e0', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 1100px) {
          .pdp-page > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
