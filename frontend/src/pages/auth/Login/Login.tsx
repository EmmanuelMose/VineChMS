import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../Features/auth/authAPI";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Features/userSlice";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        dispatch(setUser({ user: response.user, token: response.token }));
        navigate("/dashboard/church-admin");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="login-logo-icon">⛪</span>
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
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@church.com"
                required
                className={error ? "login-input-error" : ""}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={error ? "login-input-error" : ""}
              />
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

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
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