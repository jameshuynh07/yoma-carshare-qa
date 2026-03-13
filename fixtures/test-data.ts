export const LOCATIONS = {
  mandalayCity: 'Mandalay City (Chan Mya Thar Si)',
  mandalayAirport: 'Mandalay Airport, Tada-U',
  baganAirport: 'Bagan Airport, Bagan',
  starCity: 'Star City (Wings#C, Building A5, Zone A), Thanlyin',
  capitalHypermarket: 'Capital Hypermarket (Tharkayta)',
};

export const DATES = {
  pickup: '16-03-2026',
  returnDate: '24-03-2026',
  pickupTime: '12:00 AM',
  returnTime: '7:00 AM',
};

export const CREDENTIALS = {
  email: process.env.TEST_EMAIL ?? 'jamestest@yopmail.com',
  password: process.env.TEST_PASSWORD ?? 'Test@12345',
};

export const EXPECTED = {
  membershipGateMessage:
    'Your Yoma Car Share account is under the review for the membership approval process.',
  carNotFound: 'Car not found.',
  kmCharge: 'MMK 420',
  lateCharge: 'MMK 10,000',
};
