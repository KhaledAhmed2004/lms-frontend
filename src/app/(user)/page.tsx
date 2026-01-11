"use client";

import Banner from "./components/home/Banner";
import Testimonial from "./components/home/Testimonial";
import Stats from "./components/home/Stats";
import HowItWorks from "./components/home/HowItWorks";
import Approach from "./components/home/Approach";
import FAQSection from "./components/home/FAQSection";
import PricingSection from "./components/home/PricingSection";
import TutorsSection from "./components/home/TutorsSection";

export default function page() {
  return (
    <>
      <div>
        <section>
          <Banner />
        </section>
        <section>
          <Stats />
        </section>
        <section>
          <HowItWorks />
        </section>
        <section>
          <Approach />
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
