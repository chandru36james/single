import React from 'react';
import { storage } from '../../lib/storage';
import { BrochureData, PACKAGES } from '../../lib/pricing';
import { Trash2, Edit2, Copy, Clock, User, Calendar, IndianRupee, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';

interface SavedBrochure extends BrochureData {
  id: string;
  totalPrice: number;
  createdAt: any;
  updatedAt: any;
  authorId: string;
}

interface BrochureHistoryProps {
  onEdit: (data: BrochureData) => void;
}

export const BrochureHistory: React.FC<BrochureHistoryProps> = ({ onEdit }) => {
  const [brochures, setBrochures] = React.useState<SavedBrochure[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchBrochures = async () => {
    setLoading(true);
    try {
      const brochuresData = await storage.getBrochures();
      setBrochures(brochuresData as SavedBrochure[]);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load brochure history');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBrochures();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brochure from history?')) return;
    try {
      await storage.deleteBrochure(id);
      toast.success('Brochure deleted');
      fetchBrochures();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  const handleDuplicate = (brochure: SavedBrochure) => {
    const { id, createdAt, updatedAt, authorId, totalPrice, ...cleanData } = brochure;
    const duplicatedData: BrochureData = {
      ...cleanData,
      clientName: `${cleanData.clientName} (Copy)`,
    };
    onEdit(duplicatedData);
    toast.info('Draft copy created in builder. Review and save.');
  };

  const filteredBrochures = brochures.filter(b => 
    b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm) ||
    b.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
        <p className="text-neutral-500 font-medium">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, phone or event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-neutral-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBrochures.map((brochure) => (
          <div 
            key={brochure.id}
            className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-neutral-900">{brochure.clientName}</h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock size={12} />
                  {formatDate(brochure.createdAt)}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDuplicate(brochure)}
                  className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-blue-600 transition-colors"
                  title="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(brochure.id)}
                  className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Calendar size={14} className="text-neutral-400" />
                <span>{brochure.eventType} • {brochure.eventDate || 'TBD'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <User size={14} className="text-neutral-400" />
                <span>{brochure.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-neutral-900">
                <IndianRupee size={14} className="text-neutral-400" />
                <span>₹{brochure.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => onEdit(brochure)}
              className="w-full py-3 rounded-xl border border-neutral-900 text-neutral-900 font-bold text-sm hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Edit2 size={14} />
              Edit in Builder
            </button>
          </div>
        ))}

        {filteredBrochures.length === 0 && (
          <div className="col-span-full p-20 text-center bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
            <p className="text-neutral-500 font-medium">No brochures found in history.</p>
          </div>
        )}
      </div>
    </div>
  );
};
