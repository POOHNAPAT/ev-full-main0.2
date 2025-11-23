import vehiclesByStation from './vehicles.json';

export function loadVehicles(stationSerial) {
  if (!stationSerial) return [];
  return vehiclesByStation[stationSerial] ? vehiclesByStation[stationSerial].slice() : [];
}

export default vehiclesByStation;
