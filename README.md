## Assignment 4-5
### Satellite Tracker - Secure Session Management

### Testing
1. Run server backend (`cd backend` and `npm start`)
2. Run tests (`cd testing` and `python main.py -v`)

### Use Cases
- No authentication - Don't provide a username or password
- Basic authentication - Provide any username and password
- Privileged  authentication - Provide username 'Mike' and any password

Once authorized into the web app, users can view the current status of a satellite, including information about speed, alignment, battery life, and sensors. If the user is privileged, they may activate or deactivate a satellite's sensors.

### Build Steps

#### Development Build
1. Run React development server (in /frontend) using `npm start`
2. Run backend server (in /backend) using `npm start`
3. Access site at `http://localhost:3000`

#### Production Build
1. Build react project (in /frontend) to static using `npm run deploy`
2. Run server (in /backend) using `npm start`
3. Access site at `http://localhost`