import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyResetCode } from "../../../Features/auth/authAPI";
import "./VerifyResetCode.css";

export default function VerifyResetCode() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await verifyResetCode({ email, code });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/reset-password", { state: { email } });
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="verifyreset-page">
        <div className="verifyreset-container">
          <div className="verifyreset-card">
            <div className="verifyreset-success">
              <h2 className="verifyreset-success-title">Code Verified!</h2>
              <p>Your reset code has been verified.</p>
              <p className="verifyreset-success-sub">Redirecting to reset password...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verifyreset-page">
      <div className="verifyreset-container">
        <div className="verifyreset-card">
          <div className="verifyreset-header">
            <div className="verifyreset-logo">
              <span className="verifyreset-logo-text">
                Vine<span className="verifyreset-logo-highlight">ChMS</span>
              </span>
            </div>
            <h2 className="verifyreset-title">Verify Reset Code</h2>
            <p className="verifyreset-subtitle">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={handleSubmit} className="verifyreset-form">
            <div className="verifyreset-form-group">
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

            <div className="verifyreset-form-group">
              <label htmlFor="code">Reset Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              <span className="verifyreset-hint">Check your email for the reset code</span>
            </div>

            {error && <div className="verifyreset-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <p className="verifyreset-login">
              Remember your password? <Link to="/auth/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}