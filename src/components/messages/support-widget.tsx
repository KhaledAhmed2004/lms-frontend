"use client";

import { Headphones } from "lucide-react";

export default function SupportWidget() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button className="flex items-center gap-3 bg-accent text-accent-foreground rounded-lg px-4 py-3 shadow-lg hover:bg-accent/90 transition-colors hover:shadow-xl">
        <div className="flex items-center justify-center w-8 h-8 bg-accent-foreground rounded-full">
          <Headphones className="w-5 h-5 text-accent" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-sm">Support Chat</div>
          <div className="text-xs opacity-90">Get help from our team</div>
        </div>
      </button>
    </div>
  );
}
