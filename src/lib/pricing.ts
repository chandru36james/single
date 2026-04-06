export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  includedServices: string[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export const PACKAGES: Package[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential coverage for intimate events.',
    basePrice: 25000,
    includedServices: [
      '4 Hours Coverage',
      '1 Photographer',
      '50 Edited High-Res Photos',
      'Online Gallery'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Comprehensive coverage with cinematic touch.',
    basePrice: 55000,
    includedServices: [
      '8 Hours Coverage',
      '2 Photographers',
      '1 Cinematographer',
      '150 Edited High-Res Photos',
      '3-5 Min Highlight Film',
      'Online Gallery'
    ]
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'The ultimate visual narrative experience.',
    basePrice: 120000,
    includedServices: [
      'Full Day Coverage (12 Hours)',
      '3 Photographers',
      '2 Cinematographers',
      'All Edited High-Res Photos',
      '10-15 Min Cinematic Film',
      'Premium Coffee Table Book',
      'Drone Coverage'
    ]
  }
];

export const ADDONS: Addon[] = [
  { id: 'drone', name: 'Drone Shoot', price: 15000 },
  { id: 'pre-wedding', name: 'Pre-Wedding Shoot', price: 25000 },
  { id: 'extra-hours', name: 'Extra Hours (per hour)', price: 5000 },
  { id: 'album', name: 'Premium Album', price: 12000 },
  { id: 'travel', name: 'Travel & Accommodation', price: 10000 }
];

export interface BrochureData {
  clientName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  packageId: string;
  selectedAddons: string[];
  discountValue: number;
  discountType: 'amount' | 'percent';
}

export const calculatePricing = (data: BrochureData) => {
  const selectedPackage = PACKAGES.find(p => p.id === data.packageId);
  const basePrice = selectedPackage?.basePrice || 0;
  
  const addonsTotal = data.selectedAddons.reduce((total, addonId) => {
    const addon = ADDONS.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);

  const subtotal = basePrice + addonsTotal;
  
  let discount = 0;
  if (data.discountType === 'amount') {
    discount = data.discountValue;
  } else {
    discount = (subtotal * data.discountValue) / 100;
  }

  const finalPrice = Math.max(0, subtotal - discount);

  return {
    basePrice,
    addonsTotal,
    subtotal,
    discount,
    finalPrice
  };
};
