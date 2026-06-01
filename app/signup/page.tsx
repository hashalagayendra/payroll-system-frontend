"use client";

import React, { useState } from "react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    join_date: "",
    employment_type: "",
    status: "active",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // The API endpoint requires ISO datetime formatting for dates
      const payload = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
        join_date: formData.join_date ? new Date(formData.join_date).toISOString() : undefined,
      };

      const response = await fetch("http://127.0.0.1:8000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed. Please try again.");
      }

      setSuccessMsg("Employee registered successfully!");
      
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />

      <style>{`
        .signup-container {
          min-height: 100vh;
          overflow: hidden;
          background-color: #ffffff;
        }
        
        .brand-panel {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          position: relative;
          color: white;
          overflow: hidden;
        }

        .brand-panel::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
          transform: rotate(20deg);
        }

        .form-panel {
          height: 100vh;
          overflow-y: auto;
          background-color: #ffffff;
        }
        
        /* Subtle custom scrollbar */
        .form-panel::-webkit-scrollbar {
          width: 6px;
        }
        .form-panel::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .custom-input {
          border-radius: 0.35rem;
          padding: 0.65rem 0.85rem;
          border: 1px solid #cbd5e1;
          background-color: #f8fafc;
          font-size: 0.95rem;
          transition: all 0.2s ease-in-out;
        }

        .custom-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background-color: #ffffff;
          outline: none;
        }

        .btn-pro {
          background-color: #3b82f6;
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 0.35rem;
          border: none;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .btn-pro:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          color: white;
        }
        
        .custom-label {
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.35rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-header {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
          font-size: 1.15rem;
        }
      `}</style>

      <div className="container-fluid p-0 signup-container">
        <div className="row g-0 h-100">
          {/* Left Side: Professional Branding */}
          <div className="col-lg-4 col-xl-3 d-none d-lg-flex brand-panel flex-column p-5">
            <div style={{ zIndex: 1 }}>
              <h2 className="fw-bold mb-4">Enterprise Payroll</h2>
              <p
                className="opacity-75"
                style={{ lineHeight: "1.7", fontSize: "1.05rem" }}
              >
                Join our platform to manage your workforce efficiently. Fill out
                the registration form to create a new employee profile in our
                highly secure system.
              </p>
            </div>
            <div className="mt-auto" style={{ zIndex: 1 }}>
              <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                Already have an account? <br />
                <a
                  href="/login"
                  className="text-white fw-bold text-decoration-underline mt-2 d-inline-block"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Right Side: Full-page Form Panel */}
          <div className="col-12 col-lg-8 col-xl-9 form-panel p-4 p-md-5">
            <div
              className="w-100 mx-auto pt-1 pt-lg-2 pb-5"
              style={{ maxWidth: "1000px" }}
            >
              <div className="mb-4">
                <h1 className="fw-bold text-dark mb-2">
                  Employee Registration
                </h1>
                <p className="text-muted" style={{ fontSize: "1.05rem" }}>
                  Please provide accurate information for the new employee
                  profile.
                </p>
                {errorMsg && <div className="alert alert-danger py-2 mt-3 mb-0" style={{ fontSize: "0.9rem" }}>{errorMsg}</div>}
                {successMsg && <div className="alert alert-success py-2 mt-3 mb-0" style={{ fontSize: "0.9rem" }}>{successMsg}</div>}
              </div>

              <form onSubmit={handleSubmit}>
                {/* --- Section 1 --- */}
                <h3 className="section-header">Personal Information</h3>
                <div className="row g-4 mb-5">
                  <div className="col-md-4">
                    <label htmlFor="first_name" className="custom-label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      placeholder="John"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="last_name" className="custom-label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Doe"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="dob" className="custom-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control custom-input"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="gender" className="custom-label">
                      Gender
                    </label>
                    <select
                      className="form-select custom-input"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-8">
                    <label htmlFor="address" className="custom-label">
                      Home Address
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Full home address"
                    />
                  </div>
                </div>

                {/* --- Section 2 --- */}
                <h3 className="section-header">Employment Details</h3>
                <div className="row g-4 mb-5">
                  <div className="col-md-4">
                    <label htmlFor="employee_code" className="custom-label">
                      Employee Code *
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="employee_code"
                      name="employee_code"
                      value={formData.employee_code}
                      onChange={handleChange}
                      required
                      placeholder="EMP-001"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="employment_type" className="custom-label">
                      Employment Type
                    </label>
                    <select
                      className="form-select custom-input"
                      id="employment_type"
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="join_date" className="custom-label">
                      Join Date
                    </label>
                    <input
                      type="date"
                      className="form-control custom-input"
                      id="join_date"
                      name="join_date"
                      value={formData.join_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="status" className="custom-label">
                      Current Status
                    </label>
                    <select
                      className="form-select custom-input"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* --- Section 3 --- */}
                <h3 className="section-header">Account Setup</h3>
                <div className="row g-4 mb-5">
                  <div className="col-md-4">
                    <label htmlFor="email" className="custom-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control custom-input"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="phone" className="custom-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control custom-input"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="col-md-4"></div>{" "}
                  {/* Empty column for alignment */}
                  <div className="col-md-4">
                    <label htmlFor="password" className="custom-label">
                      Password *
                    </label>
                    <input
                      type="password"
                      className="form-control custom-input"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a password"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="confirm_password" className="custom-label">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      className="form-control custom-input"
                      id="confirm_password"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                {/* --- Submit --- */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light">
                  <div className="d-block d-lg-none">
                    {/* Only visible on small screens where sidebar is hidden */}
                    <a
                      href="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#3b82f6" }}
                    >
                      &larr; Back to Login
                    </a>
                  </div>
                  <button type="submit" className="btn btn-pro ms-auto" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
