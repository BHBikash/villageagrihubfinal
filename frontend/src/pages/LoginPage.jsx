import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await loginUser(formData);
      console.log("User data received from backend:", userData);

      if (!userData.token) {
        throw new Error("Token not received from backend.");
      }

      // ✅ Store token & user details in localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Stored Token:", localStorage.getItem("token")); // Debugging

      alert("Login successful!");

      // ✅ Redirect users based on role
      switch (userData.role?.toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "farmer":
          navigate("/farmer/dashboard");
          break;
        case "buyer":
          navigate("/buyer/orders");
          break;
        default:
          setError(`Invalid role received: ${userData.role}. Contact support.`);
          navigate("/"); // Redirect to home if role is unknown
          break;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
