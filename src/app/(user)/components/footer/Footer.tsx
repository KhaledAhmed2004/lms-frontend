"use client";

import SocialIcons from "./SocialIcons";
import FooterSection from "./FooterSection";

const Footer = () => {
  return (
    <footer className="bg-[#0B31BD] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand & Social */}
          <div className="space-y-6 mb-[37px]">
            <h2 className="text-2xl font-bold">Schäfer Tutoring</h2>
            <SocialIcons />
          </div>

          {/* Rechtliches */}
          <FooterSection
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms for Students", href: "#" },
              { label: "Terms for Tutors", href: "#" },
              { label: "Cancellation Policy", href: "#" },
              { label: "Legal Notice", href: "#" },
              { label: "Cookie Policy", href: "#" },
            ]}
          />

          {/* Unternehmen */}
          <FooterSection
            title="Company"
            links={[
              { label: "About Us", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-2xl mb-4">Newsletter</h3>
            <div className="space-y-3 mt-8">
              <input
                type="email"
                placeholder="Enter your E-Mail"
                className="w-full px-4 py-2 rounded-[12px] mb-[25px] bg-[#9CA8DB] text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="w-full bg-white text-black font-semibold py-2 px-6 rounded-[12px] hover:bg-gray-100 transition">
                Sign Up
              </button>
            </div>
          </div>
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
