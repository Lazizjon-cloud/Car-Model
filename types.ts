
export enum CarStyle {
  SUPERCAR = 'Supercar',
  SUV = 'Luxury SUV',
  SEDAN = 'Executive Sedan',
  OFFROAD = 'Off-Road Beast',
  HYPERCAR = 'Track-Focused Hypercar',
  EV_FUTURISTIC = 'Next-Gen EV'
}

export enum FuelType {
  ELECTRIC = 'Electric',
  HYDROGEN = 'Hydrogen',
  HYBRID = 'Hybrid',
  V12_GAS = 'V12 Gasoline'
}

export interface PerformanceStats {
  topSpeed: number; // mph
  acceleration: number; // 0-60 in seconds
  range: number; // miles
  horsepower: number;
}

export interface CarModel {
  id: string;
  name: string;
  brand: string;
  style: CarStyle;
  fuel: FuelType;
  primaryColor: string;
  description: string;
  specs: PerformanceStats;
  imageUrl: string;
  features: string[];
  launchYear: number;
}

export interface ConfigOptions {
  style: CarStyle;
  fuel: FuelType;
  color: string;
  additionalPrompt: string;
}
