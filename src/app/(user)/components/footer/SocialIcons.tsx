"use client";
import { Facebook, Instagram, Youtube } from "lucide-react";

const XIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SocialIcons = () => {
  const icons = [
    { component: <Facebook size={24} />, href: "https://www.facebook.com/people/Sch%C3%A4fer-Tutoring/61588347847248/" },
    { component: <Youtube size={24} />, href: "https://www.youtube.com/channel/UCVFXs7aKntGJd2doRzEmjXA" },
    { component: <Instagram size={22} />, href: "https://www.instagram.com/schaefer_tutoring/" },
    { component: <XIcon size={22} />, href: "https://x.com/schaefer_tutor" },
  ];

  return (
    <div className="flex gap-4">
      {icons.map((icon, idx) => (
        <a key={idx} href={icon.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
          {icon.component}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
