import Link from "next/link";

/* ──────────────────────────── data ──────────────────────────── */

const commitments = [
  {
    title: "FAIR PRICING",
    description:
      "Clear monthly structure starting from €25/hour. No hidden fees. Cancel anytime.",
  },
  {
    title: "PERSONAL SUPPORT",
    description:
      "Individual tutoring focused on long-term development. Clear structure instead of random sessions.",
  },
  {
    title: "DIGITAL ORGANISATION",
    description:
      "Automated scheduling, digital invoicing and organised communication.",
  },
  {
    title: "PERFORMANCE-BASED TUTOR LEVELS",
    description:
      "Tutors are paid transparently and progress through performance-based levels.",
  },
];

const audiences = [
  {
    title: "For Students",
    items: [
      "Long-term academic support",
      "Clear learning structure",
      "Flexible online scheduling",
    ],
  },
  {
    title: "For Parents",
    items: [
      "Transparent pricing model",
      "Clear cancellation terms",
      "Reliable communication",
    ],
  },
  {
    title: "For Tutors",
    items: [
      "Transparent compensation system",
      "Performance-based level progression",
      "Organised scheduling",
    ],
  },
];
/* ──────────────────────────── page ──────────────────────────── */

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-[#0B31BD] py-24 px-4 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200 mb-4">
          About Us
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Tutoring reimagined.
          <br />
          Structure meets care.
        </h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-lg">
          Sch&auml;fer Tutoring stands for digital organisation, transparent
          pricing, and personal support that actually makes a difference.
        </p>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Our Mission
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-10">
          Why we built Schäfer Tutoring
        </h2>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
          <p>
            Many tutoring platforms have become expensive for families and
            complicated for teachers. Prices are high. Teacher pay is often
            unclear. Processes lack transparency. We chose a different approach.
            Schäfer Tutoring was built to create a structured system where
            students and tutors can focus actually matters: learning and
            teaching. No hidden fees. No inflated commissions. Just organised,
            fair tutoring.
          </p>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* placeholder image */}
          <div className="aspect-[3/4] max-w-sm mx-auto w-full rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100" />

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-2">
              The Founder
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Simon Sch&auml;fer
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Simon studied Industrial Engineering and worked in
                digitalisation and process automation before founding
                Sch&auml;fer Tutoring.
              </p>

              <p>
                Before founding Sch&auml;fer Tutoring, Simon tutored for four
                years — three years at a tutoring agency and one year through
                his own small company. During his time at the agency, regular
                conversations with fellow tutors and students revealed recurring
                structural problems: high prices for families, low and often
                unclear pay for tutors, and little transparency in how the
                system operated. Eventually, he decided it was time to take
                responsibility and build a better alternative himself.
              </p>

              <p>
                Sch&auml;fer Tutoring was built differently. The goal was not to
                create another marketplace, but a reliable infrastructure that:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>keeps pricing transparent</li>
                <li>pays tutors fairly</li>
                <li>ensures structured organisation</li>
              </ul>
            </div>

            <blockquote className="mt-8 border-l-4 border-[#0B31BD] pl-5 py-3 bg-white rounded-r-lg">
              <p className="font-semibold italic text-gray-900">
                &ldquo;Tutoring works best when structure and fairness come
                first.&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-1">
                &mdash; Simon Sch&auml;fer, Founder
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Quality Commitment ── */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Standards
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-14">
          Our quality commitment.
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {commitments.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-[#0B31BD]/20 rounded-xl p-8 text-left"
            >
              <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who we serve ── */}
      <section className="py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Who We Serve
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-14">
          Who we&apos;re here for.
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((a) => (
            <div key={a.title} className="bg-gray-50 rounded-xl p-8 text-left">
              <h3 className="font-bold text-gray-900 mb-5">{a.title}</h3>
              <ul className="space-y-3">
                {a.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-[#0B31BD]">&rarr;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Vision ── */}
      {/* ── Our Vision ── */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Our Vision
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-10">
          Where we&apos;re headed.
        </h2>

        <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-6">
          <p>
            Sch&auml;fer Tutoring aims to build a tutoring solution that can be
            used by as many students as possible.
          </p>

          <p>Our goal is to create a platform that is:</p>

          {/* Centered block but left-aligned bullet text */}
          <ul className="list-disc pl-6 space-y-2 inline-block text-left mx-auto">
            <li>simple enough for anyone to use</li>
            <li>fair enough for tutors to stay long-term</li>
            <li>affordable enough for families</li>
            <li>structured enough to scale sustainably</li>
          </ul>

          <p>
            We are building not just a platform, but a system designed for broad
            adoption — accessible, and built around the real needs of students
            and teachers.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0B31BD] py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Learn. Teach. Grow together.
        </h2>
        <p className="text-blue-100 mb-10 max-w-xl mx-auto">
          Experience organised and transparent tutoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/free-trial-student"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-[#0B31BD] font-medium hover:bg-gray-100 transition-colors"
          >
            Trial Session
          </Link>
          <Link
            href="/free-trial-teacher"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
          >
            Become a Tutor
          </Link>
        </div>
      </section>
    </div>
  );
}
