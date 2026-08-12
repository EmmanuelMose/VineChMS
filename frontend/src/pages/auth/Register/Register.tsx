import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../Features/auth/authAPI";
import { Eye, EyeOff, Mail, Lock, User, Key, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import PeopleWorship2 from "../../../assets/images/PeopleWorship2.jpg";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword, invitationToken } = formData;

    if (!fullName || !email || !password || !confirmPassword || !invitationToken) {
      toast.error("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        fullName,
        email,
        password,
        invitationToken,
      });

      if (response.success) {
        toast.success("Registration successful! Please verify your account.");
        setTimeout(() => {
          navigate("/auth/verify-user");
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-image-side">
          <div className="register-image-content">
            <img src={PeopleWorship2} alt="People Worship" className="register-image" />
            <div className="register-image-overlay"></div>
            <div className="register-image-text">
              <Shield className="register-image-icon" size={32} />
              <h2>Join Our Community</h2>
              <h1>Vine<span>ChMS</span></h1>
              <p>Start managing your church with ease today</p>
            </div>
          </div>
        </div>

        <div className="register-form-side">
          <button onClick={() => navigate("/")} className="back-btn">
            <ArrowLeft size={18} />
            Back to Home
          </button>

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
              <div className="register-input-wrapper">
                <User className="register-input-icon" size={18} />
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
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="register-input-wrapper">
                <Mail className="register-input-icon" size={18} />
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
            </div>

            <div className="register-form-group">
              <label htmlFor="invitationToken">Invitation Token</label>
              <div className="register-input-wrapper">
                <Key className="register-input-icon" size={18} />
                <input
                  type="text"
                  id="invitationToken"
                  name="invitationToken"
                  value={formData.invitationToken}
                  onChange={handleChange}
                  placeholder="Enter your invitation token"
                  required
                />
              </div>
              <span className="register-hint">Check your email for the invitation token</span>
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>
              <div className="register-input-wrapper">
                <Lock className="register-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars: uppercase, lowercase, number & special"
                  required
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="register-input-wrapper">
                <Lock className="register-input-icon" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

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