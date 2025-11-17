# EV Full Demo

### Features in this ZIP
- React + Vite
- Leaflet map (OpenStreetMap tiles)
- Firebase Authentication (email/password) - placeholder config (replace with your Firebase project values)
- Simple UI using Tailwind CDN

### How to run

1. Unzip the project
2. In project folder, run:
   ```
   npm install
   ```
3. Replace `src/firebaseConfig.js` content with your Firebase config from the console.
4. Run dev server:
   ```
   npm run dev
   ```
5. Open http://localhost:5173

### Notes
- Leaflet uses OSM tiles and does not require an API key.
- Firebase requires creating a project in https://console.firebase.google.com and enabling Email/Password sign-in in Authentication settings.
