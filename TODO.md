# TODO: Display Added Vehicles in Profile Page

## Approved Plan Breakdown
- Modify AddVehicle.jsx to save vehicle data to localStorage when submitting the form.
- Modify Profile.jsx to load vehicles from localStorage and display them in a new "Vehicles" section.

## Logical Steps
1. Update AddVehicle.jsx: In handleSubmit, when submitting (step 3), create a vehicle object and save it to localStorage array. ✅
2. Update Profile.jsx: Add useState for vehicles, useEffect to load from localStorage, and add a vehicles display section. ✅
3. Test the flow: Add a vehicle, navigate to Profile, verify it displays.
