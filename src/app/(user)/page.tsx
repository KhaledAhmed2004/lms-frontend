"use client";

import Banner from "./components/home/Banner";
import Testimonial from "./components/home/Testimonial";
import Stats from "./components/home/Stats";
import HowItWorks from "./components/home/HowItWorks";
import Approach from "./components/home/Approach";
import FAQSection from "./components/home/FAQSection";
import PricingSection from "./components/home/PricingSection";
import TutorsSection from "./components/home/TutorsSection";

const stats = [
  { value: "94%", label: "Success Rate" },
  { value: "2500+", label: "Learning Materials" },
  { value: "4.8/5", label: "Satisfaction" },
];

const heading = {
  title: "How it works",
  subtitle: "Define your learning needs - we'll match you with the right tutor.",
};

const cards = [
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

const approach = {
  tag: "Our Approach",
  description: `We match you with a tutor who listens, understands your goals, and adapts to your learning style.
  With a personalized learning plan, grades improve faster and confidence grows with every lesson.`,
  image: "/boy2.png",
};

export default function page() {
  return (
    <>
      <div>
        <section>
          <Banner />
        </section>
        <section>
          <Stats stats={stats} />
        </section>
        <section>
          <HowItWorks heading={heading} cards={cards} />
        </section>
        <section>
          <Approach approach={approach} />
        </section>
        <section>
          <TutorsSection />
        </section>
        <section>
          <PricingSection />
        </section>
        <section>
          <Testimonial />
        </section>
        <section>
          <FAQSection />
        </section>
      </div>
    </>
  );
}
