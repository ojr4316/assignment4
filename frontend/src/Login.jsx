import { Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [token, setToken] = useCookies(['user']);
  const [name, setName] = useCookies(['name']);

  const navigate = useNavigate();

  if (token.user) {
    // Already signed in, should go home!
    return <Navigate to="/" />;
  }

  async function signin(e) {
    e.preventDefault();

    try {
      let form = new URLSearchParams();
      form.append('username', username);
      form.append('password', password);
      const response = await axios({
        url: 'http://localhost/login',
        method: 'post',
        data: form,
        headers: {
          'Content-Type': `application/x-www-form-urlencoded`,
        },
      });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setToken('user', response.data.clientId);
        setName('name', username);
        navigate('/');
      }
    } catch (er) {
      setError(er.response.data.error);
    }
  }

  return (
    <div className="full_page">
      <h1 className="title"> Satellite Tracker </h1>
      <p className="error">{error}</p>
      <form onSubmit={signin} className="login_form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className="submit" type="submit" value="Login" />
      </form>
    </div>
  );
}
