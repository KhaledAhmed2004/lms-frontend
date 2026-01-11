"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Card {
  step: string;
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

const heading = {
  title: "How it works",
  subtitle: "Define your learning needs - we'll match you with the right tutor.",
};

const cards: Card[] = [
  {
    step: "1.",
    title: "Send your Request",
    description: "Tell us the subject you need help with and when you're available.",
    image: "/boy1.png",
    bgColor: "bg-[#8396DE]",
  },
  {
    step: "2.",
    title: "Meet your Tutor",
    description: "We connect you with a suitable tutor based on your goals.",
    image: "/girl1.png",
    bgColor: "bg-[#83C1DE]",
  },
  {
    step: "3.",
    title: "Start Learning",
    description: "Improve your grades and build confidence.",
    image: "/girl2.png",
    bgColor: "bg-[#6490F8]",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="bg-white pt-16 lg:py-20">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 pb-5">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0B31BD] mb-2.5">
            {heading.title}
          </h2>
          <p className="text-[#061651] text-base sm:text-lg">
            {heading.subtitle}
          </p>
        </div>

        {/* Mobile: Sticky Stack Effect */}
        <div className="md:hidden">
          <main className="relative -mt-[20vh]">
            {cards.map((card, i) => {
              const targetScale = 1 - (cards.length - 1 - i) * 0.00;
              const scale = useTransform(scrollYProgress, [i / cards.length, (i + 1) / cards.length], [1, targetScale]);

              return (
                <div
                  key={i}
                  className="sticky top-0 flex h-screen items-center justify-center"
                >
                  <motion.div
                    style={{
                      scale,
                      top: `calc(-10% + ${i * 125}px)`,
                    }}
                    className="relative origin-top w-[90vw] max-w-sm"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 h-[420px] flex flex-col overflow-hidden">
                      <div className="p-6 pt-8 flex-1">
                        <p className="bg-gradient-to-r from-[#0B31BD] to-[#B0BEF2] bg-clip-text text-transparent font-bold text-3xl mb-3">
                          {card.step}
                        </p>
                        <h3 className="text-2xl font-bold text-[#313030] mb-3">
                          {card.title}
                        </h3>
                        <p className="text-[#1F2D62] text-lg leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <div className="relative h-[200px]">
                        <div className={`absolute bottom-0 left-0 right-0 h-[138px] ${card.bgColor}`} />
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[230px] z-10"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </main>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[467px]"
            >
              <div className="p-6 pt-8 flex-1">
                <p className="bg-gradient-to-r from-[#0B31BD] to-[#B0BEF2] bg-clip-text text-transparent font-bold text-3xl mb-3">
                  {card.step}
                </p>
                <h3 className="text-2xl font-bold text-[#313030] mb-3">
                  {card.title}
                </h3>
                <p className="text-[#1F2D62] text-lg leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="relative h-[200px]">
                <div className={`absolute rounded-b-xl bottom-0 left-0 right-0 h-[138px] ${card.bgColor}`} />
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[260px] z-10"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}