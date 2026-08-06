import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../Features/auth/authAPI";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/verify-reset-code");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-page">
        <div className="forgot-container">
          <div className="forgot-card">
            <div className="forgot-success">
              <h2 className="forgot-success-title">Reset Code Sent!</h2>
              <p>A password reset code has been sent to your email.</p>
              <p className="forgot-success-sub">Please check your inbox and enter the code.</p>
              <Link to="/auth/verify-reset-code" className="btn-primary">
                Enter Reset Code
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <div className="forgot-card">
          <div className="forgot-header">
            <div className="forgot-logo">
              <span className="forgot-logo-text">
                Vine<span className="forgot-logo-highlight">ChMS</span>
              </span>
            </div>
            <h2 className="forgot-title">Forgot Password</h2>
            <p className="forgot-subtitle">Enter your email to receive a reset code</p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="forgot-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {error && <div className="forgot-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>

            <p className="forgot-login">
              Remember your password? <Link to="/auth/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}