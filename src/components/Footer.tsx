import React, { useState, useEffect } from 'react';
import { Instagram, Video, ExternalLink, Mail } from 'lucide-react';
import { storage } from '../lib/storage';

const iconMap: Record<string, any> = {
  Instagram: <Instagram size={16} />,
  Video: <Video size={16} />,
  ExternalLink: <ExternalLink size={16} />,
  Behance: <ExternalLink size={16} />,
  Mail: <Mail size={16} />,
  Email: <Mail size={16} />
};

const Footer = () => {
  const [footerContent, setFooterContent] = useState({
    logoText: 'Singleframe',
    socials: [
      { name: 'Instagram', icon: 'Instagram', href: 'https://www.instagram.com/singleframe_photography/' },
      { name: 'Vimeo', icon: 'Video', href: '#' },
      { name: 'Behance', icon: 'ExternalLink', href: '#' },
      { name: 'Email', icon: 'Mail', href: 'mailto:contact@singleframe.photography' },
    ],
    copyright: '© 2024 Singleframe Photography. All Rights Reserved.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await storage.getContent('footer');
        if (content) {
          setFooterContent(prev => ({ ...prev, ...content }));
        }
      } catch (error) {
        console.error("Error fetching footer content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <footer className="w-full py-12 md:py-16 px-8 mt-auto bg-surface-container-low flex flex-col items-center justify-center text-center">

  <div className="font-headline text-2xl leading-tight text-on-surface mb-6">
  {footerContent.logoText}
</div>

<div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6 mb-10">
  {footerContent.socials.map((social) => (
    <a
      key={social.name}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm leading-none tracking-wide text-on-surface/60 hover:text-primary transition-all opacity-70 hover:opacity-100 hover:translate-y-[-1px]"
    >
      {iconMap[social.icon] || <ExternalLink size={16} />}
      {social.name}
    </a>
  ))}
</div>

<p className="text-xs leading-tight tracking-widest text-on-surface/40 uppercase flex flex-col md:flex-row items-center justify-center gap-2 text-center md:text-left">
    <span>{footerContent.copyright}</span>

    <span>
      Designed by{" "}
      <a
        href="https://vgotyou.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-on-surface/50 hover:text-primary transition-all"
      >
        VGot You
      </a>
    </span>
  </p>

</footer>
  );
};

export default Footer;
