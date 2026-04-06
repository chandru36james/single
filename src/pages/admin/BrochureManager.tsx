import React from 'react';
import { BrochureForm } from '../../components/brochure/BrochureForm';
import { BrochurePreview } from '../../components/brochure/BrochurePreview';
import { BrochureHistory } from '../../components/brochure/BrochureHistory';
import { BrochureData } from '../../lib/pricing';
import { FileText, Eye, Layout, Printer, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BrochureManager: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'form' | 'preview' | 'history'>('form');
  const [previewData, setPreviewData] = React.useState<BrochureData | null>(null);

  const handleEdit = (data: BrochureData) => {
    setPreviewData(data);
    setActiveTab('form');
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-12">
        <div>
          <h1 className="text-4xl font-bold italic serif mb-2">Brochure Builder</h1>
          <p className="text-neutral-500 text-sm">Create and manage premium proposals for your clients.</p>
        </div>
        
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'form' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Layout size={18} />
            Builder
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'preview' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Eye size={18} />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'history' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <History size={18} />
            History
          </button>
        </div>
      </header>

      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <BrochureForm onPreview={setPreviewData} initialData={previewData} />
            </motion.div>
          ) : activeTab === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-100 p-12 rounded-3xl overflow-auto max-h-[1200px]"
            >
              <div className="flex justify-center mb-8">
                <button 
                  onClick={() => window.print()}
                  className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xl"
                >
                  <Printer size={18} />
                  Print Proposal
                </button>
              </div>
              {previewData && <BrochurePreview data={previewData} />}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <BrochureHistory onEdit={handleEdit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
