
export const SITE_CONFIG = {
  name: 'Singleframe Photography',
  whatsapp: {
    number: '919840000000', // Default number, should be updated by user
    messages: {
      home: 'Hi, I came from your website and want to know more about your photography services.',
      services: 'Hi, I’m interested in your photography packages and services.',
      contact: 'Hi, I want to discuss a potential project with Singleframe.',
      gallery: 'Hi, I just saw your portfolio and would like to inquire about a shoot.',
      about: 'Hi, I’d like to learn more about your studio and approach.',
      seo: 'Hi, I’m interested in SEO services for my business.'
    }
  },
  links: {
    instagram: 'https://www.instagram.com/singleframe_photography/',
    vimeo: 'https://vimeo.com/',
    mail: 'mailto:studio@singleframe.in'
  }
};

export const getWhatsAppLink = (page: keyof typeof SITE_CONFIG.whatsapp.messages = 'home') => {
  const message = encodeURIComponent(SITE_CONFIG.whatsapp.messages[page]);
  return `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${message}`;
};
