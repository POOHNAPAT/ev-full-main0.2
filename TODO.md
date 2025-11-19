# TODO: Fix Register and Login Functionality

## Tasks
- [ ] Update LoginSignup.jsx to use email field for login instead of username, and remove unused username field from signup
- [ ] Test login functionality by attempting to log in with valid credentials
- [ ] Test signup functionality by creating a new account
- [ ] Verify that after login/signup, user is redirected to home page and authentication state is maintained

## Notes
- Firebase auth is already set up in AuthContext.jsx
- Form data handling needs to be consistent with Firebase requirements (email and password only)
- Ensure error handling displays properly for invalid credentials or signup issues
