import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Ship(props) {
  const [active, setActive] = useState(props.ship.sensorsActive); /*  */
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.ship.sensorsActive !== active) {
      setActive(props.ship.sensorsActive);
    }
  }, [props.ship.sensorsActive]);

  async function toggleActive() {
    try {
      const response = await axios({
        url: 'http://localhost/toggle',
        method: 'post',
        headers: {
          clientName: props.name,
          clientId: props.user,
        },
      });
      setActive(!active);
    } catch (err) {
      if (err && err.response) {
        let error = err.response.data.error;
        setError(error);
        setTimeout(() => setError(''), 5000);
      }
    }
  }

  return (
    <div className="ship">
      <div className="row">
        <h2>{props.ship.name}</h2>
        <h4> Sensors {active ? 'Enabled' : 'Disabled'} </h4>
      </div>
      <br />
      <p>Solar Battery Level: {props.ship.batteryLevel}% </p>

      <br />
      <p>
        Aligned with {props.ship.alignmentStar} (RA: {props.ship.ra} / DEC:{' '}
        {props.ship.dec}){' '}
      </p>
      <p>Distance from Earth: {props.ship.distanceFromEarth} miles </p>
      <p>Velocity away from Earth: {props.ship.velocity} miles per hour </p>

      <br />
      <p>
        Instrument Temperature: {active ? props.ship.temperature : 'N/A'}° K{' '}
      </p>
      <p>Radiation Flux: {active ? props.ship.radiation : 'N/A'} W/m²</p>

      <br />

      <p className="error">{error}</p>
      <button className="submit" onClick={toggleActive}>
        {active ? 'Disable Sensors' : 'Enable Sensors'}
      </button>
    </div>
  );
}
