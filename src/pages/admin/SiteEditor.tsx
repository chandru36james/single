import React from 'react';
import { storage } from '../../lib/storage';
import { toast } from 'sonner';
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, Type, Globe, MessageCircle, MapPin, FileText, ShieldCheck, Clock } from 'lucide-react';

export const SiteEditor: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'home' | 'services' | 'about' | 'contact' | 'portfolio' | 'header' | 'footer'>('home');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [content, setContent] = React.useState<any>({
    header: {
      logoText: 'Singleframe',
      logoImage: '/assets/logo.png',
      bookingCta: 'Book a Shoot'
    },
    footer: {
      logoText: 'Singleframe',
      description: 'Bespoke Visual Legacies',
      socials: [
        { name: 'Instagram', icon: 'Instagram', href: 'https://www.instagram.com/singleframe_photography/' },
        { name: 'Vimeo', icon: 'Video', href: '#' },
        { name: 'External', icon: 'ExternalLink', href: '#' },
        { name: 'Mail', icon: 'Mail', href: 'mailto:studio@theobsidian.in' }
      ],
      copyright: '© 2024 Singleframe. All rights reserved.'
    },
    home: { 
      slides: [
        {
          id: '1',
          title: 'OBSIDIAN',
          subtitle: 'Bespoke Visual Legacies',
          description: 'Editorial Photography & Cinematic Storytelling for Luxury Weddings, Fashion, and Global Brands.',
          image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000',
          cta: 'Book Your Session'
        },
        {
          id: '2',
          title: 'COUTURE',
          subtitle: 'High Fashion Editorial',
          description: 'Avant-garde visual storytelling that pushes the boundaries of traditional fashion photography.',
          image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2000',
          cta: 'View Campaigns'
        },
        {
          id: '3',
          title: 'LEGACY',
          subtitle: 'Timeless Wedding Narratives',
          description: 'Documenting the profound moments of union with an editorial lens that transcends time.',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000',
          cta: 'Explore Weddings'
        }
      ], 
      featuredWorks: [
        { title: 'The Ethereal Monolith', tag: 'Editorial • 2024', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200' },
        { title: 'Velvet Noir', tag: 'Fashion • 2023', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800' },
        { title: 'The Gala', tag: 'Wedding • 2024', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800' },
        { title: 'Ivory Silence', tag: 'Wedding • 2023', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200' }
      ], 
      testimonials: [
        { quote: "The Obsidian team didn't just take photos; they captured the soul of our brand. Their editorial eye is unmatched.", author: "Elena Rossi, Creative Director" },
        { quote: "Our wedding photos look like they belong in a high-end fashion magazine. Absolutely breathtaking work.", author: "James & Sarah Harrington" }
      ], 
      cta: { 
        title: "Now Booking for 2025 & 2026 in Chennai", 
        subtitle: "We only accept a limited number of commissions each year to ensure absolute focus on every project across Tamil Nadu. Secure your date today.", 
        image: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=1200", 
        primaryCta: "Check Availability", 
        secondaryCta: "Explore Journal" 
      },
      stats: [
        { label: 'Years of Artistry', value: '12+' },
        { label: 'Commissions in India', value: '450+' },
        { label: 'Awards Won', value: '18' },
        { label: 'Client Satisfaction', value: '100%' }
      ],
      packages: [
        {
          name: 'The Editorial',
          price: 'Starting from ₹45,000',
          description: 'Perfect for high-fashion portfolios and personal branding in Chennai.',
          features: ['4 Hours Session', '2 Locations', '30 Retouched Edits', 'Online Gallery']
        },
        {
          name: 'The Couture Wedding',
          price: 'Starting from ₹1,25,000',
          description: 'Full-day luxury wedding coverage across Tamil Nadu with an editorial lens.',
          features: ['10 Hours Coverage', 'Two Photographers', 'Analog Film Highlights', 'Luxury Heirloom Album']
        },
        {
          name: 'The Brand Narrative',
          price: 'Custom Quote',
          description: 'Cinematic storytelling for luxury brands and commercial campaigns in India.',
          features: ['Full Creative Direction', 'Multi-day Shoots', 'Video & Photo Assets', 'Commercial Licensing']
        }
      ],
      steps: [
        { title: 'Consultation', desc: 'We discuss your vision, aesthetic preferences, and project goals at our Chennai studio.' },
        { title: 'The Session', desc: 'A bespoke shooting experience guided by our editorial creative direction.' },
        { title: 'Curation', desc: 'Meticulous editing and hand-finishing of your visual assets.' },
        { title: 'Delivery', desc: 'Your visual legacy delivered in a premium digital and physical archive.' }
      ]
    },
    services: { 
      hero: { title: 'Artistry in <span className="text-primary">Focus.</span>', description: 'Beyond photography, we craft visual legacies. The Obsidian provides a bespoke editorial approach to every frame, ensuring your narrative is preserved with cinematic gravity.' }, 
      sections: [
        {
          id: '1',
          title: "Couture Weddings",
          description: "Documenting the quiet, profound moments of union with an editorial lens that transcends traditional wedding photography.",
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
          atmosphere: "We focus on the architectural beauty of the venue and the intimate chemistry of the couple, creating a portfolio that looks like a high-end monograph.",
          inclusions: "Full-day coverage, analog film highlights, and a hand-bound Italian leather archive album.",
          cta: "Explore the Vows"
        },
        {
          id: '2',
          title: "Editorial Fashion",
          description: "High-concept visual storytelling for designers and publications that demand a distinct, avant-garde signature.",
          image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200",
          atmosphere: "Dramatic lighting, sharp compositions, and a focus on texture and movement to bring the designer's vision to life.",
          inclusions: "Full creative direction, professional lighting crew, and high-end retouching for publication.",
          cta: "View Campaigns"
        }
      ],
      celebrity: { 
        title: 'Celebrity Portraiture', 
        description: "Intimate, high-contrast portraits that capture the raw presence and identity of the world's most compelling figures.", 
        items: [
          { id: "01", label: "The Visionary", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
          { id: "02", label: "The Muse", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800" },
          { id: "03", label: "The Icon", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800" }
        ] 
      },
      product: { 
        title: 'Product & Luxury Still Life', 
        description: 'Elevating objects into icons through meticulous lighting and composition that highlights craftsmanship and desire.', 
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200', 
        features: [
          { icon: "flare", label: "Precision Macro Detail" },
          { icon: "light_mode", label: "Custom Light Sculpting" },
          { icon: "diamond", label: "Luxury Texture Focus" }
        ] 
      }
    },
    about: { 
      hero: { title: 'The Obsidian', subtitle: 'A boutique visual studio dedicated to the art of cinematic storytelling.', image: '', author: 'Founder Name' },
      philosophy: { title: 'Our Philosophy', description: 'We believe in the power of light, the strength of the human form, and the beauty of a well-told story.', image: '' }
    },
    contact: { 
      title: 'Get in Touch', 
      description: 'We would love to hear about your project and how we can help you craft your visual legacy.', 
      address: 'Chennai, Tamil Nadu, India', 
      whatsapp: '+91 98765 43210', 
      email: 'studio@theobsidian.in', 
      phone: '+91 98765 43210' 
    },
    portfolio: { 
      title: 'The Archive', 
      subtitle: 'A curated selection of visual narratives exploring the intersection of light, luxury, and the human form.', 
      projects: [
        {
          id: '01',
          title: 'Ethereal Monolith',
          category: 'Modelling',
          year: '2024',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
          span: 'col-span-12 md:col-span-8',
          aspect: 'aspect-[16/10]',
          location: 'Lake Como, Italy',
          detailTitle: 'Ethereal Weddings at Lake Como',
          detailDescription: 'A visual narrative of timeless elegance, captured through the lens of quiet intimacy.',
          quote: '"Light is the only curator we trust."',
          detailImages: [
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
          ]
        },
        {
          id: '02',
          title: 'The Gala',
          category: 'Wedding',
          year: '2024',
          image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
          span: 'col-span-12 md:col-span-4 mt-12 md:mt-24',
          aspect: 'aspect-[3/4]',
          location: 'Paris, France',
          detailTitle: 'The Gala Night',
          detailDescription: 'A night of celebration and joy, captured with an editorial flair.',
          quote: '"Moments that last a lifetime."',
          detailImages: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200'
          ]
        },
        {
          id: '03',
          title: 'Velvet Noir',
          category: 'Modelling',
          year: '2023',
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
          span: 'col-span-12 md:col-span-4',
          aspect: 'aspect-[3/4]',
          location: 'Milan, Italy',
          detailTitle: 'Velvet Noir Editorial',
          detailDescription: 'High-fashion editorial shoot exploring textures and shadows.',
          quote: '"Fashion is an expression of the soul."',
          detailImages: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
          ]
        },
        {
          id: '04',
          title: 'Ivory Silence',
          category: 'Wedding',
          year: '2023',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
          span: 'col-span-12 md:col-span-8 md:-mt-24',
          aspect: 'aspect-[16/10]',
          location: 'Santorini, Greece',
          detailTitle: 'Ivory Silence in Santorini',
          detailDescription: 'A serene wedding shoot against the backdrop of the Aegean Sea.',
          quote: '"Silence speaks volumes."',
          detailImages: [
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200'
          ]
        }
      ] 
    }
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const fetchWithFallback = async (id: string) => {
          try {
            return await storage.getContent(id);
          } catch (e) {
            console.warn(`SiteEditor: Failed to fetch ${id}, using defaults`, e);
            return null;
          }
        };

        const [
          homeData,
          servicesData,
          aboutData,
          contactData,
          portfolioData,
          headerData,
          footerData
        ] = await Promise.all([
          fetchWithFallback('home'),
          fetchWithFallback('services'),
          fetchWithFallback('about'),
          fetchWithFallback('contact'),
          fetchWithFallback('portfolio'),
          fetchWithFallback('header'),
          fetchWithFallback('footer')
        ]);

        // Helper to merge objects but keep defaults if new values are empty strings
        const mergeObjectWithDefaults = (defaults: any, data: any) => {
          if (!data) return defaults;
          const result = { ...defaults };
          Object.keys(defaults).forEach(key => {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
              if (Array.isArray(data[key]) && data[key].length > 0) {
                result[key] = data[key];
              } else if (typeof data[key] === 'object' && !Array.isArray(data[key]) && data[key] !== null) {
                result[key] = mergeObjectWithDefaults(defaults[key], data[key]);
              } else if (data[key] !== '') {
                result[key] = data[key];
              }
            }
          });
          return result;
        };

        const mergeArrayWithDefaults = (defaults: any[], data: any[]) => {
          if (!data || data.length === 0) return defaults;
          return data.map((item, idx) => {
            const defaultItem = (item.id && defaults.find(d => d.id === item.id)) || defaults[idx] || defaults[0] || {};
            return mergeObjectWithDefaults(defaultItem, item);
          });
        };

        setContent({
          header: {
            ...content.header,
            ...(headerData || {})
          },
          footer: {
            ...content.footer,
            ...(footerData || {}),
            socials: mergeArrayWithDefaults(content.footer.socials, (footerData || {}).socials)
          },
          home: {
            ...content.home,
            ...(homeData || {}),
            cta: mergeObjectWithDefaults(content.home.cta, (homeData || {}).cta),
            stats: mergeArrayWithDefaults(content.home.stats, (homeData || {}).stats),
            packages: mergeArrayWithDefaults(content.home.packages, (homeData || {}).packages),
            steps: mergeArrayWithDefaults(content.home.steps, (homeData || {}).steps),
            slides: mergeArrayWithDefaults(content.home.slides, (homeData || {}).slides),
            featuredWorks: mergeArrayWithDefaults(content.home.featuredWorks, (homeData || {}).featuredWorks),
            testimonials: mergeArrayWithDefaults(content.home.testimonials, (homeData || {}).testimonials)
          },
          services: {
            ...content.services,
            ...(servicesData || {}),
            hero: mergeObjectWithDefaults(content.services.hero, (servicesData || {}).hero),
            celebrity: mergeObjectWithDefaults(content.services.celebrity, (servicesData || {}).celebrity),
            product: mergeObjectWithDefaults(content.services.product, (servicesData || {}).product),
            sections: mergeArrayWithDefaults(content.services.sections, (servicesData || {}).sections)
          },
          about: {
            ...content.about,
            ...(aboutData || {}),
            hero: mergeObjectWithDefaults(content.about.hero, (aboutData || {}).hero),
            philosophy: mergeObjectWithDefaults(content.about.philosophy, (aboutData || {}).philosophy)
          },
          contact: {
            ...content.contact,
            ...(contactData || {}),
            title: (contactData || {}).title || content.contact.title,
            description: (contactData || {}).description || content.contact.description,
            address: (contactData || {}).address || content.contact.address,
            whatsapp: (contactData || {}).whatsapp || content.contact.whatsapp,
            email: (contactData || {}).email || content.contact.email,
            phone: (contactData || {}).phone || content.contact.phone
          },
          portfolio: {
            ...content.portfolio,
            ...(portfolioData || {}),
            title: (portfolioData || {}).title || content.portfolio.title,
            subtitle: (portfolioData || {}).subtitle || content.portfolio.subtitle,
            projects: mergeArrayWithDefaults(content.portfolio.projects, (portfolioData || {}).projects)
          }
        });
      } catch (err) {
        console.error('Error fetching site content:', err);
        toast.error('Failed to load site content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await storage.saveContent(activeTab, content[activeTab]);
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content saved!`);
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-neutral-900" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold italic serif text-neutral-900">Site Editor</h1>
          <p className="text-neutral-500 mt-1">Manage core page content and layouts</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-4 border-b border-neutral-200 overflow-x-auto hide-scrollbar">
        {(['header', 'footer', 'home', 'portfolio', 'services', 'about', 'contact'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        {/* Header Tab */}
        {activeTab === 'header' && (
          <div className="space-y-12">
            <div className="bg-surface-container-low p-8 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-8">
                <Globe className="text-primary" size={24} />
                <h3 className="font-headline text-2xl italic">Header Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface/60">Logo Text</label>
                  <input
                    type="text"
                    value={content.header.logoText}
                    onChange={(e) => setContent({ ...content, header: { ...content.header, logoText: e.target.value } })}
                    className="w-full bg-surface border border-outline-variant/20 p-4 font-body focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface/60">Logo Image URL</label>
                  <input
                    type="text"
                    value={content.header.logoImage}
                    onChange={(e) => setContent({ ...content, header: { ...content.header, logoImage: e.target.value } })}
                    className="w-full bg-surface border border-outline-variant/20 p-4 font-body focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface/60">Booking CTA Text</label>
                  <input
                    type="text"
                    value={content.header.bookingCta}
                    onChange={(e) => setContent({ ...content, header: { ...content.header, bookingCta: e.target.value } })}
                    className="w-full bg-surface border border-outline-variant/20 p-4 font-body focus:border-primary transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div className="space-y-12">
            <div className="bg-surface-container-low p-8 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-8">
                <Globe className="text-primary" size={24} />
                <h3 className="font-headline text-2xl italic">Footer Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface/60">Logo Text</label>
                  <input
                    type="text"
                    value={content.footer.logoText}
                    onChange={(e) => setContent({ ...content, footer: { ...content.footer, logoText: e.target.value } })}
                    className="w-full bg-surface border border-outline-variant/20 p-4 font-body focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface/60">Description</label>
                  <input
                    type="text"
                    value={content.footer.description}
                    onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })}
                    className="w-full bg-surface border border-outline-variant/20 p-4 font-body focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface/60">Copyright Text</label>
                  <input
                    type="text"
                    value={content.footer.copyright}
                    onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })}
                    className="w-full bg-surface border border-outline-variant/20 p-4 font-body focus:border-primary transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="font-label text-xs uppercase tracking-widest text-on-surface/60">Social Links</h4>
                  <button
                    onClick={() => {
                      const newSocials = [...content.footer.socials, { name: '', icon: 'Instagram', href: '' }];
                      setContent({ ...content, footer: { ...content.footer, socials: newSocials } });
                    }}
                    className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-bold"
                  >
                    <Plus size={16} /> Add Social
                  </button>
                </div>
                <div className="space-y-6">
                  {content.footer.socials.map((social: any, idx: number) => (
                    <div key={idx} className="p-6 bg-surface border border-outline-variant/10 relative">
                      <button
                        onClick={() => {
                          const newSocials = content.footer.socials.filter((_: any, i: number) => i !== idx);
                          setContent({ ...content, footer: { ...content.footer, socials: newSocials } });
                        }}
                        className="absolute top-4 right-4 text-on-surface/20 hover:text-error transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface/40">Name</label>
                          <input
                            type="text"
                            value={social.name}
                            onChange={(e) => {
                              const newSocials = [...content.footer.socials];
                              newSocials[idx].name = e.target.value;
                              setContent({ ...content, footer: { ...content.footer, socials: newSocials } });
                            }}
                            className="w-full bg-surface-container-low border border-outline-variant/20 p-3 font-body text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface/40">Icon (Lucide Name)</label>
                          <input
                            type="text"
                            value={social.icon}
                            onChange={(e) => {
                              const newSocials = [...content.footer.socials];
                              newSocials[idx].icon = e.target.value;
                              setContent({ ...content, footer: { ...content.footer, socials: newSocials } });
                            }}
                            className="w-full bg-surface-container-low border border-outline-variant/20 p-3 font-body text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface/40">URL</label>
                          <input
                            type="text"
                            value={social.href}
                            onChange={(e) => {
                              const newSocials = [...content.footer.socials];
                              newSocials[idx].href = e.target.value;
                              setContent({ ...content, footer: { ...content.footer, socials: newSocials } });
                            }}
                            className="w-full bg-surface-container-low border border-outline-variant/20 p-3 font-body text-sm outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Slides Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon size={20} className="text-neutral-400" />
                  Hero Slides
                </h2>
                <button 
                  onClick={() => setContent({ ...content, home: { ...content.home, slides: [...content.home.slides, { id: Date.now(), title: '', subtitle: '', description: '', image: '', cta: '' }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Slide
                </button>
              </div>
              <div className="grid gap-6">
                {content.home.slides.map((slide: any, idx: number) => (
                  <div key={slide.id} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newSlides = [...content.home.slides];
                        newSlides.splice(idx, 1);
                        setContent({ ...content, home: { ...content.home, slides: newSlides } });
                      }}
                      className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <input 
                          placeholder="Slide Title"
                          value={slide.title}
                          onChange={e => {
                            const newSlides = [...content.home.slides];
                            newSlides[idx].title = e.target.value;
                            setContent({ ...content, home: { ...content.home, slides: newSlides } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        <input 
                          placeholder="Subtitle"
                          value={slide.subtitle}
                          onChange={e => {
                            const newSlides = [...content.home.slides];
                            newSlides[idx].subtitle = e.target.value;
                            setContent({ ...content, home: { ...content.home, slides: newSlides } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        <textarea 
                          placeholder="Description"
                          value={slide.description}
                          onChange={e => {
                            const newSlides = [...content.home.slides];
                            newSlides[idx].description = e.target.value;
                            setContent({ ...content, home: { ...content.home, slides: newSlides } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                        />
                      </div>
                      <div className="space-y-4">
                        <input 
                          placeholder="Image URL"
                          value={slide.image}
                          onChange={e => {
                            const newSlides = [...content.home.slides];
                            newSlides[idx].image = e.target.value;
                            setContent({ ...content, home: { ...content.home, slides: newSlides } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        <input 
                          placeholder="CTA Text"
                          value={slide.cta}
                          onChange={e => {
                            const newSlides = [...content.home.slides];
                            newSlides[idx].cta = e.target.value;
                            setContent({ ...content, home: { ...content.home, slides: newSlides } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        {slide.image && (
                          <img src={slide.image} className="h-32 w-full object-cover rounded-lg border border-neutral-200" alt="Preview" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust Bar Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck size={20} className="text-neutral-400" />
                  Trust Bar (Stats)
                </h2>
                <button 
                  onClick={() => setContent({ ...content, home: { ...content.home, stats: [...content.home.stats, { label: '', value: '' }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Stat
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {content.home.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newStats = [...content.home.stats];
                        newStats.splice(idx, 1);
                        setContent({ ...content, home: { ...content.home, stats: newStats } });
                      }}
                      className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-2">
                      <input 
                        placeholder="Value (e.g. 12+)"
                        value={stat.value}
                        onChange={e => {
                          const newStats = [...content.home.stats];
                          newStats[idx].value = e.target.value;
                          setContent({ ...content, home: { ...content.home, stats: newStats } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-2 rounded-lg outline-none focus:border-neutral-900 font-bold text-center"
                      />
                      <input 
                        placeholder="Label"
                        value={stat.label}
                        onChange={e => {
                          const newStats = [...content.home.stats];
                          newStats[idx].label = e.target.value;
                          setContent({ ...content, home: { ...content.home, stats: newStats } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-2 rounded-lg outline-none focus:border-neutral-900 text-xs text-center uppercase tracking-widest"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Offer Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Globe size={20} className="text-neutral-400" />
                  Offer Section (Packages)
                </h2>
                <button 
                  onClick={() => setContent({ ...content, home: { ...content.home, packages: [...content.home.packages, { name: '', price: '', description: '', features: [] }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Package
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.home.packages.map((pkg: any, idx: number) => (
                  <div key={idx} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newPkgs = [...content.home.packages];
                        newPkgs.splice(idx, 1);
                        setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                      }}
                      className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4">
                      <input 
                        placeholder="Package Name"
                        value={pkg.name}
                        onChange={e => {
                          const newPkgs = [...content.home.packages];
                          newPkgs[idx].name = e.target.value;
                          setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                      />
                      <input 
                        placeholder="Price"
                        value={pkg.price}
                        onChange={e => {
                          const newPkgs = [...content.home.packages];
                          newPkgs[idx].price = e.target.value;
                          setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 text-primary font-bold"
                      />
                      <textarea 
                        placeholder="Description"
                        value={pkg.description}
                        onChange={e => {
                          const newPkgs = [...content.home.packages];
                          newPkgs[idx].description = e.target.value;
                          setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-20 text-sm"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Features</label>
                          <button 
                            onClick={() => {
                              const newPkgs = [...content.home.packages];
                              newPkgs[idx].features = [...newPkgs[idx].features, ''];
                              setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                          >
                            + Add
                          </button>
                        </div>
                        {pkg.features.map((feature: string, fIdx: number) => (
                          <div key={fIdx} className="flex gap-2">
                            <input 
                              value={feature}
                              onChange={e => {
                                const newPkgs = [...content.home.packages];
                                newPkgs[idx].features[fIdx] = e.target.value;
                                setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                              }}
                              className="flex-1 bg-white border border-neutral-200 p-2 rounded-lg text-xs outline-none focus:border-neutral-900"
                              placeholder="Feature"
                            />
                            <button 
                              onClick={() => {
                                const newPkgs = [...content.home.packages];
                                newPkgs[idx].features.splice(fIdx, 1);
                                setContent({ ...content, home: { ...content.home, packages: newPkgs } });
                              }}
                              className="text-neutral-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Process Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock size={20} className="text-neutral-400" />
                  Process Section (Steps)
                </h2>
                <button 
                  onClick={() => setContent({ ...content, home: { ...content.home, steps: [...content.home.steps, { title: '', desc: '' }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>
              <div className="space-y-4">
                {content.home.steps.map((step: any, idx: number) => (
                  <div key={idx} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 relative group flex gap-6">
                    <span className="text-4xl font-bold italic text-neutral-200">0{idx + 1}</span>
                    <div className="flex-1 space-y-4">
                      <input 
                        placeholder="Step Title"
                        value={step.title}
                        onChange={e => {
                          const newSteps = [...content.home.steps];
                          newSteps[idx].title = e.target.value;
                          setContent({ ...content, home: { ...content.home, steps: newSteps } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                      />
                      <textarea 
                        placeholder="Step Description"
                        value={step.desc}
                        onChange={e => {
                          const newSteps = [...content.home.steps];
                          newSteps[idx].desc = e.target.value;
                          setContent({ ...content, home: { ...content.home, steps: newSteps } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-20"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newSteps = [...content.home.steps];
                        newSteps.splice(idx, 1);
                        setContent({ ...content, home: { ...content.home, steps: newSteps } });
                      }}
                      className="p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-start"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Works Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Globe size={20} className="text-neutral-400" />
                  Featured Works
                </h2>
                <button 
                  onClick={() => setContent({ ...content, home: { ...content.home, featuredWorks: [...content.home.featuredWorks, { title: '', tag: '', img: '' }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Work
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.home.featuredWorks.map((work: any, idx: number) => (
                  <div key={idx} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newWorks = [...content.home.featuredWorks];
                        newWorks.splice(idx, 1);
                        setContent({ ...content, home: { ...content.home, featuredWorks: newWorks } });
                      }}
                      className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4">
                      <input 
                        placeholder="Work Title"
                        value={work.title}
                        onChange={e => {
                          const newWorks = [...content.home.featuredWorks];
                          newWorks[idx].title = e.target.value;
                          setContent({ ...content, home: { ...content.home, featuredWorks: newWorks } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                      />
                      <input 
                        placeholder="Tag (e.g. Editorial • 2024)"
                        value={work.tag}
                        onChange={e => {
                          const newWorks = [...content.home.featuredWorks];
                          newWorks[idx].tag = e.target.value;
                          setContent({ ...content, home: { ...content.home, featuredWorks: newWorks } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                      />
                      <input 
                        placeholder="Image URL"
                        value={work.img}
                        onChange={e => {
                          const newWorks = [...content.home.featuredWorks];
                          newWorks[idx].img = e.target.value;
                          setContent({ ...content, home: { ...content.home, featuredWorks: newWorks } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                      />
                      {work.img && (
                        <img src={work.img} className="h-40 w-full object-cover rounded-lg border border-neutral-200" alt="Preview" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle size={20} className="text-neutral-400" />
                  Testimonials
                </h2>
                <button 
                  onClick={() => setContent({ ...content, home: { ...content.home, testimonials: [...content.home.testimonials, { quote: '', author: '' }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Testimonial
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.home.testimonials.map((t: any, idx: number) => (
                  <div key={idx} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newT = [...content.home.testimonials];
                        newT.splice(idx, 1);
                        setContent({ ...content, home: { ...content.home, testimonials: newT } });
                      }}
                      className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4">
                      <textarea 
                        placeholder="Quote"
                        value={t.quote}
                        onChange={e => {
                          const newT = [...content.home.testimonials];
                          newT[idx].quote = e.target.value;
                          setContent({ ...content, home: { ...content.home, testimonials: newT } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                      />
                      <input 
                        placeholder="Author"
                        value={t.author}
                        onChange={e => {
                          const newT = [...content.home.testimonials];
                          newT[idx].author = e.target.value;
                          setContent({ ...content, home: { ...content.home, testimonials: newT } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Globe size={20} className="text-neutral-400" />
                Call to Action
              </h2>
              <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
                <input 
                  placeholder="CTA Title"
                  value={content.home.cta.title}
                  onChange={e => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, title: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                />
                <textarea 
                  placeholder="CTA Subtitle/Description"
                  value={content.home.cta.subtitle}
                  onChange={e => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, subtitle: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    placeholder="Primary Button Text"
                    value={content.home.cta.primaryCta}
                    onChange={e => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, primaryCta: e.target.value } } })}
                    className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                  />
                  <input 
                    placeholder="Secondary Button Text"
                    value={content.home.cta.secondaryCta}
                    onChange={e => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, secondaryCta: e.target.value } } })}
                    className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                  />
                </div>
                <input 
                  placeholder="CTA Image URL"
                  value={content.home.cta.image}
                  onChange={e => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, image: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Type size={20} className="text-neutral-400" />
                Header Section
              </h2>
              <div className="space-y-4">
                <input 
                  placeholder="Portfolio Title"
                  value={content.portfolio.title}
                  onChange={e => setContent({ ...content, portfolio: { ...content.portfolio, title: e.target.value } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 font-headline text-3xl italic"
                />
                <textarea 
                  placeholder="Portfolio Subtitle"
                  value={content.portfolio.subtitle}
                  onChange={e => setContent({ ...content, portfolio: { ...content.portfolio, subtitle: e.target.value } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 h-24"
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon size={20} className="text-neutral-400" />
                  Projects Archive
                </h2>
                <button 
                  onClick={() => setContent({ ...content, portfolio: { ...content.portfolio, projects: [...content.portfolio.projects, { 
                    id: (content.portfolio.projects.length + 1).toString().padStart(2, '0'), 
                    title: '', 
                    category: 'Wedding', 
                    year: new Date().getFullYear().toString(), 
                    image: '', 
                    span: 'col-span-12 md:col-span-6', 
                    aspect: 'aspect-[16/10]',
                    location: '',
                    detailTitle: '',
                    detailDescription: '',
                    quote: '',
                    detailImages: ['', '']
                  }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {content.portfolio.projects.map((project: any, idx: number) => (
                  <div key={idx} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newProjects = [...content.portfolio.projects];
                        newProjects.splice(idx, 1);
                        setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                      }}
                      className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="ID (e.01)"
                            value={project.id}
                            onChange={e => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[idx].id = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                            className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                          />
                          <input 
                            placeholder="Year"
                            value={project.year}
                            onChange={e => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[idx].year = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                            className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                          />
                        </div>
                        <input 
                          placeholder="Project Title"
                          value={project.title}
                          onChange={e => {
                            const newProjects = [...content.portfolio.projects];
                            newProjects[idx].title = e.target.value;
                            setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                        />
                        <select 
                          value={project.category}
                          onChange={e => {
                            const newProjects = [...content.portfolio.projects];
                            newProjects[idx].category = e.target.value;
                            setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Modelling">Modelling</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Editorial">Editorial</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <input 
                          placeholder="Image URL"
                          value={project.image}
                          onChange={e => {
                            const newProjects = [...content.portfolio.projects];
                            newProjects[idx].image = e.target.value;
                            setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select 
                            value={project.span}
                            onChange={e => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[idx].span = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                            className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 text-xs"
                          >
                            <option value="col-span-12">Full Width</option>
                            <option value="col-span-12 md:col-span-8">Large (2/3)</option>
                            <option value="col-span-12 md:col-span-6">Half (1/2)</option>
                            <option value="col-span-12 md:col-span-4">Small (1/3)</option>
                          </select>
                          <select 
                            value={project.aspect}
                            onChange={e => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[idx].aspect = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                            className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 text-xs"
                          >
                            <option value="aspect-[16/10]">Landscape (16:10)</option>
                            <option value="aspect-[3/4]">Portrait (3:4)</option>
                            <option value="aspect-square">Square</option>
                            <option value="aspect-video">Video (16:9)</option>
                          </select>
                        </div>
                        {project.image && (
                          <img src={project.image} className="h-32 w-full object-cover rounded-lg border border-neutral-200" alt="Preview" />
                        )}
                      </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="mt-6 pt-6 border-t border-neutral-200 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Project Detail Page Content</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          placeholder="Location (e.g. Lake Como, Italy)"
                          value={project.location || ''}
                          onChange={e => {
                            const newProjects = [...content.portfolio.projects];
                            newProjects[idx].location = e.target.value;
                            setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        <input 
                          placeholder="Detail Page Title"
                          value={project.detailTitle || ''}
                          onChange={e => {
                            const newProjects = [...content.portfolio.projects];
                            newProjects[idx].detailTitle = e.target.value;
                            setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                      </div>
                      <textarea 
                        placeholder="Detail Page Description"
                        value={project.detailDescription || ''}
                        onChange={e => {
                          const newProjects = [...content.portfolio.projects];
                          newProjects[idx].detailDescription = e.target.value;
                          setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                      />
                      <input 
                        placeholder="Project Quote"
                        value={project.quote || ''}
                        onChange={e => {
                          const newProjects = [...content.portfolio.projects];
                          newProjects[idx].quote = e.target.value;
                          setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                        }}
                        className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 italic font-serif"
                      />
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase">Additional Images</p>
                        {(project.detailImages || ['', '']).map((img: string, imgIdx: number) => (
                          <input 
                            key={imgIdx}
                            placeholder={`Additional Image ${imgIdx + 1} URL`}
                            value={img}
                            onChange={e => {
                              const newProjects = [...content.portfolio.projects];
                              const newDetailImages = [...(newProjects[idx].detailImages || ['', ''])];
                              newDetailImages[imgIdx] = e.target.value;
                              newProjects[idx].detailImages = newDetailImages;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                            className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Type size={20} className="text-neutral-400" />
                Hero Section
              </h2>
              <div className="space-y-4">
                <input 
                  placeholder="Hero Title (HTML allowed)"
                  value={content.about.hero.title}
                  onChange={e => setContent({ ...content, about: { ...content.about, hero: { ...content.about.hero, title: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 font-headline text-2xl italic"
                />
                <textarea 
                  placeholder="Hero Subtitle/Quote"
                  value={content.about.hero.subtitle}
                  onChange={e => setContent({ ...content, about: { ...content.about, hero: { ...content.about.hero, subtitle: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 h-24"
                />
                <input 
                  placeholder="Author/Founder Name"
                  value={content.about.hero.author}
                  onChange={e => setContent({ ...content, about: { ...content.about, hero: { ...content.about.hero, author: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                />
                <input 
                  placeholder="Hero Image URL"
                  value={content.about.hero.image}
                  onChange={e => setContent({ ...content, about: { ...content.about, hero: { ...content.about.hero, image: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                />
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Globe size={20} className="text-neutral-400" />
                Philosophy Section
              </h2>
              <div className="space-y-4">
                <input 
                  placeholder="Philosophy Title"
                  value={content.about.philosophy.title}
                  onChange={e => setContent({ ...content, about: { ...content.about, philosophy: { ...content.about.philosophy, title: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 font-bold"
                />
                <textarea 
                  placeholder="Philosophy Description (HTML allowed)"
                  value={content.about.philosophy.description}
                  onChange={e => setContent({ ...content, about: { ...content.about, philosophy: { ...content.about.philosophy, description: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 h-48"
                />
                <input 
                  placeholder="Philosophy Image URL"
                  value={content.about.philosophy.image}
                  onChange={e => setContent({ ...content, about: { ...content.about, philosophy: { ...content.about.philosophy, image: e.target.value } } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Type size={20} className="text-neutral-400" />
                Hero Section
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Headline (HTML allowed)</label>
                  <input 
                    value={content.services.hero.title}
                    onChange={e => setContent({ ...content, services: { ...content.services, hero: { ...content.services.hero, title: e.target.value } } })}
                    className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 font-headline text-2xl italic"
                    placeholder="Artistry in Focus."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Description</label>
                  <textarea 
                    value={content.services.hero.description}
                    onChange={e => setContent({ ...content, services: { ...content.services, hero: { ...content.services.hero, description: e.target.value } } })}
                    className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 h-32"
                    placeholder="Describe your services..."
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText size={20} className="text-neutral-400" />
                  Service Sections
                </h2>
                <button 
                  onClick={() => setContent({ ...content, services: { ...content.services, sections: [...content.services.sections, { id: Date.now().toString(), title: '', description: '', image: '', cta: '', atmosphere: '', inclusions: '' }] } })}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Section
                </button>
              </div>
              <div className="space-y-8">
                {content.services.sections.map((section: any, idx: number) => (
                  <div key={section.id} className="p-8 bg-neutral-50 rounded-2xl border border-neutral-200 relative group">
                    <button 
                      onClick={() => {
                        const newSections = [...content.services.sections];
                        newSections.splice(idx, 1);
                        setContent({ ...content, services: { ...content.services, sections: newSections } });
                      }}
                      className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <input 
                          placeholder="Section Title"
                          value={section.title}
                          onChange={e => {
                            const newSections = [...content.services.sections];
                            newSections[idx].title = e.target.value;
                            setContent({ ...content, services: { ...content.services, sections: newSections } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                        />
                        <textarea 
                          placeholder="Short Description"
                          value={section.description}
                          onChange={e => {
                            const newSections = [...content.services.sections];
                            newSections[idx].description = e.target.value;
                            setContent({ ...content, services: { ...content.services, sections: newSections } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                        />
                        <textarea 
                          placeholder="Atmosphere Detail"
                          value={section.atmosphere}
                          onChange={e => {
                            const newSections = [...content.services.sections];
                            newSections[idx].atmosphere = e.target.value;
                            setContent({ ...content, services: { ...content.services, sections: newSections } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                        />
                        <textarea 
                          placeholder="Inclusions Detail"
                          value={section.inclusions}
                          onChange={e => {
                            const newSections = [...content.services.sections];
                            newSections[idx].inclusions = e.target.value;
                            setContent({ ...content, services: { ...content.services, sections: newSections } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                        />
                      </div>
                      <div className="space-y-4">
                        <input 
                          placeholder="Image URL"
                          value={section.image}
                          onChange={e => {
                            const newSections = [...content.services.sections];
                            newSections[idx].image = e.target.value;
                            setContent({ ...content, services: { ...content.services, sections: newSections } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        <input 
                          placeholder="CTA Text"
                          value={section.cta}
                          onChange={e => {
                            const newSections = [...content.services.sections];
                            newSections[idx].cta = e.target.value;
                            setContent({ ...content, services: { ...content.services, sections: newSections } });
                          }}
                          className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                        />
                        {section.image && (
                          <img src={section.image} className="h-64 w-full object-cover rounded-lg border border-neutral-200" alt="Preview" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Globe size={20} className="text-neutral-400" />
                  Celebrity Portraiture
                </h2>
              </div>
              <div className="space-y-4 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                <input 
                  placeholder="Celebrity Title"
                  value={content.services.celebrity.title}
                  onChange={e => setContent({ ...content, services: { ...content.services, celebrity: { ...content.services.celebrity, title: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                />
                <textarea 
                  placeholder="Celebrity Description"
                  value={content.services.celebrity.description}
                  onChange={e => setContent({ ...content, services: { ...content.services, celebrity: { ...content.services.celebrity, description: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                />
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Portrait Items</h3>
                    <button 
                      onClick={() => setContent({ ...content, services: { ...content.services, celebrity: { ...content.services.celebrity, items: [...content.services.celebrity.items, { id: (content.services.celebrity.items.length + 3).toString().padStart(2, '0'), label: '', img: '' }] } } })}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      + Add Portrait
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.services.celebrity.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border border-neutral-200 relative group">
                        <button 
                          onClick={() => {
                            const newItems = [...content.services.celebrity.items];
                            newItems.splice(idx, 1);
                            setContent({ ...content, services: { ...content.services, celebrity: { ...content.services.celebrity, items: newItems } } });
                          }}
                          className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="space-y-2">
                          <input 
                            placeholder="Label"
                            value={item.label}
                            onChange={e => {
                              const newItems = [...content.services.celebrity.items];
                              newItems[idx].label = e.target.value;
                              setContent({ ...content, services: { ...content.services, celebrity: { ...content.services.celebrity, items: newItems } } });
                            }}
                            className="w-full text-xs border-b border-neutral-100 p-1 outline-none focus:border-primary"
                          />
                          <input 
                            placeholder="Image URL"
                            value={item.img}
                            onChange={e => {
                              const newItems = [...content.services.celebrity.items];
                              newItems[idx].img = e.target.value;
                              setContent({ ...content, services: { ...content.services, celebrity: { ...content.services.celebrity, items: newItems } } });
                            }}
                            className="w-full text-xs border-b border-neutral-100 p-1 outline-none focus:border-primary"
                          />
                          {item.img && <img src={item.img} className="h-20 w-full object-cover rounded" alt="Preview" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon size={20} className="text-neutral-400" />
                  Product & Luxury Still Life
                </h2>
              </div>
              <div className="space-y-4 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                <input 
                  placeholder="Product Title"
                  value={content.services.product.title}
                  onChange={e => setContent({ ...content, services: { ...content.services, product: { ...content.services.product, title: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 font-bold"
                />
                <textarea 
                  placeholder="Product Description"
                  value={content.services.product.description}
                  onChange={e => setContent({ ...content, services: { ...content.services, product: { ...content.services.product, description: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900 h-24"
                />
                <input 
                  placeholder="Main Image URL"
                  value={content.services.product.image}
                  onChange={e => setContent({ ...content, services: { ...content.services, product: { ...content.services.product, image: e.target.value } } })}
                  className="w-full bg-white border border-neutral-200 p-3 rounded-lg outline-none focus:border-neutral-900"
                />
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Features</h3>
                    <button 
                      onClick={() => setContent({ ...content, services: { ...content.services, product: { ...content.services.product, features: [...content.services.product.features, { icon: 'flare', label: '' }] } } })}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.services.product.features.map((feature: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 group">
                        <input 
                          placeholder="Icon Name"
                          value={feature.icon}
                          onChange={e => {
                            const newFeatures = [...content.services.product.features];
                            newFeatures[idx].icon = e.target.value;
                            setContent({ ...content, services: { ...content.services, product: { ...content.services.product, features: newFeatures } } });
                          }}
                          className="w-20 text-xs border-b border-neutral-100 p-1 outline-none focus:border-primary"
                        />
                        <input 
                          placeholder="Label"
                          value={feature.label}
                          onChange={e => {
                            const newFeatures = [...content.services.product.features];
                            newFeatures[idx].label = e.target.value;
                            setContent({ ...content, services: { ...content.services, product: { ...content.services.product, features: newFeatures } } });
                          }}
                          className="flex-1 text-xs border-b border-neutral-100 p-1 outline-none focus:border-primary"
                        />
                        <button 
                          onClick={() => {
                            const newFeatures = [...content.services.product.features];
                            newFeatures.splice(idx, 1);
                            setContent({ ...content, services: { ...content.services, product: { ...content.services.product, features: newFeatures } } });
                          }}
                          className="p-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Headline (HTML allowed)</label>
              <input 
                value={content.contact.title}
                onChange={e => setContent({ ...content, contact: { ...content.contact, title: e.target.value } })}
                className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 font-headline text-3xl italic"
                placeholder="Let's capture the unseen."
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Description</label>
              <textarea 
                value={content.contact.description}
                onChange={e => setContent({ ...content, contact: { ...content.contact, description: e.target.value } })}
                className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900 h-32"
                placeholder="Briefly describe your studio..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <MapPin size={14} /> Address
                </label>
                <input 
                  value={content.contact.address}
                  onChange={e => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                  placeholder="Chennai 600017"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <MessageCircle size={14} /> WhatsApp Link
                </label>
                <input 
                  value={content.contact.whatsapp}
                  onChange={e => setContent({ ...content, contact: { ...content.contact, whatsapp: e.target.value } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                  placeholder="https://wa.me/..."
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <Globe size={14} /> Email Address
                </label>
                <input 
                  value={content.contact.email}
                  onChange={e => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                  placeholder="studio@example.com"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <Type size={14} /> Phone Number
                </label>
                <input 
                  value={content.contact.phone}
                  onChange={e => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                  className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-xl outline-none focus:border-neutral-900"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
