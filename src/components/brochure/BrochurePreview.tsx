import React from 'react';
import { BrochureData, calculatePricing, PACKAGES, ADDONS } from '../../lib/pricing';
import { Quote, CheckCircle2, Phone, Mail, MapPin, Globe } from 'lucide-react';

interface BrochurePreviewProps {
  data: BrochureData;
}

export const BrochurePreview: React.FC<BrochurePreviewProps> = ({ data }) => {
  const pricing = calculatePricing(data);
  const selectedPackage = PACKAGES.find(p => p.id === data.packageId);
  const selectedAddons = data.selectedAddons.map(id => ADDONS.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="bg-white shadow-2xl w-full max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] text-neutral-900 font-sans print:shadow-none print:p-0 print:m-0 print:w-full print:h-full">
      {/* Cover Page */}
      <div className="h-[267mm] flex flex-col justify-between border-8 border-neutral-900 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-900/5 -rotate-45 translate-x-32 -translate-y-32"></div>
        
        <div className="z-10">
          <div className="text-4xl font-bold italic serif tracking-tighter mb-2">SINGLEFRAME</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Boutique Visual Studio</div>
        </div>

        <div className="z-10">
          <div className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mb-6">Proposal For</div>
          <h1 className="text-6xl font-bold italic serif leading-none mb-4">{data.clientName || 'Valued Client'}</h1>
          <div className="flex items-center gap-6 text-sm font-medium border-t border-neutral-200 pt-6">
            <span className="uppercase tracking-widest">{data.eventType || 'Event'}</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
            <span>{data.eventDate || 'Date TBD'}</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
            <span>{data.location || 'Location TBD'}</span>
          </div>
        </div>

        <div className="z-10 flex justify-between items-end">
          <div className="max-w-xs text-xs text-neutral-500 leading-relaxed">
            We don't just capture moments; we craft visual legacies. This proposal outlines our commitment to your unique narrative.
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Estimated Investment</div>
            <div className="text-3xl font-bold italic serif">₹{pricing.finalPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Page Break for Print */}
      <div className="print:page-break-before-always mt-20 print:mt-0"></div>

      {/* About & Services */}
      <div className="py-12">
        <div className="grid grid-cols-12 gap-12 mb-20">
          <div className="col-span-5">
            <h2 className="text-3xl font-bold italic serif mb-6">The Studio</h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              Singleframe is a boutique visual studio dedicated to high-impact storytelling. We specialize in cinematic aesthetics and editorial-grade imagery for those who value artistry over the ordinary.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <Phone size={14} /> <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <Mail size={14} /> <span>hello@singleframe.in</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <Globe size={14} /> <span>www.singleframe.in</span>
              </div>
            </div>
          </div>
          <div className="col-span-7 bg-neutral-50 p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-neutral-900" />
              Selected Package: {selectedPackage?.name}
            </h2>
            <ul className="grid grid-cols-1 gap-4">
              {selectedPackage?.includedServices.map((service, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                  <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></div>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selectedAddons.length > 0 && (
          <div className="mb-20">
            <h2 className="text-xl font-bold mb-6 italic serif">Enhancements & Add-ons</h2>
            <div className="grid grid-cols-2 gap-4">
              {selectedAddons.map((addon, i) => (
                <div key={i} className="border border-neutral-100 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-medium">{addon?.name}</span>
                  <span className="text-xs text-neutral-500 italic serif">₹{addon?.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-neutral-900 text-white p-10 rounded-3xl mb-20">
          <h2 className="text-2xl font-bold italic serif mb-8 border-b border-neutral-800 pb-4">Investment Breakdown</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Base Package ({selectedPackage?.name})</span>
              <span>₹{pricing.basePrice.toLocaleString()}</span>
            </div>
            {pricing.addonsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Additional Enhancements</span>
                <span>₹{pricing.addonsTotal.toLocaleString()}</span>
              </div>
            )}
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-red-400">
                <span>Special Discount</span>
                <span>- ₹{pricing.discount.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="border-t border-neutral-800 pt-6 flex justify-between items-end">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Total Investment</div>
              <div className="text-4xl font-bold italic serif">₹{pricing.finalPrice.toLocaleString()}</div>
            </div>
            <div className="text-xs text-neutral-500 italic">Valid for 15 days from the date of proposal.</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Terms & Conditions</h3>
            <ul className="text-[10px] text-neutral-500 space-y-2 leading-relaxed">
              <li>• 50% advance to block the dates (non-refundable).</li>
              <li>• Balance 50% to be paid 7 days before the event.</li>
              <li>• Raw footage will not be shared unless explicitly mentioned.</li>
              <li>• Travel and accommodation to be provided by the client for outstation events.</li>
              <li>• Delivery timeline: 4-6 weeks post selection of photos.</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center items-center text-center border-l border-neutral-100 pl-12">
            <Quote className="text-neutral-200 mb-4" size={32} />
            <p className="text-xs italic text-neutral-600 mb-6 font-medium">
              "Photography is the only language that can be understood anywhere in the world."
            </p>
            <div className="text-[10px] uppercase tracking-widest font-bold">Singleframe Studio</div>
          </div>
        </div>
      </div>
    </div>
  );
};
