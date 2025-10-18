import React from "react";

const Footer = () => (
  // ADDED: fixed, bottom-0, w-full
  // REMOVED: mt-auto
  <footer className="fixed bottom-0 w-full bg-surface/40 border-t border-border backdrop-blur-sm z-10">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-center text-text-secondary text-sm">
        Organised by <span className="font-semibold text-gradient"> EESA </span> , IIT INDORE
      </p>
      <p className="text-center text-text-secondary text-sm">
        @2025 Electricasl Engineering Students Association 
      </p>
    </div>
  </footer>
);

export default Footer;