import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../Features/auth/authAPI";
import { Mail, ArrowLeft, Shield, Send } from "lucide-react";
import { toast } from "sonner";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        setSuccess(true);
        toast.success("Reset code sent to your email!");
        setTimeout(() => {
          navigate("/auth/verify-reset-code");
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <div className="forgot-card">
            <div className="forgot-success">
              <Send className="forgot-success-icon" size={64} />
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
      <div className="forgot-wrapper">
        <div className="forgot-card">
          <button onClick={() => navigate("/auth/login")} className="back-btn">
            <ArrowLeft size={18} />
            Back to Login
          </button>

          <div className="forgot-header">
            <div className="forgot-logo">
              <Shield className="forgot-logo-icon" size={24} />
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
              <div className="forgot-input-wrapper">
                <Mail className="forgot-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <span className="forgot-hint">We'll send a 6-digit reset code to this email</span>
            </div>

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