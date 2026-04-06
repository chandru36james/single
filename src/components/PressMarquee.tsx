import React from 'react';
import { motion } from 'motion/react';

const brands = [
  'VOGUE', 'BAZAAR', 'ELLE', 'GQ', 'WALLPAPER*', 'AD', 'NY TIMES', 'FORBES'
];

const PressMarquee = () => {
  return (
    <div className="py-5 bg-surface border-y border-outline-variant/10 overflow-hidden select-none">
      <div className="flex whitespace-nowrap">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex gap-20 items-center pr-20"
        >
          {/* Double the brands for seamless loop */}
          {[...brands, ...brands].map((brand, idx) => (
            <span
              key={idx}
              className="font-headline text-4xl md:text-6xl font-bold text-on-surface/10 hover:text-primary transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PressMarquee;
