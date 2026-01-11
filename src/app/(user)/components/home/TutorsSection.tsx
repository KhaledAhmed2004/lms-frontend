"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const tutors = [
  { id: 1, name: "Luca", rating: 4.9, specialization: "Soziologie TU Berlin", image: "/luca.jpg" },
  { id: 2, name: "Diego", rating: 4.9, specialization: "Soziologie TU Berlin", image: "/diego.jpg" },
  { id: 3, name: "Yumi", rating: 5, specialization: "Soziologie TU Berlin", image: "/yumi.jpg" },
  { id: 4, name: "Lisa", rating: 5, specialization: "Soziologie TU Berlin", image: "/lisa.jpg" },
  { id: 5, name: "Luca", rating: 4.9, specialization: "Soziologie TU Berlin", image: "/luca.jpg" },
  { id: 6, name: "Diego", rating: 4.9, specialization: "Soziologie TU Berlin", image: "/diego.jpg" },
  { id: 7, name: "Yumi", rating: 5, specialization: "Soziologie TU Berlin", image: "/yumi.jpg" },
  { id: 8, name: "Lisa", rating: 5, specialization: "Soziologie TU Berlin", image: "/lisa.jpg" },
];

export default function TutorsSection() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B31BD]">
            Our Tutors
          </h2>
          <p className="mt-4 text-lg text-[#061651]">
            Every tutor goes through a two-step selection process.
          </p>
          <p className="mt-2 text-lg text-[#061651]">
            We make sure they don't just teach — they motivate, listen, and
            support each student individually.
          </p>
        </div>

        {/* Carousel with centered bottom navigation */}
        <div className="relative">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{ align: "start", loop: true }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-6 md:-ml-8">
              {tutors.map((tutor) => (
                <CarouselItem
                  key={tutor.id}
                  className="pl-6 md:pl-8 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="border rounded-xl border-[#4864CE] overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="relative aspect-4/4">
                      <Image
                        src={tutor.image}
                        alt={tutor.name}
                        fill
                        className="object-cover object-center rounded-full p-5"
                      />
                    </div>
                    <div className="py-6 px-4 text-center">
                      <h3 className="text-lg md:text-xl font-bold text-[#0B31BD]">
                        {tutor.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mt-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 md:w-5 md:h-5 ${
                                i < Math.floor(tutor.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.335 9.39c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.962z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-xs md:text-sm text-gray-600">
                        {tutor.specialization}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows - Centered at the Bottom */}
            <div className="hidden lg:flex justify-center items-center gap-6 mt-16">
              <CarouselPrevious className="
                relative 
                static 
                w-12 h-12 
                bg-white 
                border-2 border-[#4864CE] 
                text-[#0B31BD] 
                hover:bg-[#0B31BD] 
                hover:text-white 
                shadow-lg 
                rounded-full 
                flex 
                items-center 
                justify-center
              " />

              <CarouselNext className="
                relative 
                static 
                w-12 h-12 
                bg-white 
                border-2 border-[#4864CE] 
                text-[#0B31BD] 
                hover:bg-[#0B31BD] 
                hover:text-white 
                shadow-lg 
                rounded-full 
                flex 
                items-center 
                justify-center
              " />
            </div>
          </Carousel>

          {/* Extra space below arrows */}
          <div className="h-8" />
        </div>
      </div>
    </section>
  );
}