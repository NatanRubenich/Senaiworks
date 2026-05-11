import React from 'react';

const Footer = () => (
  <footer className="bg-primary text-white gamer-accent mt-20">
    <div className="max-w-[1440px] mx-auto px-8 py-16 text-center flex flex-col items-center gap-2">
      <div className="font-headline text-3xl font-black tracking-tighter italic">
        <span>SENAI</span>
        <span className="text-white/60">WORKS</span>
        <span className="ml-2 text-secondary-container not-italic">Store</span>
      </div>
      <p className="font-body text-sm tracking-wide opacity-80 max-w-2xl">
        A excelência em Publicação Didática Digital de Games — Free-to-Play Edition
      </p>
      <p className="text-xs opacity-50 mt-6">© {new Date().getFullYear()} SenaiWorks Store · SENAI/SC</p>
    </div>
  </footer>
);

export default Footer;
