import  { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../AuthContext';

const Header = () => {
    const { logout } = useContext(AuthContext);
    const user = {
        profileImage: '/profile.jpg',
        name: 'John Doe',
    }

  return (
    <header className="header">
      <img src="/path-to-your-logo.svg" alt="Capital One Logo" className="logo" />
      <nav className="navigation">
        <Link to="/budget" className="nav-link">Budget</Link>
        <Link to="/accounts" className="nav-link">Accounts</Link>
        <button className="nav-link" onClick={
            () => {
                logout();
            }
        }>Logout</button>
      </nav>
      <div className="profile-info">
        <img src={user?.profileImage || '/placeholder-profile.jpg'} alt="Profile" className="profile-image" />
        <span className="user-name">{user?.name || 'Your Name'}</span>
      </div>
    </header>
  );
};

export default Header;
