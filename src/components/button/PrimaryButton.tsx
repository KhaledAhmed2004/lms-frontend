"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  name: string;
  href: string;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  name,
  href,
  className,
}) => {
  return (
    <Link
      href={href as any}
      className={cn(
        "bg-[#0B31BD] hover:bg-[#092A9E] text-white font-medium rounded-[12px] text-lg",
        "w-[182px] h-[50px] flex items-center justify-center",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {name}
    </Link>
  );
};

export default PrimaryButton;
