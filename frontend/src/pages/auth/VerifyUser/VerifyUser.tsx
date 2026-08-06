import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyUser, resendVerification } from "../../../Features/auth/authAPI";
import "./VerifyUser.css";

export default function VerifyUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await verifyUser({ email, code });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setResending(true);
    setError("");

    try {
      const response = await resendVerification(email);
      if (response.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend verification code");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="verify-page">
        <div className="verify-container">
          <div className="verify-card">
            <div className="verify-success">
              <div className="verify-success-icon">✅</div>
              <h2>Email Verified!</h2>
              <p>Your account has been successfully verified.</p>
              <p className="verify-success-sub">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-header">
            <div className="verify-logo">
              <span className="verify-logo-icon">⛪</span>
              <span className="verify-logo-text">
                Vine<span className="verify-logo-highlight">ChMS</span>
              </span>
            </div>
            <h2 className="verify-title">Verify Your Account</h2>
            <p className="verify-subtitle">Enter the verification code sent to your email</p>
          </div>

          <form onSubmit={handleSubmit} className="verify-form">
            <div className="verify-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@church.com"
                required
              />
            </div>

            <div className="verify-form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              <span className="verify-hint">Check your email for the 6-digit verification code</span>
            </div>

            {error && <div className="verify-error">{error}</div>}
            {resendSuccess && (
              <div className="verify-resend-success">
                Verification code resent successfully!
              </div>
            )}

            <button type="submit" className="verify-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </button>

            <div className="verify-resend">
              <button
                type="button"
                onClick={handleResend}
                className="verify-resend-btn"
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend Verification Code"}
              </button>
            </div>

            <p className="verify-login">
              Already verified? <Link to="/auth/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}