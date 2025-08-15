import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-bg-light dark:bg-bg-dark border-t border-white/20 dark:border-white/10 mt-20 overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-10 w-80 h-80 rounded-full bg-accent2-dark/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Responsive grid: 1 col -> 2 cols (sm) -> 4 cols (md) -> 5 cols (xl) with brand spanning 2 */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4 xl:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rotate-45 rounded-sm shadow-lg bg-primary" />
              <span className="font-bold tracking-widest text-text-light dark:text-text-dark">MINI DRIVE</span>
            </div>
            <p className="text-sm leading-relaxed text-text-light/70 dark:text-text-dark/70 max-w-xs">
              Secure, fast and elegant storage that fits in your pocket. Effortless file sharing for modern workflows.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {/* Social icons (placeholder SVGs) */}
              {['twitter','github','linkedin'].map(icon => (
                <a key={icon} href="#" aria-label={icon} className="group p-2 rounded-lg bg-white/5 hover:bg-white/10 dark:bg-white/10 dark:hover:bg-white/20 border border-white/10 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-primary/70 group-hover:stroke-primary transition" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" className="stroke-primary/30" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="sm:justify-self-start">
            <h3 className="text-sm font-semibold tracking-wider text-text-light dark:text-text-dark mb-4">PRODUCT</h3>
            <ul className="space-y-3 text-sm">
              {['Features','Pricing','Security','Roadmap'].map(item => (
                <li key={item}>
                  <a href="#" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

            {/* Resources */}
          <div className="sm:justify-self-start">
            <h3 className="text-sm font-semibold tracking-wider text-text-light dark:text-text-dark mb-4">RESOURCES</h3>
            <ul className="space-y-3 text-sm">
              {['Docs','API','Community','Support'].map(item => (
                <li key={item}>
                  <a href="#" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="sm:justify-self-start">
            <h3 className="text-sm font-semibold tracking-wider text-text-light dark:text-text-dark mb-4">COMPANY</h3>
            <ul className="space-y-3 text-sm">
              {['About','Blog','Careers','Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-text-light/60 dark:text-text-dark/60">© {year} Mini Drive. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link to="#" className="text-text-light/60 dark:text-text-dark/60 hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="text-text-light/60 dark:text-text-dark/60 hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="text-text-light/60 dark:text-text-dark/60 hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
