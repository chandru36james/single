import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatBot } from './chatbot';

const FloatingWidgets: React.FC = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <motion.div 
            layout
            transition={{
                layout: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
            }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
        >
            <motion.div layout className="pointer-events-auto">
                <ChatBot />
            </motion.div>

            <AnimatePresence mode="popLayout">
                {showScrollTop && (
                    <motion.button 
                        key="scroll-top-btn"
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.5 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.23, 1, 0.32, 1]
                        }}
                        onClick={scrollToTop}
                        className="pointer-events-auto bg-white text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-zinc-100 transition-colors transform active:scale-90 border border-neutral-100"
                        aria-label="Scroll to top"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6"/>
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FloatingWidgets;