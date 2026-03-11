export interface QuoteFormState {
  serviceType: string;
  wantBundle: string;
  bundleChoice: string;
  selectedServices: string[];
  plumbingIssues: string[];
  electricalIssues: string[];
  handymanProjects: string;
  city: string;
  squareFootage: string;
  stories: string;
  lotSize: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  state: string;
  zipCode: string;
  // New property lookup fields
  exactSquareFootage: number | null;
  exactLotSize: number | null;
  exactStories: number | null;
  propertyAddress: string;
  propertyDataSource: 'RentCast' | 'RentCast (Corrected)' | 'Manual Entry' | '';
}

export type FormAction =
  | { type: 'SET_FIELD'; field: keyof QuoteFormState; value: string }
  | { type: 'SET_NUMBER_FIELD'; field: 'exactSquareFootage' | 'exactLotSize' | 'exactStories'; value: number | null }
  | { type: 'SET_PROPERTY_DATA'; data: PropertyLookupData }
  | { type: 'TOGGLE_MULTI'; field: 'selectedServices' | 'plumbingIssues' | 'electricalIssues'; value: string }
  | { type: 'CLEAR_ARRAY'; field: 'plumbingIssues' | 'electricalIssues' }
  | { type: 'CLEAR_PROPERTY_LOOKUP' }
  | { type: 'SET_PREFILL'; data: Partial<QuoteFormState> }
  | { type: 'RESET' };

export interface PropertyLookupData {
  squareFootage: number;
  lotSize: number;
  stories: number;
  formattedAddress: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const initialFormState: QuoteFormState = {
  serviceType: '',
  wantBundle: '',
  bundleChoice: '',
  selectedServices: [],
  plumbingIssues: [],
  electricalIssues: [],
  handymanProjects: '',
  city: '',
  squareFootage: '',
  stories: '',
  lotSize: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  addressLine2: '',
  state: '',
  zipCode: '',
  // New property lookup fields
  exactSquareFootage: null,
  exactLotSize: null,
  exactStories: null,
  propertyAddress: '',
  propertyDataSource: '',
};

export function formReducer(state: QuoteFormState, action: FormAction): QuoteFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_NUMBER_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_PROPERTY_DATA': {
      const { squareFootage, lotSize, stories, formattedAddress, city, state: propState, zipCode } = action.data;
      return {
        ...state,
        exactSquareFootage: squareFootage,
        exactLotSize: lotSize,
        exactStories: stories,
        squareFootage: mapSquareFootageToBucket(squareFootage),
        lotSize: mapLotSizeToBucket(lotSize),
        stories: mapStoriesToBucket(stories),
        propertyAddress: formattedAddress,
        propertyDataSource: 'RentCast',
        // Also populate city/state/zip if provided and not already filled
        city: city || state.city,
        state: propState || state.state,
        zipCode: zipCode || state.zipCode,
      };
    }
    case 'TOGGLE_MULTI': {
      const arr = state[action.field] as string[];
      const newArr = arr.includes(action.value)
        ? arr.filter(v => v !== action.value)
        : [...arr, action.value];
      return { ...state, [action.field]: newArr };
    }
    case 'CLEAR_ARRAY':
      return { ...state, [action.field]: [] };
    case 'CLEAR_PROPERTY_LOOKUP':
      return {
        ...state,
        exactSquareFootage: null,
        exactLotSize: null,
        exactStories: null,
        squareFootage: '',
        lotSize: '',
        stories: '',
        propertyAddress: '',
        propertyDataSource: '',
      };
    case 'SET_PREFILL':
      return { ...state, ...action.data };
    case 'RESET':
      return initialFormState;
  }
}

export const SERVICE_TYPE_OPTIONS = ['Annual Plan', 'Home TuneUp', 'Single Service'];

export const BUNDLE_OPTIONS = [
  { name: 'Try Us Out', savings: 'Savings up to $700' },
  { name: 'Home Refresh', savings: 'Savings up to $1,030' },
  { name: 'Seasonal Spirit', savings: 'Savings up to $1,045' },
  { name: 'The Handld Home', savings: 'Savings up to $2,075' },
  { name: 'Build Your Own Bundle', savings: '' },
];

export const SERVICE_OPTIONS = [
  'Handyman',
  'Plumbing Repairs',
  'Electrical Repairs',
  'Home TuneUp',
  'Window Washing - Interior & Exterior',
  'Window Washing - Exterior',
  'Gutter Cleaning',
  'Pressure Washing - Home Exterior',
  'Pressure Washing - Driveway & Patio',
  'Pest Control',
  'Trash Bin Cleaning',
  'Outdoor Furniture Cleaning',
  'Holiday Lights Install & Take Down',
];

export const PLUMBING_OPTIONS = [
  'Drain cleaning/clog removal',
  'Toilet replacement',
  'Toilet repair',
  'Faucet replacement',
  'Faucet repair',
  'Garbage disposal replacement',
  'Garbage disposal repair',
  'Pipe leak repair',
  'Shut-off valve replacement',
  'Other plumbing issue',
];

export const ELECTRICAL_OPTIONS = [
  'EV charger installation',
  'Outlet repair/replacement',
  'GFCI outlet installation',
  'Light switch replacement',
  'Dimmer switch installation',
  'Ceiling fan installation',
  'Light fixture installation',
  'Smoke/CO detector installation',
  'Circuit breaker issue',
  'Outdoor outlet installation',
  'Other electrical issue',
];

export const CITY_OPTIONS = ['Glendale', 'La Cañada', 'Pasadena', 'San Marino', 'South Pasadena', 'Other'];

export const SQFT_OPTIONS = [
  'Less than 1,600 sq. feet',
  '1,600-2,500 sq. feet',
  '2,500-4,500 sq. feet',
  '4,500+ sq. feet',
];

export const STORY_OPTIONS = ['One', 'Two', 'Three'];

export const LOT_OPTIONS = [
  'Less than 5,000 sq. feet',
  '5,000-10,000 sq. feet',
  '10,000-20,000 sq. feet',
  'Greater than 20,000 sq. feet',
];

// Mapping functions to convert exact values to pricing bucket strings
export function mapSquareFootageToBucket(sqft: number): string {
  if (sqft < 1600) return 'Less than 1,600 sq. feet';
  if (sqft < 2500) return '1,600-2,500 sq. feet';
  if (sqft < 4500) return '2,500-4,500 sq. feet';
  return '4,500+ sq. feet';
}

export function mapLotSizeToBucket(lotSize: number): string {
  if (lotSize < 5000) return 'Less than 5,000 sq. feet';
  if (lotSize < 10000) return '5,000-10,000 sq. feet';
  if (lotSize < 20000) return '10,000-20,000 sq. feet';
  return 'Greater than 20,000 sq. feet';
}

export function mapStoriesToBucket(stories: number): string {
  if (stories === 1) return 'One';
  // Treat 2+ stories as "Two" since we don't have a "Three" option that maps differently
  return 'Two';
}
