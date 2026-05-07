"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const PARTICLE_COUNT = 60;
const fullText = "Hi!\n Welcome to ShopFlow.";

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
        ctx.fillStyle = `rgba(26, 143, 160, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y,
          );
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(26, 143, 160, ${0.1 * (1 - dist / 80)})`;
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [displayed, setDisplayed] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef(null);
  const { login } = useAuth();
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
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .input-field {
          width: 100%;
          padding: 14px 16px;
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: #1a8fa0;
          box-shadow: 0 0 0 3px rgba(26,143,160,0.15);
          background: #0e3a4a;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #1a8fa0;
          border: none;
          border-radius: 10px;
          color: #071f2e;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(26,143,160,0.3);
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26,143,160,0.5);
        }
        .login-btn:active { transform: translateY(0); }
        .logo-box {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: #1a8fa0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: bold;
          color: #071f2e;
          margin-bottom: 16px;
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(26,143,160,0.4), 0 0 60px rgba(26,143,160,0.1); }
          50% { box-shadow: 0 0 30px rgba(26,143,160,0.7), 0 0 80px rgba(26,143,160,0.2); }
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

      <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>

        {/* Left Side */}
        <div
          className="left-side"
          style={{
            flex: 1,
            background: `linear-gradient(${gradientAngle}deg, #071f2e 0%, #0a2535 40%, #0e6b7a 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: "48px" }}>
              <div className="logo-box">S</div>
            </div>

            <h1
              style={{
                color: "white",
                fontSize: "44px",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "20px",
                whiteSpace: "pre-line",
              }}
            >
              {displayed}
              <span
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "48px",
                  background: "#1a8fa0",
                  marginLeft: "4px",
                  verticalAlign: "middle",
                  animation: "blink 1s step-end infinite",
                }}
              />
            </h1>

            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: "1.6", maxWidth: "380px" }}>
              Manage your store, track orders, and grow your business all in one place.
            </p>

            <div style={{ marginTop: "48px", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
              © 2026 ShopFlow. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div
          className="right-side"
          style={{
            flex: 1,
            background: "#071f2e",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px",
          }}
        >
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <h2 style={{ color: "white", fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
              Welcome Back!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px", fontSize: "14px" }}>
              Do not have an account?{" "}
              <Link href="/register" style={{ color: "#1a8fa0", textDecoration: "none", fontWeight: "500" }}>
                Create one now
              </Link>
            </p>

            {error && (
              <div style={{
                background: "rgba(255,71,87,0.1)",
                border: "1px solid #ff4757",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#ff4757",
                fontSize: "14px",
                marginBottom: "20px",
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", display: "block", marginBottom: "8px" }}>
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
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input-field"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}