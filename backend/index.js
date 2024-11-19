const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const path = require('path');
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let users = []; // { username: clientToken }


app.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: 'Username or password missing' });
    return;
  }
  let userExists = false;
  for (const user of users) {
    if (Object.keys(user)[0] === username) {
      userExists = true;
      break;
    }
  }

  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    let token = uuidv4();
    users.push({ [username]: token });
    res.status(200).json({ clientId: token });
  }
});

app.post('/logout', (req, res) => {
  const { username, password } = req.body;

  users = users.filter((user) => user.username !== username);
  res.status(200).json({ message: 'User logged out' });
});
