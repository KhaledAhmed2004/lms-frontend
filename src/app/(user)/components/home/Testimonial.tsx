"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/registry/magicui/marquee";

const reviews = [
  {
    name: "Sophie M.",
    username: "12th Grade, Gymnasium",
    body: "My math grades improved from a 4 to a 2 in just three months. My tutor explained concepts in a way that finally made sense to me.",
    img: "https://avatar.vercel.sh/sophie",
  },
  {
    name: "Lukas W.",
    username: "10th Grade, Realschule",
    body: "I was struggling with English for years. Now I actually enjoy the subject and feel confident speaking in class.",
    img: "https://avatar.vercel.sh/lukas",
  },
  {
    name: "Emma K.",
    username: "Abitur Preparation",
    body: "The flexible scheduling was perfect for my busy schedule. I could book sessions around my other commitments.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "Maximilian S.",
    username: "11th Grade, Gymnasium",
    body: "Physics was my weakest subject until I started here. My tutor's patience and clear explanations made all the difference.",
    img: "https://avatar.vercel.sh/max",
  },
  {
    name: "Hannah L.",
    username: "9th Grade, Gesamtschule",
    body: "I love how my tutor adapts to my learning style. The online sessions are convenient and the platform is easy to use.",
    img: "https://avatar.vercel.sh/hannah",
  },
  {
    name: "Felix R.",
    username: "8th Grade, Gymnasium",
    body: "Chemistry went from confusing to interesting! My tutor breaks down complex topics into simple steps I can understand.",
    img: "https://avatar.vercel.sh/felix",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-primary">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-primary/50">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Testimonial() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0B31BD] mb-2.5">
            What our students say
          </h2>
          <p className="text-[#061651] text-base sm:text-lg">
            Hear from our community of learners about their experience.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
        </div>
      </div>
    </section>
  );
}
