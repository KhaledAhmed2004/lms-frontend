"use client";

import FooterSection from "./FooterSection";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  return (
    <footer className="bg-[#0B31BD] text-white">
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand & Social */}
          <div className="space-y-6 mb-[37px]">
            <h2 className="text-2xl font-bold">Schäfer Tutoring</h2>
            <SocialIcons />
          </div>

          {/* Rechtliches */}
          <FooterSection
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms for Students", href: "/terms" },
              { label: "Terms for Tutors", href: "/terms-for-tutors" },
              { label: "Cancellation Policy", href: "/cancellation-policy" },
              { label: "Legal Notice", href: "/legal-notice" },
              { label: "Cookie Policy", href: "/cookie-policy" },
            ]}
          />

          {/* Unternehmen */}
          <FooterSection
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Blog", href: "/blogs" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#546FD0] text-center">
          <p className="text-sm text-white/60">
            © 2025 Schäfer Tutoring. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
