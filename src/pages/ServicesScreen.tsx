import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { storage } from '../lib/storage';
import ScrollReveal from '../components/ScrollReveal';
import { Loader2, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../lib/constants';

const ServicesScreen = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await storage.getContent('services');
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error("Error fetching services content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-neutral-900" size={48} />
      </div>
    );
  }

  const data = content ? {
    hero: {
      title: content.hero?.title || "Artistry in <span className=\"text-primary\">Focus.</span>",
      description: content.hero?.description || "Beyond photography, we craft visual legacies. The Obsidian provides a bespoke editorial approach to every frame, ensuring your narrative is preserved with cinematic gravity."
    },
    sections: (content.sections && content.sections.length > 0) ? content.sections : [
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
      title: content.celebrity?.title || "Celebrity Portraiture",
      description: content.celebrity?.description || "Intimate, high-contrast portraits that capture the raw presence and identity of the world's most compelling figures.",
      items: (content.celebrity?.items && content.celebrity.items.length > 0) ? content.celebrity.items : [
        { id: "01", label: "The Visionary", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
        { id: "02", label: "The Muse", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800" },
        { id: "03", label: "The Icon", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800" }
      ]
    },
    product: {
      title: content.product?.title || "Product & Luxury Still Life",
      description: content.product?.description || "Elevating objects into icons through meticulous lighting and composition that highlights craftsmanship and desire.",
      image: content.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
      features: (content.product?.features && content.product.features.length > 0) ? content.product.features : [
        { icon: "flare", label: "Precision Macro Detail" },
        { icon: "light_mode", label: "Custom Light Sculpting" },
        { icon: "diamond", label: "Luxury Texture Focus" }
      ]
    }
  } : {
    hero: {
      title: "Artistry in <span className=\"text-primary\">Focus.</span>",
      description: "Beyond photography, we craft visual legacies. The Obsidian provides a bespoke editorial approach to every frame, ensuring your narrative is preserved with cinematic gravity."
    },
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
        description: "High-concept visual storytelling for designers and publications that demand a third-party, avant-garde signature.",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200",
        atmosphere: "Dramatic lighting, sharp compositions, and a focus on texture and movement to bring the designer's vision to life.",
        inclusions: "Full creative direction, professional lighting crew, and high-end retouching for publication.",
        cta: "View Campaigns"
      }
    ],
    celebrity: {
      title: "Celebrity Portraiture",
      description: "Intimate, high-contrast portraits that capture the raw presence and identity of the world's most compelling figures.",
      items: [
        { id: "01", label: "The Visionary", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
        { id: "02", label: "The Muse", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800" },
        { id: "03", label: "The Icon", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800" }
      ]
    },
    product: {
      title: "Product & Luxury Still Life",
      description: "Elevating objects into icons through meticulous lighting and composition that highlights craftsmanship and desire.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
      features: [
        { icon: "flare", label: "Precision Macro Detail" },
        { icon: "light_mode", label: "Custom Light Sculpting" },
        { icon: "diamond", label: "Luxury Texture Focus" }
      ]
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-surface text-on-surface selection:bg-primary-container selection:text-white"
    >
      {/* Sidebar Quick Access */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 p-2 bg-surface/80 backdrop-blur-sm shadow-editorial-shadow border border-outline-variant/10 rounded-full">
        <div className="flex flex-col items-center gap-6 py-4">
          <a className="group flex flex-col items-center gap-1 hover:-translate-x-1 transition-transform" href={getWhatsAppLink('services')} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={20} className="text-on-surface/60 group-hover:text-primary transition-colors" />
            <span className="font-body text-[8px] uppercase tracking-[0.1rem] text-on-surface/60">WhatsApp</span>
          </a>
          <a className="group flex flex-col items-center gap-1 hover:-translate-x-1 transition-transform" href="/contact">
            <span className="material-symbols-outlined text-on-surface/60 group-hover:text-primary transition-colors">calendar_today</span>
            <span className="font-body text-[8px] uppercase tracking-[0.1rem] text-on-surface/60">Book</span>
          </a>
        </div>
      </aside>

      <main className="pt-24 md:pt-32">
        {/* Hero Section */}
        <header className="px-6 md:px-24 mb-16 md:mb-32">
          <ScrollReveal direction="up" className="max-w-4xl">
            <h1 
              className="text-4xl sm:text-6xl md:text-8xl italic tracking-tight mb-6 md:mb-8 font-headline leading-tight"
              dangerouslySetInnerHTML={{ __html: data.hero.title }}
            />
            <p className="font-body text-base md:text-xl text-on-surface-variant leading-relaxed max-w-2xl">
              {data.hero.description}
            </p>
          </ScrollReveal>
        </header>

        {/* Dynamic Sections */}
        {data.sections.map((section: any, idx: number) => (
          <section key={section.id} className="mb-24 md:mb-48">
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-0 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <ScrollReveal direction={idx % 2 === 0 ? "left" : "right"} className={`md:col-span-7 relative min-h-[320px] md:h-[520px] ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
                <img
                  className="w-full h-full object-cover"
                  src={section.image}
                  alt={section.title}
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute bottom-12 ${idx % 2 === 0 ? 'right-0 -mr-12' : 'left-0 -ml-12'} bg-surface p-12 hidden md:block shadow-editorial-shadow`}>
                  <span className="font-headline text-8xl text-surface-dim absolute -top-8 -left-8">0{idx + 1}</span>
                  <h2 className="text-4xl italic mb-4 font-headline">{section.title}</h2>
                  <p className="text-on-surface-variant font-body mb-8 max-w-xs leading-[1.5]">{section.description}</p>
                  <a className="inline-block border-b border-outline hover:border-primary text-sm font-label uppercase tracking-widest transition-colors pb-1" href="/contact">{section.cta || 'Inquire Now'}</a>
                </div>
              </ScrollReveal>
              <ScrollReveal direction={idx % 2 === 0 ? "right" : "left"} className={`md:col-span-5 flex flex-col justify-center p-6 sm:p-8 md:p-24 bg-surface-container-low ${idx % 2 !== 0 ? 'md:order-1' : ''}`}>
                <div className="md:hidden mb-8">
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary mb-2 block">0{idx + 1}</span>
                  <h2 className="text-3xl italic mb-4 font-headline">{section.title}</h2>
                  <p className="text-on-surface-variant font-body mb-8 text-sm leading-relaxed">{section.description}</p>
                  <a className="inline-block border-b border-outline text-sm font-label uppercase tracking-widest pb-1" href="/contact">{section.cta || 'Inquire Now'}</a>
                </div>
                <div className="space-y-8 md:space-y-12">
                  {section.atmosphere && (
                    <div className="group">
                      <span className="font-label text-[10px] uppercase tracking-widest text-primary mb-2 block">Atmosphere</span>
                      <p className="font-body text-sm leading-relaxed text-on-surface-variant">{section.atmosphere}</p>
                    </div>
                  )}
                  {section.inclusions && (
                    <div className="group">
                      <span className="font-label text-[10px] uppercase tracking-widest text-primary mb-2 block">Inclusions</span>
                      <p className="font-body text-sm leading-relaxed text-on-surface-variant">{section.inclusions}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </section>
        ))}

        {/* Celebrity & Portrait */}
        {data.celebrity && data.celebrity.items && data.celebrity.items.length > 0 && (
          <section className="bg-surface-container-low py-20 md:py-32 mb-24 md:mb-48 overflow-hidden">
            <div className="px-6 md:px-24">
              <ScrollReveal direction="up" className="flex flex-col md:flex-row justify-between items-baseline mb-12 md:mb-24">
                <h2 className="text-4xl sm:text-6xl md:text-8xl italic leading-none mb-6 md:mb-0 font-headline">
                  {data.celebrity.title || 'Celebrity Portraiture'}
                </h2>
                <p className="max-w-xs font-body text-sm md:text-base text-on-surface-variant italic">{data.celebrity.description}</p>
              </ScrollReveal>
              <div className="flex gap-4 md:gap-8 overflow-x-auto pb-12 snap-x hide-scrollbar">
                {data.celebrity.items.map((item: any, idx: number) => (
                  <ScrollReveal key={idx} direction="right" delay={idx * 0.2} className="min-w-[280px] md:min-w-[400px] snap-center">
                    <img
                      className="w-full aspect-[4/5] object-cover md:grayscale mb-4 hover:grayscale-0 transition-all duration-700"
                      src={item.img}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex justify-between items-center px-2">
                      <span className="font-label text-[10px] md:text-xs uppercase tracking-widest">{item.label}</span>
                      <span className="font-headline italic text-primary text-xl md:text-2xl">{item.id}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="mt-8 md:mt-12 flex justify-center">
                <a href="/contact" className="border border-outline px-8 md:px-12 py-4 font-label text-[10px] md:text-xs uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors">
                  Request Private Session
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Product Design Service */}
        {data.product && data.product.image && (
          <section className="px-6 md:px-24 mb-24 md:mb-48">
            <ScrollReveal direction="up" className="bg-surface border border-outline-variant/15 p-1 px-1">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative overflow-hidden group">
                  <img
                    className="w-full h-full min-h-[400px] md:min-h-[600px] object-cover scale-105 transition-transform duration-700 group-hover:scale-100"
                    src={data.product.image}
                    alt={data.product.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-24">
                  <span className="font-label text-[10px] uppercase tracking-[0.2rem] text-primary mb-4 md:mb-6">Objects of Desire</span>
                  <h2 className="text-3xl md:text-5xl italic mb-6 md:mb-8 leading-tight font-headline">{data.product.title}</h2>
                  <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed mb-8 md:mb-12">
                    {data.product.description}
                  </p>
                  <div className="space-y-4 md:space-y-6">
                    {data.product.features && data.product.features.map((feature: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                        <span className="material-symbols-outlined text-primary text-xl">{feature.icon}</span>
                        <span className="font-label text-[10px] md:text-xs uppercase tracking-widest">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                  <a href="/contact" className="mt-10 md:mt-16 bg-on-surface text-surface py-4 md:py-5 px-8 md:px-10 font-label text-[10px] md:text-xs uppercase tracking-widest self-start hover:opacity-90 transition-opacity text-center">
                    Inquire Now
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-20 md:py-32 bg-primary text-on-primary text-center">
          <ScrollReveal direction="up">
            <h2 className="text-4xl sm:text-5xl md:text-7xl italic mb-8 md:mb-12 px-6 md:px-8 font-headline leading-tight">Ready to define your <span className="text-secondary-fixed">narrative?</span></h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center px-6">
              <a className="w-full md:w-auto px-12 py-5 bg-on-primary text-primary font-label text-sm uppercase tracking-widest font-bold hover:bg-on-primary/90 transition-colors" href="/contact">Contact Studio</a>
              <a className="w-full md:w-auto px-12 py-5 border border-on-primary/30 hover:bg-on-primary/10 font-label text-sm uppercase tracking-widest transition-colors" href="/">Return to Home</a>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </motion.div>
  );
};

export default ServicesScreen;
