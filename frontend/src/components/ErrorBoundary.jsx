import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Boutique App Render Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    localStorage.removeItem('nakshatra_custom_designs');
    localStorage.removeItem('nakshatra_user');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#faf6f0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '550px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧵</div>
            <h2 style={{ color: '#0b2b26', marginBottom: '0.8rem', fontSize: '1.5rem' }}>
              Nakshatra Designer's Studio
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.8rem' }}>
              We encountered a temporary interface loading issue. Please click below to reload the studio.
            </p>
            {this.state.error && (
              <pre style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '0.78rem',
                color: '#ef4444',
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#d4af37',
                  color: '#0b2b26',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Reload Studio
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
