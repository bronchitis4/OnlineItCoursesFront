import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithCustomToken} from 'firebase/auth'; 
import { auth } from '../firebase';
import AuthService from '../service/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //await signInWithEmailAndPassword(auth, email, password);
      const response = await authService.login({email, password});
      console.log(response);
      const userCredential = await signInWithCustomToken(auth, response.token);
      
      navigate('/courses');
    } catch (err) {
      setError('Невірний email або пароль');
    }
  };

  return (
    <div className="auth-container">
      <h2>Вхід</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Увійти</button>
      </form>
      <p>
        Ще не зареєстровані? <Link to="/signup">Створити акаунт</Link>
      </p>
    </div>
  );
};

export default Login;
