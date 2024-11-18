import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [cookies, setCookie] = useCookies(['user']);
  const [name, setName] = useCookies(['name']);
  const navigate = useNavigate();

  function signout() {
    setCookie('user', false);
    setName('name', false);
    navigate('/login');
  }

  return (
    <div>
      <button onClick={signout}>Logout</button>
      <h1>Home</h1>
      <h3>
        Welcome, {name.name} (${cookies.user}){' '}
      </h3>

      <button>Privileged Action</button>
    </div>
  );
}
