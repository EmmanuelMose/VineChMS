import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../Features/auth/authAPI";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Features/userSlice";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import PeopleWorship1 from "../../../assets/images/PeopleWorship1.jpg";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        dispatch(setUser({ user: response.user, token: response.token }));
        toast.success("Login successful! Welcome back.");
        
        const role = response.user?.role;
        if (role === "church_admin") {
          navigate("/dashboard/church-admin");
        } else {
          navigate("/dashboard/member");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-image-side">
          <div className="login-image-content">
            <img src={PeopleWorship1} alt="People Worship" className="login-image" />
            <div className="login-image-overlay"></div>
            <div className="login-image-text">
              <Shield className="login-image-icon" size={32} />
              <h2>Welcome Back to</h2>
              <h1>Vine<span>ChMS</span></h1>
              <p>Your all-in-one church management platform</p>
            </div>
          </div>
        </div>

        <div className="login-form-side">
          <button onClick={() => navigate("/")} className="back-btn">
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="login-header">
            <div className="login-logo">
              <span className="login-logo-text">
                Vine<span className="login-logo-highlight">ChMS</span>
              </span>
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your church management account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" size={18} />
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

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="login-forgot">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="login-register">
              Don't have an account? <Link to="/auth/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}