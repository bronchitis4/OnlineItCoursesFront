import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../styles.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/courses">Курси</Link></li>
          <li><Link to="/schedule">Розклад занять</Link></li>
        </ul>
        {auth.currentUser ? (
          <div className="auth-buttons">
            <Link to="/profile" className="profile-btn">Мій кабінет</Link>
            <button onClick={handleLogout} className="logout-btn">Вийти</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Увійти</Link>
            <Link to="/signup" className="signup-btn">Реєстрація</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
