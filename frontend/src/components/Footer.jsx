import "../styles/Footer.css"; // Create this file for footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Village AgriHub. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
