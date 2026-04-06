import React from 'react';
import { Check } from 'lucide-react';
import { PACKAGES, Package } from '../../lib/pricing';

interface PackageSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PACKAGES.map((pkg) => (
        <button
          key={pkg.id}
          type="button"
          onClick={() => onSelect(pkg.id)}
          className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
            selectedId === pkg.id
              ? 'border-neutral-900 bg-neutral-900 text-white shadow-xl scale-[1.02]'
              : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400'
          }`}
        >
          {selectedId === pkg.id && (
            <div className="absolute top-4 right-4 bg-white text-neutral-900 rounded-full p-1">
              <Check size={16} />
            </div>
          )}
          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <p className={`text-sm mb-4 ${selectedId === pkg.id ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {pkg.description}
          </p>
          <div className="text-2xl font-bold mb-6 italic serif">
            ₹{pkg.basePrice.toLocaleString()}
          </div>
          <ul className="space-y-2">
            {pkg.includedServices.map((service, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <Check size={12} className="mt-0.5 shrink-0" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
};
