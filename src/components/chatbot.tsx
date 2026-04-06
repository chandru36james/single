import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, X, ChevronLeft, Hand } from 'lucide-react';
import { storage } from '../lib/storage';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type Step = 'initial' | 'mobile' | 'project' | 'budget' | 'final';

interface LeadData {
  mobile: string;
  projectType: string;
  budget: number;
}

const PROJECT_TYPES = [
  'Wedding Photography',
  'Editorial / Fashion',
  'Portrait Session',
  'Commercial / Brand',
  'Event Coverage'
];

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [step, setStep] = useState<Step>('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analytics Helper
  const trackEvent = useCallback((eventName: string, data?: any) => {
    console.log(`[Analytics] ${eventName}`, data);
    
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, data);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const [showIntro2, setShowIntro2] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  // Track Open
  useEffect(() => {
    if (isOpen) {
      trackEvent('chatbot_opened');
    }
  }, [isOpen, trackEvent]);

  useEffect(() => {
    if (isOpen && step === 'initial') {
      setShowIntro2(false);
      setShowCTA(false);
      const t1 = setTimeout(() => setShowIntro2(true), 800);
      const t2 = setTimeout(() => setShowCTA(true), 1600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen, step]);

  const [lead, setLead] = useState<LeadData>(() => {
    const saved = localStorage.getItem('chatbot_lead_cache');
    return saved ? JSON.parse(saved) : {
      mobile: '',
      projectType: '',
      budget: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('chatbot_lead_cache', JSON.stringify(lead));
  }, [lead]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step, error]);

  const validateMobile = (mobile: string) => {
    let clean = mobile.replace(/[\s\-\(\)\+]/g, '');
    
    // Length check
    if (clean.length < 10 || clean.length > 15) return false;
    
    // Junk detection: repeated digits (e.g., 9999999999)
    if (/^(\d)\1+$/.test(clean)) return false;
    
    // Sequential digits (e.g., 1234567890)
    if ("1234567890876543210".includes(clean)) return false;

    // Unique digits count (at least 3 unique digits)
    const uniqueDigits = new Set(clean.split('')).size;
    if (uniqueDigits < 3) return false;

    return /^\d{10,15}$/.test(clean);
  };

  const handleInitial = (choice: 'portfolio' | 'quote') => {
    trackEvent('initial_choice', { choice });
    if (choice === 'portfolio') {
      navigate('/gallery');
      setIsOpen(false);
    } else {
      setStep('mobile');
    }
  };

  const handleMobile = () => {
    if (validateMobile(lead.mobile)) {
      trackEvent('mobile_entered');
      setError('');
      setStep('project');
    } else {
      setError('Please enter a valid mobile number.');
    }
  };

  const handleProjectType = (type: string) => {
    trackEvent('project_selected', { project: type });
    
    let defaultBudget = 500;
    setLead({ ...lead, projectType: type, budget: defaultBudget });
    setStep('budget');
  };

  const handleBudget = (val: number) => {
    if (val > 0) setLead({ ...lead, budget: val });
  };

  const getWhatsAppUrl = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917871120415";
    const budgetFormatted = (lead.budget || 0).toLocaleString();
    const currency = '$';
    
    const message = `*New Lead from Singleframe*\n\n*Mobile:* ${lead.mobile}\n*Project:* ${lead.projectType}\n*Budget:* ${currency}${budgetFormatted}`;
    
    return `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  const handleClose = () => {
    trackEvent('chatbot_closed', { step });
    setIsOpen(false);
  };

  const handleBack = () => {
    trackEvent('chatbot_back', { from_step: step });
    if (step === 'mobile') setStep('initial');
    else if (step === 'project') setStep('mobile');
    else if (step === 'budget') setStep('project');
    else if (step === 'final') setStep('initial');
  };

  const submitLead = async () => {
    trackEvent("lead_submitted", {
      mobile: lead.mobile,
      project: lead.projectType,
      budget: lead.budget
    });
    setIsSubmitting(true);
    
    try {
      // Save to Local Storage
      storage.addLead({
        ...lead,
        status: 'new',
        source: 'chatbot'
      });

      // Instant WhatsApp Redirect with small delay for UX
      setTimeout(() => {
        trackEvent('whatsapp_opened', {
          project: lead.projectType,
          budget: lead.budget
        });
        window.open(getWhatsAppUrl(), '_blank');
        setIsSubmitting(false);
        setStep('final');
        localStorage.removeItem('chatbot_lead_cache');
      }, 1500);
    } catch (err) {
      console.error("Lead submission failed:", err);
      setIsSubmitting(false);
      setError('Something went wrong. Please try again.');
    }
  };

  const resetChat = () => {
    trackEvent('chat_reset');
    setStep('initial');
    setLead({ mobile: '', projectType: '', budget: 0 });
    setError('');
    setShowIntro2(false);
    setShowCTA(false);
    localStorage.removeItem('chatbot_lead_cache');
  };

  return (
    <div className="relative font-sans flex flex-col items-end gap-4 pointer-events-auto">
      <AnimatePresence>
        {!isOpen && (
          <div className="relative group">
            {/* Waving Hand Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  key="tooltip"
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="hidden sm:flex absolute bottom-full right-0 mb-4 bg-surface px-4 py-2 rounded-2xl shadow-xl border border-outline-variant/10 whitespace-nowrap items-center gap-2"
                >
                  <span className="text-xs font-bold text-on-surface">Need help? Chat with us!</span>
                  <motion.div
                    animate={{ rotate: [0, 20, 0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <Hand size={16} className="text-yellow-500" />
                  </motion.div>
                  <div className="absolute top-full right-6 w-3 h-3 bg-surface border-r border-b border-outline-variant/10 rotate-45 -translate-y-1.5"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Button with Glow */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                boxShadow: [
                  "0 0 0 0px rgba(var(--primary), 0)",
                  "0 0 0 15px rgba(var(--primary), 0.2)",
                  "0 0 0 0px rgba(var(--primary), 0)"
                ]
              }}
              transition={{ 
                scale: { duration: 0.3 },
                opacity: { duration: 0.3 },
                boxShadow: { repeat: Infinity, duration: 2 }
              }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-on-primary hover:bg-primary/90 transition-all active:scale-90 relative z-10"
            >
              <MessageSquare size={24} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="w-[320px] sm:w-[360px] bg-surface rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-outline-variant/10"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-on-primary">
              <div className="flex items-center gap-3">
                {step !== 'initial' && (
                  <button 
                    onClick={handleBack}
                    className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/assets/logo.png" alt="Singleframe" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold">Singleframe Assistant</p>
                  <p className="text-[10px] opacity-80">Online • Typically replies instantly</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
              {step === 'initial' && (
                <>
                  {/* Bot Intro Message 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                      <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                      Hi 👋 I'm here to help you capture your most precious moments!
                    </div>
                  </motion.div>

                  {/* Bot Intro Message 2 */}
                  <AnimatePresence>
                    {showIntro2 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                          <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                          Specializing in luxury weddings and editorial photography. 📸
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bot CTA Message */}
                  <AnimatePresence>
                    {showCTA && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                            <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                          </div>
                          <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                            Get a quick quote for your shoot in seconds ✨
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-2 pl-8"
                        >
                          <button 
                            onClick={() => handleInitial('portfolio')}
                            className="w-full text-left p-3 rounded-xl border border-primary/20 bg-surface text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-between group"
                          >
                            View Gallery
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button 
                            onClick={() => handleInitial('quote')}
                            className="w-full text-left p-3 rounded-xl border border-primary bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-between group"
                          >
                            Get a Quote
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Step: Mobile */}
              {step !== 'initial' && (
                <>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                      <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                      Great! Let's start with your mobile number so we can reach out.
                    </div>
                  </div>

                  {step === 'mobile' ? (
                    <div className="pl-8 space-y-2">
                      <div className="relative">
                        <input 
                          type="tel"
                          inputMode="tel"
                          placeholder="e.g. +1 234 567 8900"
                          value={lead.mobile}
                          onChange={(e) => setLead({ ...lead, mobile: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleMobile()}
                          className="w-full p-3 rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all bg-surface text-on-surface"
                          autoFocus
                        />
                        <button 
                          onClick={handleMobile}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                      {error && <p className="text-[10px] text-error font-medium pl-1">{error}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end pr-2">
                        <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                          {lead.mobile}
                        </div>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                          <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-xs text-on-surface-variant italic">
                          We’ll contact you on WhatsApp 👍
                        </div>
                      </motion.div>
                    </>
                  )}
                </>
              )}

              {/* Step: Project Type */}
              {['project', 'budget', 'final'].includes(step) && (
                <>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                      <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                      What kind of shoot are you looking for?
                    </div>
                  </div>

                  {step === 'project' ? (
                    <div className="pl-8 grid grid-cols-1 gap-2">
                      {PROJECT_TYPES.map(type => (
                        <button 
                          key={type}
                          onClick={() => handleProjectType(type)}
                          className="text-left p-3 rounded-xl border border-outline-variant/20 bg-surface text-sm text-on-surface hover:border-primary hover:text-primary transition-all"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-end pr-2">
                      <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                        {lead.projectType}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step: Budget */}
              {['budget', 'final'].includes(step) && (
                <>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                      <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                      What is your estimated budget?
                    </div>
                  </div>

                  {step === 'budget' ? (
                    <div className="pl-8 space-y-6 py-4">
                      {/* Amount Tab Display */}
                      <div className="bg-on-surface text-surface rounded-2xl p-6 text-center shadow-2xl transform -rotate-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
                        <p className="text-[10px] text-surface/60 font-bold uppercase tracking-[0.2em] mb-2 relative z-10">Estimated Budget</p>
                        <p className="text-4xl font-black relative z-10">
                          <span className="text-primary mr-1">$</span>
                          {(lead.budget || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">
                          <span>$100</span>
                          <span>$5,000+</span>
                        </div>
                        <input 
                          type="range"
                          min={100}
                          max={5000}
                          step={100}
                          value={lead.budget}
                          onChange={(e) => handleBudget(parseInt(e.target.value) || 0)}
                          className="w-full h-2 bg-outline-variant/20 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <button 
                        onClick={submitLead}
                        disabled={isSubmitting}
                        className="w-full p-4 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full"
                            />
                            Saving...
                          </span>
                        ) : (
                          <>
                            <span>Confirm & Send</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end pr-2">
                      <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                        ${(lead.budget || 0).toLocaleString()}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step: Final */}
              {step === 'final' && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                    <img src="/assets/logo.png" alt="Bot" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-sm text-on-surface">
                    Thank you! We've received your inquiry. Redirecting you to WhatsApp for instant chat...
                    <button 
                      onClick={() => window.open(getWhatsAppUrl(), '_blank')}
                      className="mt-3 w-full p-2 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary/5 transition-all"
                    >
                      Open WhatsApp Again
                    </button>
                    <button 
                      onClick={resetChat}
                      className="mt-2 w-full text-center text-[10px] text-on-surface-variant hover:text-on-surface underline"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-surface border-t border-outline-variant/10 flex justify-center">
              <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Powered by Singleframe</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
