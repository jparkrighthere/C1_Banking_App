import  { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../AuthContext';

const Header = () => {
    const { logout } = useContext(AuthContext);
    const user = {
        profileImage: '/Images/profile.jpg',
        name: 'John Doe',
    }

  return (
    <header className="header">
      <img src="/Images/logo2.png" alt="Capital One Logo" className="logo" />
      <nav className="navigation">
        <Link to="/budget" className="nav-link">Budget</Link>
        <Link to="/" className="nav-link">Accounts</Link>
        <Link to="/signin" className="nav-link" onClick={
            () => {
                logout();
            }
        }>Logout</Link>
      </nav>
      <div className="profile-info">
        <img src={user?.profileImage} alt="Profile" className="profile-image" />
        <span className="user-name">{user?.name || 'Your Name'}</span>
      </div>
    </header>
  );
};

export default Header;
