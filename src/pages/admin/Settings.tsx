import React from 'react';
import { storage } from '../../lib/storage';
import { Save, Globe, Search, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface GlobalSettings {
  siteName: string;
  globalSeo: {
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string;
  };
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = React.useState<GlobalSettings>({
    siteName: 'My App',
    globalSeo: {
      titleTemplate: '%s | My App',
      defaultDescription: '',
      defaultKeywords: ''
    }
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await storage.getSettings('global');
        if (data) {
          setSettings(data as GlobalSettings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await storage.saveSettings('global', settings);
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-900"></div></div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold italic serif text-neutral-900">Global Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4 text-neutral-900">
            <Globe size={20} />
            <h2 className="text-lg font-bold">General Information</h2>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Site Name</label>
            <input 
              type="text"
              value={settings.siteName}
              onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-neutral-900 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4 text-neutral-900">
            <Search size={20} />
            <h2 className="text-lg font-bold">Global SEO Defaults</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Title Template</label>
              <input 
                type="text"
                value={settings.globalSeo.titleTemplate}
                onChange={e => setSettings(prev => ({ ...prev, globalSeo: { ...prev.globalSeo, titleTemplate: e.target.value } }))}
                className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-neutral-900 outline-none transition-all"
                placeholder="%s | My App"
              />
              <p className="text-xs text-neutral-400 mt-2 italic">Use %s where the page title should appear</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Default Meta Description</label>
              <textarea 
                rows={3}
                value={settings.globalSeo.defaultDescription}
                onChange={e => setSettings(prev => ({ ...prev, globalSeo: { ...prev.globalSeo, defaultDescription: e.target.value } }))}
                className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-neutral-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Default Keywords</label>
              <input 
                type="text"
                value={settings.globalSeo.defaultKeywords}
                onChange={e => setSettings(prev => ({ ...prev, globalSeo: { ...prev.globalSeo, defaultKeywords: e.target.value } }))}
                className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-neutral-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 p-8 rounded-2xl text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 p-3 rounded-xl">
              <Shield size={24} className="text-neutral-400" />
            </div>
            <div>
              <p className="font-bold">Ready to apply changes?</p>
              <p className="text-sm text-neutral-400">These settings will affect the entire site's SEO.</p>
            </div>
          </div>
          <button 
            type="submit"
            disabled={saving}
            className="bg-white text-neutral-900 px-8 py-3 rounded-xl font-bold hover:bg-neutral-100 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
