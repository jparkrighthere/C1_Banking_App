import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../AuthContext';

const Header = () => {
  const { logout } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetch('/api/identity', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data['identity']));

      const handleScroll = () => {
        if (window.scrollY > 0) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
  }, []);



  return (
    <header className={`header ${isScrolled ? 'shadow' : ''}`}>
      <img src="/Images/logo.png" alt="Capital One Logo" className="c1-logo" />
      <nav className="navigation">
        <Link to="/budget" className="nav-link">
          Budgeting
        </Link>
        <Link to="/" className="nav-link">
          Accounts
        </Link>
        <Link
          to="/signin"
          className="nav-link"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Link>
      </nav>
      <div className="profile-info">
        {
        <img
          src="/Images/profile.jpg"
          alt="Profile"
          className="profile-image"
        />
        }
        <span className="user-name">{user || ''}</span>
      </div>
    </header>
  );
};

export default Header;
