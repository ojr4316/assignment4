import unittest
import requests

url = 'http://localhost'

# Login credentials
unprivileged = "Engineer"
privileged = "Mike"
# Because user contains ENTIRE part of privileged username, it will be given the same permissions
fake_privileged = privileged[:-1]

err_priv = "User should not be authorized to perform action"

class TestSatelliteTracker(unittest.TestCase):

    def tearDown(self):
        self.logout(unprivileged)
        self.logout(privileged)
        self.logout(fake_privileged)

    """ Helper methods for creating/destroying sessions """
    def login(self, username, password="FakePassword"):
        data = {'username': username, 'password': password}
        response = requests.post(url + '/login', data=data)
         # Response of login should be 200 - Success
        self.assertEqual(response.status_code, 200, f"Invalid response {response.status_code}")
        # Response should contain a token
        self.assertIn("clientId", response.json(), "Token not found in response")
        return response.json()["clientId"]

    def logout(self, username):
        data = {'username': username}
        response = requests.post(url + '/logout', data=data)
         # Response of logout should be 200 - Success
        self.assertEqual(response.status_code, 200, f"Invalid response {response.status_code}")
    
    """ Helper methods for performing actions """
    def gps(self, username, token):
        data = {'clientName': username, 'clientId': token}
        response = requests.get(url + '/gps', headers=data)
        return response

    def toggle(self, username, token):
        data = {'clientName': username, 'clientId': token}
        response = requests.post(url + '/toggle', headers=data)
        return response
        
    """ Tests if server is running, don't run other tests if not """
    def test_server(self):
        try:
            response = requests.get(url, timeout=5)
            self.assertEqual(response.status_code, 200, "Server is not running")
            return
        except requests.RequestException:
            pass
        self.fail("Server is not running")

    """ Session management: User has a valid session only if they have an active token registered with the server. (PASS) """
    def test_login(self):
        self.login(unprivileged)
    
    def test_session_nonexistant(self):
        response = self.gps(unprivileged, "FakeToken")
        # Response of gps should be 400 - Unauthorized
        self.assertEqual(response.status_code, 400, err_priv)

    def test_session_inactive(self):
        token = self.login(unprivileged)
        self.logout(unprivileged)
        response = self.gps(unprivileged, token)
        # Response of gps should be 400 - Unauthorized
        self.assertEqual(response.status_code, 400, err_priv)

    def test_session_active(self):
        token = self.login(unprivileged)
        response = self.gps(unprivileged, token)
        # Response of gps should be 200 - Success
        self.assertEqual(response.status_code, 200, f"Invalid response {response.status_code}")
        # Response should contain satellite GPS data
        self.assertIn("velocity", response.json(), "GPS data not found in response")
    
    """ Role-based Access: Only users with valid credentials can access the system from a privileged context. (FAIL - "Mik" will give permissions but does not match) """
    # Normal usage, privileged user performing privileged action
    def test_privileged_user(self):
        token = self.login(privileged)
        response = self.toggle(privileged, token)
        # Response of toggle should be 200 - Success
        self.assertEqual(response.status_code, 200, f"Invalid response {response.status_code}")
        
        # Respone should contain new status
        self.assertIn("sensorsActive", response.json(), "Sensor status not found in response")

    # Normal usage, unprivileged user denied privileged action
    def test_unprivileged_user(self):
        token = self.login(unprivileged)
        response = self.toggle(unprivileged, token)
        # Response of toggle should be 400 - Unauthorized
        self.assertEqual(response.status_code, 400, f"Invalid response {response.status_code}")
        
        # Respone should inform user of unauthorized action
        self.assertIn("error", response.json(), "Error not found in response")

    # Fail case, fake privileged user performing privileged action
    def test_fake_privileged_user(self):
        token = self.login(fake_privileged)
        code = self.toggle(fake_privileged, token)
        # Status code should be 400 - Unauthorized, but will be 200
        self.assertEqual(code, 400, err_priv)
    
    """ Insecure Authentication: Our system currently does not encrypt passwords or validate them for the user on login. """
    
    """ Bad Input Validation and Sanitization: No content or length requirements set for username or password, and can contain invalid characters and harmful injection sequences. (E.g. SQL/JS injection, spaces in “Mike”/“Mike “) """

    """ Insecure Token Management: Because we store a copy of a user's current session token locally, that could be copied along with their username from cookies to validate insecure requests."""


if __name__ == '__main__':
    unittest.main()