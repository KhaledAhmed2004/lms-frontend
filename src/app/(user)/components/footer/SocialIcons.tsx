"use client";
import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";

const SocialIcons = () => {
  const icons = [
    { component: <Instagram size={22} />, href: "#" },
    { component: <Facebook size={24} />, href: "#" },
    { component: <Youtube size={24} />, href: "#" },
    {
      component: (
        <Image src="/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
      ),
      href: "#",
    },
  ];

  return (
    <div className="flex gap-4">
      {icons.map((icon, idx) => (
        <a key={idx} href={icon.href} className="hover:opacity-80 transition">
          {icon.component}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
