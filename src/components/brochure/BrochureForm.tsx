import React from 'react';
import { PackageSelector } from './PackageSelector';
import { PricingSummary } from './PricingSummary';
import { BrochureData, ADDONS, PACKAGES, calculatePricing } from '../../lib/pricing';
import { api } from '../../lib/api';
import { Download, Share2, Send, Loader2, CheckCircle2, Phone, Mail, Calendar, MapPin, User, Tag, Percent, IndianRupee, Save } from 'lucide-react';
import { storage } from '../../lib/storage';
import { toast } from 'sonner';

interface BrochureFormProps {
  onPreview: (data: BrochureData) => void;
  initialData?: BrochureData | null;
}

export const BrochureForm: React.FC<BrochureFormProps> = ({ onPreview, initialData }) => {
  const [data, setData] = React.useState<BrochureData>(initialData || {
    clientName: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    eventDate: '',
    location: '',
    packageId: 'premium',
    selectedAddons: [],
    discountValue: 0,
    discountType: 'amount'
  });

  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [generatedUrl, setGeneratedUrl] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddonToggle = (addonId: string) => {
    setData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId]
    }));
  };

  const handleSaveToHistory = async () => {
    if (!data.clientName || !data.phone) {
      toast.error('Please fill in required fields (Name & Phone)');
      return;
    }

    setIsSaving(true);
    try {
      const pricing = calculatePricing(data);
      const brochureData = {
        ...data,
        totalPrice: pricing.finalPrice,
        authorId: 'admin'
      };

      await storage.addBrochure(brochureData);
      toast.success('Brochure saved to history!');
    } catch (error) {
      console.error('Error saving brochure:', error);
      toast.error('Failed to save brochure');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!data.clientName || !data.phone) {
      toast.error('Please fill in required fields (Name & Phone)');
      return;
    }

    setIsGenerating(true);
    try {
      const pricing = calculatePricing(data);
      const blob = await api.post('/api/brochure/generate', { ...data, ...pricing });

      if (!(blob instanceof Blob)) throw new Error('Failed to generate PDF blob');

      const url = window.URL.createObjectURL(blob);
      setGeneratedUrl(url);
      toast.success('Brochure generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate brochure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedUrl) return;
    const link = document.createElement('a');
    link.href = generatedUrl;
    link.download = `Proposal_${data.clientName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsApp = () => {
    const pricing = calculatePricing(data);
    const message = `*Singleframe Studio - Personalized Proposal*\n\nHello ${data.clientName}!\n\nWe are excited to share the personalized proposal for your upcoming ${data.eventType} on ${data.eventDate || 'TBD'}.\n\n*Investment Details:*\n- Package: ${PACKAGES.find(p => p.id === data.packageId)?.name}\n- Total Investment: ₹${pricing.finalPrice.toLocaleString()}\n\nYou can view and download your detailed proposal here: ${generatedUrl || 'Link coming soon'}\n\nLooking forward to capturing your visual legacy!\n\nBest regards,\nSingleframe Studio`;
    const url = `https://wa.me/${data.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const pricing = calculatePricing(data);
    const subject = `Proposal for ${data.eventType} - ${data.clientName}`;
    const body = `Hello ${data.clientName},\n\nPlease find the personalized proposal for your ${data.eventType} on ${data.eventDate || 'TBD'}.\n\nTotal Investment: ₹${pricing.finalPrice.toLocaleString()}\n\nView Proposal: ${generatedUrl || 'Link coming soon'}\n\nBest regards,\nSingleframe Studio`;
    const url = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  React.useEffect(() => {
    onPreview(data);
  }, [data, onPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12 pb-20">
        {/* Client Details */}
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 italic serif text-neutral-900">
            <User size={20} className="text-neutral-400" />
            Client Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Client Name *</label>
              <input
                type="text"
                name="clientName"
                value={data.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm text-neutral-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm text-neutral-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Email Address</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm text-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Event Type</label>
              <select
                name="eventType"
                value={data.eventType}
                onChange={handleChange}
                className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm appearance-none text-neutral-900"
              >
                <option>Wedding</option>
                <option>Modelling</option>
                <option>Product</option>
                <option>Commercial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Event Date</label>
              <input
                type="date"
                name="eventDate"
                value={data.eventDate}
                onChange={handleChange}
                className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm text-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Location</label>
              <input
                type="text"
                name="location"
                value={data.location}
                onChange={handleChange}
                placeholder="Event location"
                className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm text-neutral-900"
              />
            </div>
          </div>
        </section>

        {/* Package Selection */}
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 italic serif text-neutral-900">
            <Tag size={20} className="text-neutral-400" />
            Package Selection
          </h3>
          <PackageSelector
            selectedId={data.packageId}
            onSelect={(id) => setData(prev => ({ ...prev, packageId: id }))}
          />
        </section>

        {/* Add-ons */}
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 italic serif text-neutral-900">
            <CheckCircle2 size={20} className="text-neutral-400" />
            Enhancements & Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADDONS.map((addon) => (
              <label
                key={addon.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  data.selectedAddons.includes(addon.id)
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-100 bg-white hover:border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={data.selectedAddons.includes(addon.id)}
                    onChange={() => handleAddonToggle(addon.id)}
                    className="w-4 h-4 accent-neutral-900"
                  />
                  <span className="text-sm font-medium text-neutral-900">{addon.name}</span>
                </div>
                <span className="text-xs italic serif text-neutral-500">₹{addon.price.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Discount Section */}
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 italic serif text-neutral-900">
            <Percent size={20} className="text-neutral-400" />
            Special Discount
          </h3>
          <div className="flex items-end gap-6 max-w-md">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Discount Value</label>
              <div className="relative">
                <input
                  type="number"
                  name="discountValue"
                  value={data.discountValue}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-white border-b-2 border-neutral-100 p-3 focus:border-neutral-900 transition-all outline-none text-sm pr-10 text-neutral-900"
                />
                <div className="absolute right-3 top-3 text-neutral-400">
                  {data.discountType === 'amount' ? <IndianRupee size={16} /> : <Percent size={16} />}
                </div>
              </div>
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setData(prev => ({ ...prev, discountType: 'amount' }))}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                  data.discountType === 'amount' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
                }`}
              >
                ₹
              </button>
              <button
                type="button"
                onClick={() => setData(prev => ({ ...prev, discountType: 'percent' }))}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                  data.discountType === 'percent' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
                }`}
              >
                %
              </button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-8 border-t border-neutral-100">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 min-w-[200px] bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Generate Proposal
              </>
            )}
          </button>

          <button
            onClick={handleSaveToHistory}
            disabled={isSaving}
            className="flex-1 min-w-[200px] bg-white border-2 border-neutral-900 text-neutral-900 p-4 rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {isSaving ? 'Saving...' : 'Save to History'}
          </button>
          
          {generatedUrl && (
            <>
              <button
                onClick={handleDownload}
                className="bg-white border-2 border-neutral-900 text-neutral-900 px-6 py-4 rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <Share2 size={20} />
                WhatsApp
              </button>
              <button
                onClick={handleEmail}
                className="bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Send size={20} />
                Email
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pricing Summary Sidebar */}
      <div className="lg:col-span-1">
        <PricingSummary data={data} />
      </div>
    </div>
  );
};
