'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, tokenStorage } from '@/lib/api';
import { getMockLogin } from '@/lib/mocks';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('martina@company.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenStorage.get()) router.replace('/');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      tokenStorage.set(res.token);
      router.replace('/');
    } catch {
      const mock = getMockLogin(email, password);
      if (mock) {
        tokenStorage.set(mock.token);
        router.replace('/');
      } else {
        setError('Credenziali non valide');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Brand panel */}
      <div
        style={{
          flex: '1.15',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          background: 'radial-gradient(120% 120% at 0% 0%, #0f2a20 0%, #0a0c10 55%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Decorative rings */}
        <div
          style={{
            position: 'absolute',
            right: -160,
            bottom: -160,
            width: 620,
            height: 620,
            pointerEvents: 'none',
            animation: 'mwkGlow 6s ease-in-out infinite',
          }}
        >
          <svg viewBox="0 0 620 620" width="620" height="620">
            <circle cx="310" cy="310" r="240" fill="none" stroke="rgba(52,211,153,0.16)" strokeWidth="2" />
            <circle cx="310" cy="310" r="180" fill="none" stroke="rgba(52,211,153,0.10)" strokeWidth="2" />
            <circle
              cx="310" cy="310" r="240" fill="none" stroke="#34d399" strokeWidth="6"
              strokeLinecap="round" strokeDasharray="1508" strokeDashoffset="640"
              transform="rotate(-90 310 310)"
              style={{ filter: 'drop-shadow(0 0 14px rgba(52,211,153,0.55))' }}
            />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: 'linear-gradient(160deg, #6ee7b7, #34d399)',
              boxShadow: '0 10px 30px -8px rgba(52,211,153,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 15L15 5" stroke="#06281d" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="6.5" cy="6.5" r="2.2" stroke="#06281d" strokeWidth="2" />
            </svg>
          </div>
          <div
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em', color: '#eef2f6' }}
          >
            Meeting Waste Killer
          </div>
        </div>

        {/* Tagline */}
        <div style={{ position: 'relative', maxWidth: 480 }}>
          <div
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#34d399', marginBottom: 20 }}
          >
            Proof of Concept
          </div>
          <div
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 46, lineHeight: 1.06, letterSpacing: '-0.02em', color: '#eef2f6', marginBottom: 20 }}
          >
            Smetti di sprecare tempo in riunioni inutili.
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.65, color: '#9aa4b2' }}>
            Ogni meeting ha un costo. Misura lo spreco, individua le riunioni critiche e recupera ore — e budget — del tuo team.
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#5a6472', letterSpacing: '0.04em', position: 'relative' }}>
          Demo · dati simulati · Giugno 2026
        </div>
      </div>

      {/* Form panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          background: '#0a0c10',
        }}
      >
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 26, letterSpacing: '-0.01em', color: '#eef2f6', marginBottom: 8 }}>
            Accedi al cruscotto
          </div>
          <div style={{ fontSize: 14, color: '#8b95a4', marginBottom: 32 }}>
            Usa le credenziali demo precompilate.
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b95a4', marginBottom: 10 }}>
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '13px 15px', borderRadius: 12,
                  background: '#13161c', border: '1px solid rgba(255,255,255,0.09)',
                  fontSize: 14, color: '#eef2f6', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b95a4', marginBottom: 10 }}>
                Password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '13px 15px', borderRadius: 12,
                  background: '#13161c', border: '1px solid rgba(255,255,255,0.09)',
                  fontSize: 14, color: '#eef2f6', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: 12,
                background: 'linear-gradient(180deg, #6ee7b7, #34d399)',
                boxShadow: '0 14px 34px -10px rgba(52,211,153,0.7)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15,
                color: '#06281d',
                opacity: loading ? 0.7 : 1,
                transition: 'transform .12s',
              }}
            >
              {loading ? 'Accesso in corso…' : 'Accedi alla dashboard'}
            </button>
          </form>

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#5a6472' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', display: 'inline-block' }} />
            JWT mock · nessun dato reale
          </div>
        </div>
      </div>
    </div>
  );
}
