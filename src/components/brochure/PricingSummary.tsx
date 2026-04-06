import React from 'react';
import { calculatePricing, BrochureData } from '../../lib/pricing';

interface PricingSummaryProps {
  data: BrochureData;
}

export const PricingSummary: React.FC<PricingSummaryProps> = ({ data }) => {
  const pricing = calculatePricing(data);

  return (
    <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-2xl sticky top-8">
      <h3 className="text-2xl font-bold mb-8 italic serif border-b border-neutral-800 pb-4">
        Pricing Summary
      </h3>
      
      <div className="space-y-6 mb-10">
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-400">Base Package</span>
          <span className="font-medium">₹{pricing.basePrice.toLocaleString()}</span>
        </div>
        
        {pricing.addonsTotal > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400">Add-ons Total</span>
            <span className="font-medium">₹{pricing.addonsTotal.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm border-t border-neutral-800 pt-4">
          <span className="text-neutral-400">Subtotal</span>
          <span className="font-medium">₹{pricing.subtotal.toLocaleString()}</span>
        </div>
        
        {pricing.discount > 0 && (
          <div className="flex justify-between items-center text-sm text-red-400">
            <span>Discount Applied</span>
            <span className="font-medium">- ₹{pricing.discount.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-neutral-800 pt-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-1 block">
              Final Investment
            </span>
            <div className="text-4xl font-bold italic serif text-white">
              ₹{pricing.finalPrice.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">
              Inclusive of all taxes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
