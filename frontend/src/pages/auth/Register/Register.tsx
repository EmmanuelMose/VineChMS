import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../Features/auth/authAPI";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    invitationToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        invitationToken: formData.invitationToken,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/verify-user");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-card">
            <div className="register-success">
              <h2 className="register-success-title">Registration Successful!</h2>
              <p>A verification code has been sent to your email.</p>
              <p className="register-success-sub">Please check your inbox and verify your account.</p>
              <Link to="/auth/verify-user" className="btn-primary">
                Verify Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <span className="register-logo-text">
                Vine<span className="register-logo-highlight">ChMS</span>
              </span>
            </div>
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Register with your invitation token</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="invitationToken">Invitation Token</label>
              <input
                type="text"
                id="invitationToken"
                name="invitationToken"
                value={formData.invitationToken}
                onChange={handleChange}
                placeholder="Enter your invitation token"
                required
              />
              <span className="register-hint">Check your email for the invitation token</span>
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && <div className="register-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="register-login">
              Already have an account? <Link to="/auth/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}