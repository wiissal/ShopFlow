'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Left Side */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', left: '-150px',
          width: '500px', height: '500px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#00d084', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e',
            marginBottom: '16px',
          }}>S</div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: '600' }}>ShopFlow</span>
        </div>

        <h1 style={{ color: 'white', fontSize: '42px', fontWeight: '700', lineHeight: '1.2', marginBottom: '20px' }}>
          Hello,<br />Welcome! 
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.6', maxWidth: '380px' }}>
          Manage your store, track orders, and grow your business all in one place.
        </p>

        <div style={{ marginTop: '48px', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
          © 2026 ShopFlow. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div style={{
        flex: 1, background: '#0d0d1a',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            Welcome Back!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '14px' }}>
            Do not have an account?{' '}
            <Link href="/register" style={{ color: '#00d084', textDecoration: 'none', fontWeight: '500' }}>
              Create one now
            </Link>
          </p>

          {error && (
            <div style={{
              background: 'rgba(255,71,87,0.1)', border: '1px solid #ff4757',
              borderRadius: '8px', padding: '12px 16px',
              color: '#ff4757', fontSize: '14px', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: 'white', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: 'white', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#555' : '#00d084',
                border: 'none', borderRadius: '10px',
                color: '#1a1a2e', fontSize: '16px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}