export interface QuoteFormState {
  serviceType: string;
  wantBundle: string;
  bundleChoice: string;
  selectedServices: string[];
  plumbingIssues: string[];
  electricalIssues: string[];
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
}

export type FormAction =
  | { type: 'SET_FIELD'; field: keyof QuoteFormState; value: string }
  | { type: 'TOGGLE_MULTI'; field: 'selectedServices' | 'plumbingIssues' | 'electricalIssues'; value: string }
  | { type: 'CLEAR_ARRAY'; field: 'plumbingIssues' | 'electricalIssues' }
  | { type: 'RESET' };

export const initialFormState: QuoteFormState = {
  serviceType: '',
  wantBundle: '',
  bundleChoice: '',
  selectedServices: [],
  plumbingIssues: [],
  electricalIssues: [],
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
};

export function formReducer(state: QuoteFormState, action: FormAction): QuoteFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_MULTI': {
      const arr = state[action.field] as string[];
      const newArr = arr.includes(action.value)
        ? arr.filter(v => v !== action.value)
        : [...arr, action.value];
      return { ...state, [action.field]: newArr };
    }
    case 'CLEAR_ARRAY':
      return { ...state, [action.field]: [] };
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
  'Window Washing (Interior & Exterior)',
  'Window Washing (Exterior only)',
  'Gutter Cleaning',
  'Pressure Washing (Home Exterior)',
  'Pressure Washing (Driveway & Patio)',
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
