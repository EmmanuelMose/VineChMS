import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyResetCode } from "../../../Features/auth/authAPI";
import { Mail, Key, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import "./VerifyResetCode.css";

export default function VerifyResetCode() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await verifyResetCode({ email, code });
      if (response.success) {
        toast.success("Code verified successfully!");
        navigate("/auth/reset-password", { 
          state: { email: email }
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid reset code. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="verifyreset-page">
      <div className="verifyreset-wrapper">
        <div className="verifyreset-card">
          <button onClick={() => navigate("/auth/forgot-password")} className="back-btn">
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="verifyreset-header">
            <div className="verifyreset-logo">
              <Shield className="verifyreset-logo-icon" size={24} />
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
              <div className="verifyreset-input-wrapper">
                <Mail className="verifyreset-input-icon" size={18} />
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

            <div className="verifyreset-form-group">
              <label htmlFor="code">Reset Code</label>
              <div className="verifyreset-input-wrapper">
                <Key className="verifyreset-input-icon" size={18} />
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
              <span className="verifyreset-hint">Check your email for the 6-digit reset code</span>
            </div>

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