import { useState } from 'react';
import { signInWithCustomToken} from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import AuthService from '../service/authService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      
      const response = await authService.register({password, email});
      await signInWithCustomToken(auth, response.token);
      navigate('/courses');
    } catch (err) {
      setError('Помилка реєстрації. Можливо, акаунт вже існує.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Реєстрація</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зареєструватися</button>
      </form>
      <p>
        Вже є акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
};

export default SignUp;
