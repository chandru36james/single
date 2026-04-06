import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { storage } from '../lib/storage';

const Navbar = () => {
const navigate = useNavigate();
const location = useLocation();

const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const [headerContent, setHeaderContent] = useState({
logoText: 'Singleframe',
logoImage: '/assets/logo.png',
bookingCta: 'Book a Shoot'
});

const [navLinks, setNavLinks] = useState([
{ name: 'Gallery', path: '/gallery' },
{ name: 'Service', path: '/services' },
{ name: 'Journal', path: '/journal' },
{ name: 'About', path: '/about' },
]);

// Scroll behavior
useEffect(() => {
const handleScroll = () => {
if (isMobileMenuOpen) return;
setIsScrolled(window.scrollY > 40);
};


window.addEventListener('scroll', handleScroll);

const fetchContent = async () => {
  try {
    const content = await storage.getContent('header');
    if (content) {
      setHeaderContent(prev => ({ ...prev, ...content }));
    }

    const pages = await storage.getPages();
    const publishedPages = pages.filter((p: any) => p.status === 'published');

    if (publishedPages.length > 0) {
      const dynamicLinks = publishedPages.map((p: any) => ({
        name: p.title,
        path: `/p/${p.slug}`
      }));

      setNavLinks(prev => {
        const staticLinks = prev.filter(link => !link.path.startsWith('/p/'));
        return [...staticLinks, ...dynamicLinks];
      });
    }
  } catch (error) {
    console.error('Navbar error:', error);
  }
};

fetchContent();

return () => window.removeEventListener('scroll', handleScroll);


}, [isMobileMenuOpen]);

// Lock body scroll
useEffect(() => {
document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
}, [isMobileMenuOpen]);

const isActive = (path: string) => location.pathname === path;

return (
<nav
className={`fixed top-0 left-0 w-full max-w-[100vw] z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
> <div className="w-full px-6 md:px-12 flex items-center justify-between">

    {/* LOGO */}
    <div className="flex items-center gap-4">
      <img
        src={headerContent.logoImage}
        alt="Logo"
        className="h-10 w-10 object-cover shrink-0 border border-white/10"
      />
      <Link to="/" className="text-xl font-headline uppercase font-bold tracking-tight">
        {headerContent.logoText}
      </Link>
    </div>

    {/* DESKTOP NAV */}
    <div className="hidden md:flex items-center gap-12">
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface/70 hover:text-on-surface transition"
          >
            {link.name}

            {isActive(link.path) && (
              <motion.span
                layoutId="nav-underline"
                className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary"
              />
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />

        <button
          onClick={() => navigate('/contact')}
          className="px-8 py-3 text-[10px] uppercase tracking-[0.2em] bg-primary text-on-primary hover:bg-primary-container transition font-bold"
        >
          {headerContent.bookingCta}
        </button>
      </div>
    </div>

    {/* MOBILE BUTTON */}
    <button
      className="md:hidden p-2"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>

  {/* MOBILE MENU */}
  <AnimatePresence>
    {isMobileMenuOpen && (
      <>
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* SIDEBAR */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="fixed top-0 right-0 h-[100dvh] w-[calc(100vw-20px)] max-w-[360px] z-50 bg-white dark:bg-surface border-l border-outline-variant/10 shadow-2xl flex flex-col overflow-hidden"
        >

          {/* HEADER */}
          <div className="px-5 py-4 flex justify-between items-center border-b border-outline-variant/10 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={headerContent.logoImage}
                className="h-8 w-8 object-cover shrink-0"
              />
              <span className="text-base font-headline uppercase font-bold">
                {headerContent.logoText}
              </span>
            </div>

            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* CENTER CONTENT */}
          <div className="flex-1 overflow-y-auto flex flex-col justify-center px-6">

            <div className="flex flex-col items-center text-center gap-6 py-10">

              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-3xl sm:text-4xl italic tracking-tight leading-[1.1] ${
                      isActive(link.path) ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

            </div>

          </div>

          {/* FOOTER */}
          <div className="px-5 py-5 border-t border-outline-variant/10 space-y-4 shrink-0">

            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface/40">
                Appearance
              </span>
              <ThemeToggle />
            </div>

            <button
              onClick={() => {
                navigate('/contact');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-4 bg-primary text-on-primary text-[10px] uppercase tracking-[0.25em] font-bold"
            >
              {headerContent.bookingCta}
            </button>

          </div>

        </motion.div>
      </>
    )}
  </AnimatePresence>
</nav>
);
};

export default Navbar;
