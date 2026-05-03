'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const PARTICLE_COUNT = 60;
const fullText = 'Join Us,\nGet Started! ';

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 208, 132, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 208, 132, ${0.1 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [canvasRef]);
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [displayed, setDisplayed] = useState('');
  const canvasRef = useRef(null);
  const { register } = useAuth();
  const router = useRouter();

  useParticles(canvasRef);

  useEffect(() => {
    let angle = 135;
    let direction = 1;
    const interval = setInterval(() => {
      angle += direction * 0.3;
      if (angle >= 180) direction = -1;
      if (angle <= 90) direction = 1;
      setGradientAngle(angle);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (res.success) {
      router.push('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .input-field {
          width: 100%;
          padding: 14px 16px;
          background: #16213e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: #00d084;
          box-shadow: 0 0 0 3px rgba(0,208,132,0.15);
          background: #1a2744;
        }
        .register-btn {
          width: 100%;
          padding: 14px;
          background: #00d084;
          border: none;
          border-radius: 10px;
          color: #1a1a2e;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,208,132,0.3);
        }
        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,208,132,0.5);
        }
        .register-btn:active { transform: translateY(0); }
        .logo-box {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: #00d084;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: bold;
          color: #1a1a2e;
          margin-bottom: 16px;
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,208,132,0.4), 0 0 60px rgba(0,208,132,0.1); }
          50% { box-shadow: 0 0 30px rgba(0,208,132,0.7), 0 0 80px rgba(0,208,132,0.2); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .left-side { animation: fadeInLeft 1s ease forwards; }
        .right-side { animation: fadeInRight 1s ease forwards; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>

        {/* Left Side */}
        <div className="left-side" style={{
          flex: 1,
          background: `linear-gradient(${gradientAngle}deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <canvas ref={canvasRef} style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '48px' }}>
              <div className="logo-box">S</div>
              <span style={{ color: 'white', fontSize: '20px', fontWeight: '600' }}>ShopFlow</span>
            </div>

            <h1 style={{
              color: 'white', fontSize: '44px', fontWeight: '700',
              lineHeight: '1.2', marginBottom: '20px', whiteSpace: 'pre-line',
            }}>
              {displayed}
              <span style={{
                display: 'inline-block',
                width: '3px', height: '48px',
                background: '#00d084',
                marginLeft: '4px',
                verticalAlign: 'middle',
                animation: 'blink 1s step-end infinite',
              }} />
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.6)', fontSize: '16px',
              lineHeight: '1.6', maxWidth: '380px',
            }}>
              Create your account and start shopping — thousands of products waiting for you.
            </p>

            <div style={{ marginTop: '48px', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
              © 2026 ShopFlow. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side" style={{
          flex: 1, background: '#0d0d1a',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', padding: '60px',
          overflowY: 'auto',
        }}>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
              Create Account
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#00d084', textDecoration: 'none', fontWeight: '500' }}>
                Login here
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  className="input-field"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Wissal Ouboujemaa"
                  required
                />
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  className="input-field"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="register-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}