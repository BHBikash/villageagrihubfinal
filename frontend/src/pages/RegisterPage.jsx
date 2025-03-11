import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer", // Default role (can be 'buyer' or 'farmer')
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      alert("Registration successful!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="buyer">Buyer</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
