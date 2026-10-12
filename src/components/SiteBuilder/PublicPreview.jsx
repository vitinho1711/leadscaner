import React, { useEffect, useState } from 'react';

export default function PublicPreview() {
  const path = window.location.pathname;
  const leadId = path.replace('/preview/', '').split('/')[0];
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch(`/preview/${leadId}`);
        if (!res.ok) throw new Error('Projeto demonstrativo não encontrado');
        const text = await res.text();
        setHtml(text);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchSite();
    else {
      setError('ID do projeto ausente');
      setLoading(false);
    }
  }, [leadId]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        background: '#090d16',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3b82f6',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#94a3b8' }}>Carregando demonstração do site...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        background: '#090d16',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Demonstração não disponível</h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        srcDoc={html}
        title="Demonstração do Site"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
