import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Quote, ArrowRight, Loader2, CheckCircle2, Calendar, Clock, ShieldCheck, Star, MessageCircle } from 'lucide-react';
import { storage } from '../lib/storage';
import ScrollReveal from '../components/ScrollReveal';
import PressMarquee from '../components/PressMarquee';
import { SEO } from '../components/SEO';
import { getWhatsAppLink } from '../lib/constants';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [content, setContent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await storage.getContent('home');
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error("Error fetching home content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  React.useEffect(() => {
    if (!content?.slides?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [content]);

  React.useEffect(() => {
    if (!content?.testimonials?.length) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % content.testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [content]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-neutral-900" size={48} />
      </div>
    );
  }

  const slides = (content?.slides && content.slides.length > 0) ? content.slides : [
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
  ];
  const featuredWorks = (content?.featuredWorks && content.featuredWorks.length > 0) ? content.featuredWorks : [];
  const testimonials = (content?.testimonials && content.testimonials.length > 0) ? content.testimonials : [
    { quote: "The Obsidian team didn't just take photos; they captured the soul of our brand. Their editorial eye is unmatched.", author: "Elena Rossi, Creative Director" },
    { quote: "Our wedding photos look like they belong in a high-end fashion magazine. Absolutely breathtaking work.", author: "James & Sarah Harrington" }
  ];

  const stats = (content?.stats && content.stats.length > 0) ? content.stats : [
    { label: 'Years of Artistry', value: '12+' },
    { label: 'Commissions in India', value: '450+' },
    { label: 'Awards Won', value: '18' },
    { label: 'Client Satisfaction', value: '100%' }
  ];

  const packages = (content?.packages && content.packages.length > 0) ? content.packages : [
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
  ];

  const steps = (content?.steps && content.steps.length > 0) ? content.steps : [
    { title: 'Consultation', desc: 'We discuss your vision, aesthetic preferences, and project goals at our Chennai studio.' },
    { title: 'The Session', desc: 'A bespoke shooting experience guided by our editorial creative direction.' },
    { title: 'Curation', desc: 'Meticulous editing and hand-finishing of your visual assets.' },
    { title: 'Delivery', desc: 'Your visual legacy delivered in a premium digital and physical archive.' }
  ];

  const cta = {
    title: content?.cta?.title || "Now Booking for 2025 & 2026 in Chennai",
    subtitle: content?.cta?.subtitle || "We only accept a limited number of commissions each year to ensure absolute focus on every project across Tamil Nadu. Secure your date today.",
    image: content?.cta?.image || "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=1200",
    primaryCta: content?.cta?.primaryCta || "Check Availability",
    secondaryCta: content?.cta?.secondaryCta || "Explore Journal"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-surface overflow-x-hidden"
    >
      <SEO 
        title="Home" 
        description="The Obsidian — a boutique visual studio in Chennai. We craft high-impact visual narratives for luxury weddings, fashion, and brands across Tamil Nadu." 
        keywords="luxury photography Chennai, wedding photographer Tamil Nadu, editorial fashion India, brand storytelling, cinematic visuals"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[100vh] w-full bg-surface overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          {slides.map((slide: any, index: number) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1,
                zIndex: currentSlide === index ? 1 : 0
              }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>

        <div className="relative z-20 h-full w-full flex flex-col justify-center px-6 md:px-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="font-label text-[10px] md:text-xs uppercase tracking-[0.4rem] text-primary font-bold">
                {slides[currentSlide]?.subtitle || 'Chennai • Madurai • Coimbatore'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-headline text-5xl sm:text-6xl md:text-9xl font-bold text-white leading-[0.85] tracking-tighter mb-8 break-words"
            >
              {slides[currentSlide]?.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-body text-lg md:text-2xl text-white/80 leading-relaxed mb-12 max-w-2xl"
            >
              {slides[currentSlide]?.description || 'Crafting Visual Legacies for the Modern Indian Aesthetic.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6"
            >
              <button
                onClick={() => navigate('/contact')}
                className="group flex items-center justify-center gap-4 bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-sm font-label text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-500 shadow-2xl"
              >
                {slides[currentSlide]?.cta || 'Book Your Session'}
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => window.open(getWhatsAppLink('home'), '_blank')}
                className="flex items-center justify-center gap-4 border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-sm font-label text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-500"
              >
                <MessageCircle size={16} />
                WhatsApp Inquiry
              </button>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 md:left-24 z-30 flex items-center gap-12">
          <div className="flex gap-3">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-12 h-1 transition-all duration-500 ${currentSlide === i ? 'bg-primary' : 'bg-white/20'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 text-white/40 font-label text-[10px] uppercase tracking-widest">
            <div className="w-8 h-px bg-white/20"></div>
            <span>Tamil Nadu • Est. 2012</span>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1} direction="up" className="text-center">
                <p className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface/40">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clear Offer Section */}
      <section className="min-h-[100svh] flex items-center py-16 md:py-20 px-6 md:px-24 bg-surface">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
            <span className="font-label text-[10px] uppercase tracking-[0.4rem] text-primary font-bold mb-6 block">Our Expertise</span>
            <h2 className="font-headline text-4xl md:text-7xl font-bold tracking-tight mb-8">Bespoke Visual Services</h2>
            <p className="font-body text-lg md:text-xl text-on-surface/60 leading-relaxed">
              We provide a comprehensive suite of high-end visual services designed for those who demand excellence and a distinct editorial signature in South India.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1} direction="up">
                <div className="bg-surface-container-low p-10 border border-outline-variant/10 hover:border-primary/30 transition-all group h-full flex flex-col">
                  <h3 className="font-headline text-3xl mb-4 italic">{pkg.name}</h3>
                  <p className="text-primary font-label text-sm font-bold mb-6">{pkg.price}</p>
                  <p className="font-body text-on-surface/60 mb-8 text-sm leading-relaxed">{pkg.description}</p>
                  <ul className="space-y-4 mb-12 flex-1">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm font-body text-on-surface/80">
                        <CheckCircle2 size={16} className="text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="w-full py-4 border border-outline hover:bg-primary hover:text-white hover:border-primary transition-all font-label text-[10px] uppercase tracking-widest"
                  >
                    Inquire Now
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <PressMarquee />

      {/* Process Section */}
      <section className="min-h-[100svh] flex items-center py-16 md:py-20 px-6 md:px-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <ScrollReveal direction="left">
              <span className="font-label text-[10px] uppercase tracking-[0.4rem] text-primary font-bold mb-6 block">The Journey</span>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-8">How We Craft Your Story</h2>
              <p className="font-body text-xl text-on-surface/60 leading-relaxed mb-8">
                Our process is as refined as our results. We guide you through every step to ensure your vision is realized with absolute precision at our Chennai studio.
              </p>
              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <span className="font-headline text-3xl italic text-primary/30">0{idx + 1}</span>
                    <div>
                      <h4 className="font-headline text-2xl mb-2">{step.title}</h4>
                      <p className="font-body text-on-surface/60 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="relative">
              <div className="h-[420px] md:h-[520px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Studio Process" 
                  className="w-full h-full object-cover md:grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary p-6 hidden md:block">
                <p className="text-white font-headline text-4xl italic">Bespoke.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Work Section - Redesigned to Editorial Bento Grid */}
      {featuredWorks.length > 0 && (
        <section className="min-h-[100svh] flex items-center py-12 md:py-16 px-6 md:px-24 bg-surface">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="font-label text-[10px] uppercase tracking-[0.4rem] text-primary font-bold mb-3 block">
                  The Archive
                </span>
                <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[0.85] break-words">
                  Visual <span className="italic font-light text-primary">Mastery</span>
                </h2>
              </div>
              <button 
                onClick={() => navigate('/gallery')}
                className="group flex items-center gap-6 font-label text-[10px] uppercase tracking-[0.2rem] border-b border-primary pb-2 hover:text-primary transition-all duration-500"
              >
                Explore Portfolio
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
              {/* Large Feature Item */}
              <ScrollReveal direction="up" className="md:col-span-8 relative group overflow-hidden">
                <div 
                  onClick={() => navigate('/gallery')}
                  className="aspect-[16/9] md:aspect-[2.4/1] overflow-hidden cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 md:grayscale group-hover:grayscale-0"
                    src={featuredWorks[0]?.img}
                    alt={featuredWorks[0]?.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <p className="font-label text-[10px] uppercase tracking-widest text-white/60 mb-1">{featuredWorks[0]?.tag}</p>
                    <h3 className="font-headline text-2xl md:text-3xl text-white font-bold tracking-tight">{featuredWorks[0]?.title}</h3>
                  </div>
                </div>
              </ScrollReveal>

              {/* Tall Item */}
              <ScrollReveal direction="up" delay={0.1} className="md:col-span-4 relative group overflow-hidden">
                <div 
                  onClick={() => navigate('/gallery')}
                  className="h-full aspect-[16/9] md:aspect-auto overflow-hidden cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 md:grayscale group-hover:grayscale-0"
                    src={featuredWorks[1]?.img}
                    alt={featuredWorks[1]?.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <p className="font-label text-[10px] uppercase tracking-widest text-white/60 mb-1">{featuredWorks[1]?.tag}</p>
                    <h3 className="font-headline text-xl md:text-2xl text-white font-bold tracking-tight">{featuredWorks[1]?.title}</h3>
                  </div>
                </div>
              </ScrollReveal>

              {/* Small Items */}
              <ScrollReveal direction="up" delay={0.2} className="md:col-span-4 relative group overflow-hidden">
                <div 
                  onClick={() => navigate('/gallery')}
                  className="aspect-[2/1] md:aspect-[1.5/1] overflow-hidden cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 md:grayscale group-hover:grayscale-0"
                    src={featuredWorks[2]?.img}
                    alt={featuredWorks[2]?.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <p className="font-label text-[10px] uppercase tracking-widest text-white/60 mb-1">{featuredWorks[2]?.tag}</p>
                    <h3 className="font-headline text-xl text-white font-bold tracking-tight">{featuredWorks[2]?.title}</h3>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3} className="md:col-span-8 relative group overflow-hidden">
                <div 
                  onClick={() => navigate('/gallery')}
                  className="aspect-[16/9] md:aspect-[3.5/1] overflow-hidden cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 md:grayscale group-hover:grayscale-0"
                    src={featuredWorks[3]?.img}
                    alt={featuredWorks[3]?.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <p className="font-label text-[10px] uppercase tracking-widest text-white/60 mb-1">{featuredWorks[3]?.tag}</p>
                    <h3 className="font-headline text-2xl md:text-3xl text-white font-bold tracking-tight">{featuredWorks[3]?.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - Redesigned to Atmospheric Full-Screen */}
      {testimonials.length > 0 && (
        <section className="relative min-h-[70vh] bg-surface overflow-hidden flex items-center py-16">
          {/* Background Atmospheric Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-24 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4">
                <ScrollReveal direction="left">
                  <span className="font-label text-[10px] uppercase tracking-[0.4rem] text-primary font-bold mb-4 block">
                    Voices
                  </span>
                  <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-6 break-words">
                    What Our <br />
                    <span className="italic font-light">Clients</span> Say
                  </h2>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="fill-primary text-primary" />)}
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                      className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"
                    >
                      <ArrowRight size={16} className="rotate-180" />
                    </button>
                    <button 
                      onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                      className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-8 relative min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-surface-container-low p-8 md:p-12 border border-outline-variant/10 relative"
                  >
                    <Quote className="text-primary/10 absolute top-6 left-6" size={60} />
                    <blockquote className="font-headline text-2xl md:text-3xl leading-[1.2] mb-8 italic text-on-surface relative z-10">
                      "{testimonials[currentTestimonial]?.quote || "The Obsidian team captured the soul of our Chennai wedding perfectly."}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-px bg-primary"></div>
                      <div>
                        <cite className="font-label text-sm uppercase tracking-[0.3rem] not-italic text-on-surface font-bold block mb-1">
                          {testimonials[currentTestimonial]?.author || "Ananya Iyer"}
                        </cite>
                        <span className="font-body text-[10px] text-on-surface/40 uppercase tracking-widest">
                          Chennai, Tamil Nadu
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Progress Indicators */}
                <div className="absolute -bottom-6 right-0 flex gap-2">
                  {testimonials.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`h-1 transition-all duration-500 ${currentTestimonial === i ? 'bg-primary w-10' : 'bg-outline-variant/30 w-5'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Urgency & Final CTA */}
      <section className="relative py-20 md:py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            className="w-full h-full object-cover md:grayscale"
            src={cta.image}
            alt="Studio"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" className="flex flex-col items-center text-center">
            <span className="font-label text-[10px] uppercase tracking-[0.4rem] text-on-primary/60 font-bold mb-6 block">Limited Availability</span>
            <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl text-on-primary font-bold mb-8 leading-[0.9] tracking-tighter max-w-5xl break-words">
              {cta.title}
            </h2>
            <p className="font-body text-base md:text-xl text-on-primary/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              {cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg">
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 bg-white text-primary px-8 md:px-10 py-4 md:py-5 font-label text-xs uppercase tracking-widest font-bold hover:bg-on-primary-container transition-all shadow-2xl"
              >
                {cta.primaryCta}
              </button>
              <button
                onClick={() => window.open(getWhatsAppLink('home'), '_blank')}
                className="flex-1 border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 font-label text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>
            </div>
            <div className="mt-16 pt-10 border-t border-white/10 w-full max-w-2xl flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-on-primary/40 font-label text-[10px] uppercase tracking-[0.2rem]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-on-primary/60" />
                <span>Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-on-primary/60" />
                <span>Fast Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-on-primary/60" />
                <span>Verified Studio</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default HomeScreen;
