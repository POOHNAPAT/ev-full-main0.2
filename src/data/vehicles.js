const vehiclesByStation = {
  ST001: [
    { vehicleId: 'V-ST001-01', plate: 'กท-1234', model: 'Nissan Leaf', owner: 'นายสมชาย' },
    { vehicleId: 'V-ST001-02', plate: 'กร-5678', model: 'MG ZS EV', owner: 'นางสาวชลธิชา' }
  ],
  ST002: [
    { vehicleId: 'V-ST002-01', plate: 'ขก-4321', model: 'Tesla Model 3', owner: 'นายวัฒนา' }
  ],
  ST003: [
    { vehicleId: 'V-ST003-01', plate: 'ชย-1111', model: 'BYD Atto 3', owner: 'นางสาวปวีณา' }
  ],
  ST004: [
    { vehicleId: 'V-ST004-01', plate: 'หญ-2222', model: 'MG 4 EV', owner: 'นายสุมิตร' }
  ],
  ST005: [
    { vehicleId: 'V-ST005-01', plate: 'นม-3333', model: 'Ora Good Cat', owner: 'นางสาวอร' }
  ],
  ST006: [
    { vehicleId: 'V-ST006-01', plate: 'ปจ-4444', model: 'Kia EV6', owner: 'นายธนพล' }
  ]
};

export function loadVehicles(stationSerial) {
  if (!stationSerial) return [];
  return vehiclesByStation[stationSerial] ? vehiclesByStation[stationSerial].slice() : [];
}

export default vehiclesByStation;
