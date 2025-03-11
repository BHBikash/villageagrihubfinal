import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // Ensure styles are imported

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🌾 Village AgriHub</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/farming-tips">Farming Tips</Link></li>

        {/* Show login/register only if user is NOT logged in */}
        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            {/* Show dashboard based on user role */}
            {user.role === "farmer" && <li><Link to="/farmer/dashboard">Farmer Dashboard</Link></li>}
            {user.role === "buyer" && <li><Link to="/buyer/orders">My Orders</Link></li>}
            {user.role === "admin" && <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>}
            
            {/* Logout Button */}
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
