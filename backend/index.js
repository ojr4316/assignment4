const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const path = require('path');
const Ship = require('./ship');
const app = express();
const PORT = 80;

app.listen(PORT, (error) => {
  if (error) {
    console.log("Server couldn't start!", error);
  } else {
    console.log('Server started on port', PORT);
  }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('build', {}));

let ship = new Ship();

setInterval(() => {
  if (Math.random() < 0.3) {
    ship.travel();
  }
}, 500);

let users = {}; // { username: clientToken, ... }
let privilegedUsers = ['Mike'];

app.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: 'Username or password missing' });
    return;
  }
  let userExists = false;
  for (const user of Object.keys(users)) {
    if (Object.keys(user)[0] === username) {
      userExists = true;
      break;
    }
  }

  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    let token = uuidv4();
    users[username] = token;
    res.status(200).json({ clientId: token });
  }
});

app.post('/logout', (req, res) => {
  const { username, password } = req.body;

  delete users[username];
  res.status(200).json({ message: 'User logged out' });
});

app.get('/gps', (req, res) => {
  let token = verifyToken(req, res);

  if (token) {
    let { clientId, clientName } = token;
    res.status(200).json(ship.toJSON());
  }
});

app.post('/toggle', (req, res) => {
  let token = verifyToken(req, res);
  if (token) {
    let { clientId, clientName } = token;
    if (privilegedUsers.includes(clientName)) {
      ship.sensorsActive = !ship.sensorsActive;
      res.status(200).json({ sensorsActive: ship.sensorsActive });
    } else {
      res.status(400).json({ error: 'Unprivileged user' });
    }
  }
});

app.get('/system-vitals', (req, res) => {
  let token = verifyToken(req, res);

  if (token) {
    let { clientId, clientName } = token;
    if (privilegedUsers.includes(clientName)) {
      res.status(200).json({ system_vitals: 'The system is ok' });
    } else {
      res.status(400).json({ error: 'Unprivileged user' });
    }
  }
});

function verifyToken(req, res) {
  let clientName = req.get('clientName');
  let clientId = req.get('clientId');

  if (!clientId || !clientName) {
    res.status(400).json({ error: 'Log in first' });
    return false;
  }
  if (clientName in users && users[clientName] === clientId) {
    return { clientId, clientName };
  } else {
    res.status(400).json({ error: 'Invalid token' });
    return false;
  }
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
