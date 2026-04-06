import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, CheckCircle2, ArrowRight, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import { storage } from '../lib/storage';
import { SEO } from '../components/SEO';
import { toast } from 'sonner';
import { getWhatsAppLink } from '../lib/constants';

const ContactScreen = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await storage.getContent('contact');
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      storage.addLead({
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        projectType: formData.type || 'General Inquiry',
        message: formData.message,
        status: 'new',
        source: 'contact_form'
      });
      
      setFormStatus('sent');
      toast.success('Inquiry sent successfully!');
    } catch (error) {
      console.error('Error saving lead:', error);
      setFormStatus('idle');
      toast.error('Failed to send inquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-neutral-900" size={48} />
      </div>
    );
  }

  const defaults = {
    title: "Let's capture <br /> the <span className=\"text-primary\">unseen</span>.",
    description: "The Obsidian is a boutique studio specializing in high-contrast editorial photography. We reply to all inquiries within 24 hours.",
    address: "Chennai 600017",
    whatsapp: getWhatsAppLink('contact'),
    phone: "+91 98400 00000",
    email: "studio@singleframe.in"
  };

  const data = content ? {
    title: content.title || defaults.title,
    description: content.description || defaults.description,
    address: content.address || defaults.address,
    whatsapp: content.whatsapp || defaults.whatsapp,
    phone: content.phone || defaults.phone,
    email: content.email || defaults.email
  } : defaults;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <SEO 
        title="Contact" 
        description="Get in touch with Singleframe. Let's discuss your next high-impact visual project."
        keywords="contact photography studio, book photographer, creative consultation"
      />
      <main className="pt-24 md:pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[90vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="flex flex-col gap-8 md:gap-12">
            <section>
              <h1 
                className="font-headline text-4xl sm:text-6xl md:text-7xl italic leading-tight tracking-tight mb-6 md:mb-8"
                dangerouslySetInnerHTML={{ __html: data.title }}
              />
              <p className="font-body text-base md:text-lg text-on-surface/70 leading-relaxed max-w-md">
                {data.description}
              </p>
            </section>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container-low rounded-lg text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2rem] text-primary block mb-1">The Studio</span>
                    <address className="not-italic font-headline text-lg text-on-surface">{data.address}</address>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container-low rounded-lg text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2rem] text-primary block mb-1">Phone</span>
                    <p className="font-headline text-lg text-on-surface">{data.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container-low rounded-lg text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2rem] text-primary block mb-1">Email</span>
                    <p className="font-headline text-lg text-on-surface">{data.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container-low rounded-lg text-primary">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2rem] text-primary block mb-1">WhatsApp</span>
                    <a 
                      href={data.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-headline text-lg text-on-surface hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/10 rounded-sm">
              <p className="font-label text-[10px] uppercase tracking-[0.2rem] text-primary mb-2">Our Promise</p>
              <p className="font-body text-sm text-on-surface/80 italic">"We treat every inquiry as a creative collaboration from the very first message."</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 sm:p-8 md:p-12 relative shadow-editorial-shadow rounded-sm border border-outline-variant/10">
            <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 font-headline text-6xl sm:text-8xl text-on-surface/5 select-none pointer-events-none italic">Inquiry</div>
            {formStatus === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <CheckCircle2 className="text-primary mb-4" size={64} />
                <h3 className="font-headline text-3xl mb-2">Message Captured</h3>
                <p className="text-on-surface/60">Our curators will reach out within 24 hours.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-8 text-primary font-label text-[10px] uppercase tracking-widest hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">Full Name</label>
                      <input 
                        required 
                        className="w-full bg-surface border border-outline-variant/20 px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface/20 font-body text-base" 
                        placeholder="John Doe" 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">Email Address</label>
                      <input 
                        required 
                        className="w-full bg-surface border border-outline-variant/20 px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface/20 font-body text-base" 
                        placeholder="john@example.com" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">Phone Number</label>
                      <input 
                        required 
                        className="w-full bg-surface border border-outline-variant/20 px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface/20 font-body text-base" 
                        placeholder="+91 98400 00000" 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">Shoot Type</label>
                      <select 
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-surface border border-outline-variant/20 px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-body text-base text-on-surface/60 appearance-none"
                      >
                        <option value="">Select Type</option>
                        <option value="editorial">Editorial Fashion</option>
                        <option value="wedding">Luxury Wedding</option>
                        <option value="portrait">Artistic Portrait</option>
                        <option value="commercial">Commercial Campaign</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">Your Vision</label>
                    <textarea 
                      required 
                      className="w-full bg-surface border border-outline-variant/20 px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface/20 font-body text-base resize-none" 
                      placeholder="Tell us about your project..." 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface/40">We reply within 24 hours</span>
                  </div>
                  <button
                    disabled={formStatus === 'sending'}
                    className="group flex items-center gap-4 bg-primary text-on-primary px-10 py-4 rounded-sm font-label text-xs uppercase tracking-[0.2rem] font-bold w-full sm:w-auto justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    type="submit"
                  >
                    {formStatus === 'sending' ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        Send Request
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default ContactScreen;
