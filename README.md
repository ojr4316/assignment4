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


#### Architectural Breajers
1. Session management: User has a valid session only if they have an active token registered with the server. We did create a test for this which will show a pass. Since this does have to do with the authorization process we created for assignment 4, this is already built into our system and will pass in this case. However, it is still something that is easily breakable when it comes to architecture.  In this smaller system, this works great and has little to no risk of going wrong, however, this would not work architecturally in larger systems. This is because if a larger system used this and the server were to go down or the active token
had issues within the server, etc... this would lead to a really bad failure. Becuase of this, in a larger system to active token
should be registered within different servers or stored in multiple locations, this would prevent a large architectural failure since
if there were to be an issue with the server or if it were to go down for any reason, risks would be mitigated and hopefully no 
large scale failure would occur! Another thing to consider since this is in terms of architecture is the fact that when wanting to
further develop this application the scalability might be more difficult which means getting each of the tokens might take longer.
Similarly to the server issues, with this sessions management since this is a small term application and don't expect a lot of 
users to get on this application, it is totally fine here, however, it could lead to architectural degregation in the future!

2. Role-based Access: Only users with valid credentials can access the system from a privileged context. We did create
a test for this which will show a failure when given the case Mike2 over Mike and a user with the username Mike2 will have
full permissions even though that user name isn't authorized. This is becuase when testing for the priveldged name, the 
architecture is looking at what is contained in the username, not each character of the name. For exmaple, if we did this with
the name "anna", even anna, brianna, lianna, lilyanna, etc... would all be priveledged in this case even if the names are 
different in length, character type, spelling, etc... as long as they contain anna. This is an architectural breaker because
it creates a fault in our permission set architecture. We discussed this in Assignment 4 a little bit more, but our permissions
are handled by a request being sent to the server including the username and access token in which the server will confirm if 
the user is valid and if they have permission to perform that action. If the user has access, the server will perform the action 
and provide a successful response back to the web application, and if the user does not have access, the server will not perform any actions and instead provide an error message to the user. So, this is an architectural breaker we created in our code!


3. Insecure Authentication: Our system currently does not encrypt passwords or validate them for the user on login. This is 
not one of the items we are testing! The overall issue here with no encrupting passwords or validating them are large security
risks. A really great obvious exmaple of this is with an RIT network, if the username "liannapottgen" gave someone the access 
they needed to get into my MyCourses account, gmail, google docs, SIS, eservices, etc... a lot of information could be stolen
and put to mal use. This makes the application really vulnerable to attacks that can degrade the architecture of the program!
Similarly to the other exmaples like with session management, since this is a super small scale assignment with no personal informaiton involved, not checking passwords is totally fine! However, once this were to move over into larger use it would cause issues with security, especially if the application started to take in personal information!


4. Bad Input Validation and Sanitization: No content or length requirements set for username or password, and can contain invalid characters and harmful injection sequences. (E.g. SQL/JS injection, spaces in “Mike”/“Mike “). Depending on the specific implementation of the backend it is possible for overflow error to occur if we expect maximum lengths for certain inputs but never check. This would allow malicious actors to send specially crafted requests to the server to crash it or more. This breaker happens when parts of the code expect well formed requests without validating that the requests are properly well formed. Depending on the specific failure will dictate the severity of the issue and potential damage to the architecture. To test for this breaker would require understanding the assumptions a function makes about its inputs and making test cases to stress those assumptions to ensure that the assumptions are validated. A very similar breaker is the failure to sanitize user provided input i.e. SQL injection. Testing for this breaker is very similar to validation, understanding the assumption your functions that use user generated data make about the content of that data and creating tests to stress those assumptions. 

5. Insecure Token Management: Because we store a copy of a user’s current session token locally, that could be copied along with their username from cookies to validate insecure requests. Because we store a copy of a user’s current session token locally within the browser cookies there is potential for an architecture breaker. If the developer implementing the cookie staching for the front end fails to ensure the same site option is enabled then other websites can access the cookies and so a unscrupulous website/server would be able to use that cookie to perform actions as though they were the logged in user and would maintain the permissions of that user. This would be a fairly simple coding mistake for a developer to make if they weren’t aware of proper procedure for session cookies. While this breaker wouldn’t completely invalidate the secure session it would open a fairly well known exploit into our architecture. Testing for this breaker while not difficult requires knowledge of the proper procedure which is also how the breaker would be introduced.

#### Assignment 4 information

-Background & domain-
For our team in particular we chose to make our domain space themed again! This was just a simple way for us to understand it and related back to our original assignments so it was easier to base it off of concepts we’ve worked with! We have users and we have actions as the base of our application. In terms of users, we have users that have some no permissions, some permissions, and all permissions. his is set up to be something similar to an unaffiliated user, a civilian, and an engineer respectively 
In terms of actions, users can log into the system and get the location of the satellite while Engineers can perform a privileged action like enabling sensors

-Tasks & Permissions-
As seen by the file, we decided to use React JS and java for the front end work on Assignment 4 and then move over to python for 
testing! 
For tasks, Since we are using a space domain, tasks include connection with a satellite, getting privileged and unprivileged information like a webcam, location, GPS location, or frequency. And for permissions, we do have users that are authenticated to get into the system, but cannot reach the components or information that only someone with high authentication can reach.

-Identifier & Client Association Mechanism-
On a successful login, the username and access token are stored in cookies that are stored on the client-side in the browser
These cookies are used in subsequent requests to validate the user and determine their access to privileged actions
In order to check the identifier, the server keeps track of all the current active users and the tokens they should be providing.
If there is no token, the user is redirected to the login page. However if there is a token, but it doesn’t match the username, then that session is invalidated. And finally, if there is a token and it does match, then the user may be authenticated to perform some actions.

-Authorization Process-
On performing a higher privilege action, a request will be sent to the server including the username and access token. The server will confirm if the user is valid and if they have permission to perform that action. Similarly to the identifer and client 
mechanism, if the user has access, the server will perform the action and provide a successful response back to the web application
and if the user does not have access, the server will not perform any actions and instead provide an error message to the user.





