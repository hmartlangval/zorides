// India Location Data Structure
// Add states and districts as needed

export type LocationData = {
  [state: string]: string[]; // state name -> array of districts
};

export const INDIA_LOCATIONS: LocationData = {
  // Example structure - add more states and districts as needed
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane"],
  "Karnataka": ["Bangalore Urban", "Mysore", "Belgaum"],
  // Add more states here...
};

export const getStates = (): string[] => {
  return Object.keys(INDIA_LOCATIONS).sort();
};

export const getDistricts = (state: string): string[] => {
  return INDIA_LOCATIONS[state]?.sort() || [];
};
