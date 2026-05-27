export const AIRPORTS = {
  NZNE: { name: 'Dairy Flat', city: 'Auckland', tz: 'Pacific/Auckland', offset: 12 },
  YSSY: { name: 'Sydney Airport', city: 'Sydney', tz: 'Australia/Sydney', offset: 10 },
  NZRO: { name: 'Rotorua Airport', city: 'Rotorua', tz: 'Pacific/Auckland', offset: 12 },
  NZCI: { name: 'Tuuta Airport', city: 'Chatham Islands', tz: 'Pacific/Chatham', offset: 12.75 },
  NZGB: { name: 'Claris Airport', city: 'Great Barrier Island', tz: 'Pacific/Auckland', offset: 12 },
  NZTL: { name: 'Lake Tekapo Airport', city: 'Lake Tekapo', tz: 'Pacific/Auckland', offset: 12 },
};

export const AIRCRAFT = {
  SJ30i: { name: 'SyberJet SJ30i', capacity: 6 },
  SF50: { name: 'Cirrus SF50', capacity: 4 },
  HondaJet: { name: 'HondaJet Elite', capacity: 5 },
};

export const ROUTES = [
  { id: 'SYD', origin: 'NZNE', destination: 'YSSY', aircraft: 'SJ30i', price: 1200 },
  { id: 'SYD_RET', origin: 'YSSY', destination: 'NZNE', aircraft: 'SJ30i', price: 1200 },
  { id: 'ROA', origin: 'NZNE', destination: 'NZRO', aircraft: 'SF50', price: 250 },
  { id: 'ROA_RET', origin: 'NZRO', destination: 'NZNE', aircraft: 'SF50', price: 250 },
  { id: 'GBI', origin: 'NZNE', destination: 'NZGB', aircraft: 'SF50', price: 180 },
  { id: 'GBI_RET', origin: 'NZGB', destination: 'NZNE', aircraft: 'SF50', price: 180 },
  { id: 'CHT', origin: 'NZNE', destination: 'NZCI', aircraft: 'HondaJet', price: 450 },
  { id: 'CHT_RET', origin: 'NZCI', destination: 'NZNE', aircraft: 'HondaJet', price: 450 },
  { id: 'TEK', origin: 'NZNE', destination: 'NZTL', aircraft: 'HondaJet', price: 350 },
  { id: 'TEK_RET', origin: 'NZTL', destination: 'NZNE', aircraft: 'HondaJet', price: 350 },
];
