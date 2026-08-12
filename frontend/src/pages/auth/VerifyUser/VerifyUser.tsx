import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyUser, resendVerification } from "../../../Features/auth/authAPI";
import { Mail, Key, ArrowLeft, Shield, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import "./VerifyUser.css";

export default function VerifyUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      toast.error("Please fill in all fields");
      return;
    }

    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyUser({ email, code });
      if (response.success) {
        setSuccess(true);
        toast.success("Email verified successfully!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setResending(true);

    try {
      const response = await resendVerification(email);
      if (response.success) {
        toast.success("Verification code resent successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend verification code");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="verify-page">
        <div className="verify-wrapper">
          <div className="verify-card">
            <div className="verify-success">
              <CheckCircle className="verify-success-icon" size={64} />
              <h2 className="verify-success-title">Email Verified!</h2>
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
      <div className="verify-wrapper">
        <div className="verify-card">
          <button onClick={() => navigate("/auth/login")} className="back-btn">
            <ArrowLeft size={18} />
            Back to Login
          </button>

          <div className="verify-header">
            <div className="verify-logo">
              <Shield className="verify-logo-icon" size={24} />
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
              <div className="verify-input-wrapper">
                <Mail className="verify-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="verify-form-group">
              <label htmlFor="code">Verification Code</label>
              <div className="verify-input-wrapper">
                <Key className="verify-input-icon" size={18} />
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <span className="verify-hint">Check your email for the 6-digit verification code</span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </button>

            <div className="verify-resend">
              <button
                type="button"
                onClick={handleResend}
                className="verify-resend-btn"
                disabled={resending}
              >
                <RefreshCw size={16} className={resending ? "spin" : ""} />
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