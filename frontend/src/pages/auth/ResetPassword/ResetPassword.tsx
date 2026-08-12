import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../../Features/auth/authAPI";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!emailFromState) {
      toast.error("Please verify your email first");
      navigate("/auth/forgot-password");
    }
  }, [emailFromState, navigate]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ email, newPassword });
      if (response.success) {
        setSuccess(true);
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-page">
        <div className="reset-wrapper">
          <div className="reset-card">
            <div className="reset-success">
              <CheckCircle className="reset-success-icon" size={64} />
              <h2 className="reset-success-title">Password Reset Successful!</h2>
              <p>Your password has been successfully reset.</p>
              <p className="reset-success-sub">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page">
      <div className="reset-wrapper">
        <div className="reset-card">
          <button onClick={() => navigate("/auth/login")} className="back-btn">
            <ArrowLeft size={18} />
            Back to Login
          </button>

          <div className="reset-header">
            <div className="reset-logo">
              <Shield className="reset-logo-icon" size={24} />
              <span className="reset-logo-text">
                Vine<span className="reset-logo-highlight">ChMS</span>
              </span>
            </div>
            <h2 className="reset-title">Reset Password</h2>
            <p className="reset-subtitle">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="reset-form">
            <div className="reset-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="reset-input-wrapper">
                <Mail className="reset-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={true}
                />
              </div>
            </div>

            <div className="reset-form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="reset-input-wrapper">
                <Lock className="reset-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars: uppercase, lowercase, number & special"
                  required
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="reset-hint">Must contain uppercase, lowercase, number & special character</span>
            </div>

            <div className="reset-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="reset-input-wrapper">
                <Lock className="reset-input-icon" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="reset-login">
              Remember your password? <Link to="/auth/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}