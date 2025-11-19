# TODO: Implement Mock Authentication for Login and Signup

## Tasks
- [x] Create src/data/users.js with sample user data for demo purposes
- [x] Update AuthContext.jsx to use local authentication logic with localStorage for persistence, replacing Firebase calls
- [x] Remove unused username field from LoginSignup.jsx
- [x] Add authLoading state for loading feedback during auth operations
- [x] Make logout async with loading state
- [x] Update logout button to be async and show loading text

## Notes
- Switching to mock auth since Firebase config has placeholders
- Use localStorage to persist user session
- Ensure login/signup redirects to home and maintains state
- Demo accounts: user1@example.com / password123, demo@evcharger.com / demo123
