/* eslint-disable @next/next/no-img-element */
"use client";

import Approach from "./Approach";
import HowItWorks from "./HowItWorks";
import Stats from "./Stats";

// Removed: import { ReactLenis } from "lenis/react";

export default function Funcard() {
  const data = {
    stats: [
      { value: "94%", label: "Success Rate" },
      { value: "2500+", label: "Learning Materials" },
      { value: "4.8/5 ", label: "Satisfaction" },
    ],
    heading: {
      title: "How it works",
      subtitle:
        "Define your learning needs - we'll match you with the right tutor.",
    },
    cards: [
      {
        step: "1.",
        title: "Send your Request",
        description:
          "Tell us the subject you need help with and when you're available.",
        image: "/boy1.png",
        bgColor: "bg-[#8396DE]",
      },
      {
        step: "2.",
        title: "Meet your Tutor",
        description:
          "We connect you with a suitable tutor based on your goals.",
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
    ],
    approach: {
      tag: "Our Approach",
      description: `We match you with a tutor who listens, understands your goals, and adapts to your learning style.
      With a personalized learning plan, grades improve faster and confidence grows with every lesson.`,
      image: "/boy2.png",
    },
  };

  const { stats, heading, cards, approach } = data;

  return (
    <>
      <Stats stats={stats} />
      <HowItWorks heading={heading} cards={cards} />

      <Approach approach={approach} />
    </>
  );
}
