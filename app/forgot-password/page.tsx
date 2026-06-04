import React from "react";
import { Users, ShieldCheck, BarChart3 } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />

      <style>{`
        /* Professional Custom CSS */
        .login-layout {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .hero-section {
          background: linear-gradient(rgba(30, 58, 138, 0.7), rgba(59, 130, 246, 0.7)), url('/loginBG.png');
          background-size: cover;
          background-position: right center;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
          transform: rotate(20deg);
        }

        .auth-form-container {
          max-width: 460px;
          width: 100%;
          padding: 3rem;
          background: #ffffff;
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }

        .custom-input {
          border-radius: 0.5rem;
          padding: 0.8rem 1rem;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
          transition: all 0.2s ease-in-out;
        }

        .custom-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background-color: #ffffff;
          outline: none;
        }

        .btn-pro {
          background-color: #3b82f6;
          color: white;
          font-weight: 600;
          padding: 0.85rem;
          border-radius: 0.5rem;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-pro:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          color: white;
        }
        
        .custom-label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="container-fluid login-layout p-0">
        <div className="row g-0 min-vh-100">
          {/* Left Side: Professional Branding */}
          <div className="col-lg-5 col-xl-6 d-none d-lg-flex hero-section flex-column justify-content-center p-5">
            <div style={{ zIndex: 1 }} className="text-white p-4">
              <h1 className="display-4 fw-bold mb-1">Source Code</h1>
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#60a5fa' }}>Payroll</h1>
              <p
                className="lead opacity-90 fw-light mb-5"
                style={{ maxWidth: "85%", lineHeight: "1.6" }}
              >
                Streamline payroll processing, manage employee data, benefits, and ensure compliance with ease.
                <br />
                All in one secure platform.
              </p>

              {/* Features List */}
              <div className="d-flex flex-column gap-4" style={{ maxWidth: "85%" }}>
                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 bg-white/10 rounded-3 border border-white/15 d-flex align-items-center justify-content-center" style={{ backdropFilter: 'blur(4px)', width: "54px", height: "54px" }}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Employee Management</h5>
                    <p className="text-white/80 mb-0" style={{ fontSize: '0.95rem' }}>Manage employee data, benefits, and payroll in one place.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 bg-white/10 rounded-3 border border-white/15 d-flex align-items-center justify-content-center" style={{ backdropFilter: 'blur(4px)', width: "54px", height: "54px" }}>
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Compliance & Security</h5>
                    <p className="text-white/80 mb-0" style={{ fontSize: '0.95rem' }}>Stay compliant and secure with industry-leading standards.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 bg-white/10 rounded-3 border border-white/15 d-flex align-items-center justify-content-center" style={{ backdropFilter: 'blur(4px)', width: "54px", height: "54px" }}>
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Powerful Insights</h5>
                    <p className="text-white/80 mb-0" style={{ fontSize: '0.95rem' }}>Get real-time reports and insights to drive better decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Form */}
          <div className="col-lg-7 col-xl-6 d-flex align-items-center justify-content-center p-4">
            <div className="auth-form-container">
              <div className="mb-5 text-center">
                <img
                  src="/logo.png"
                  alt="Source Code Logo"
                  style={{
                    width: "128px",
                    height: "128px",
                    objectFit: "contain",
                  }}
                  className="mx-auto mb-3 rounded-3"
                />
                <h2 className="fw-bold mb-2 text-dark">Reset Password</h2>
                <p className="text-muted">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="custom-label">
                    Work Email
                  </label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    id="email"
                    placeholder="name@company.com"
                  />
                </div>

                <button className="btn btn-pro w-100 mb-4" type="submit">
                  Send Reset Link
                </button>

                <p
                  className="text-center text-muted mb-0"
                  style={{ fontSize: "0.95rem" }}
                >
                  Remember your password?{" "}
                  <a
                    href="/login"
                    className="text-decoration-none fw-semibold"
                    style={{ color: "#3b82f6" }}
                  >
                    Back to login
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
