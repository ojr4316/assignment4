import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Ship from './Ship';

export default function Home() {
  const [token, setToken] = useCookies(['user']);
  const [name, setName] = useCookies(['name']);
  const navigate = useNavigate();
  const [ship, setShip] = useState({});

  useEffect(() => {
    async function getLocation() {
      try {
        const response = await axios({
          url: 'http://localhost/gps',
          method: 'get',
          headers: {
            clientName: name.name,
            clientId: token.user,
          },
        });
        setShip(response.data);
      } catch (err) {
        if (err.response) {
          let error = err.response.data.error;
          console.log(error);
        }
      }
    }

    getLocation();
  }, [token, name]);

  async function signout() {
    setToken('user', false);
    setName('name', false);
    navigate('/login');

    const response = await axios({
      url: 'http://localhost/logout',
      method: 'post',
    });
  }

  return (
    <div className="page">
      <div className="row">
        <h1>Satellite Tracker - Home</h1>
        <h3>
          Welcome, {name.name} (${token.user})
        </h3>
        <button onClick={signout} className="submit">
          Logout
        </button>
      </div>
      <div className="full_page">
        <Ship ship={ship} name={name.name} user={token.user} />
      </div>
    </div>
  );
}
