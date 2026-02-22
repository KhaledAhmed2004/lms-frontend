import Link from "next/link";

/* ──────────────────────────── data ──────────────────────────── */

const values = [
  {
    title: "Structure",
    description: "Clear processes from first contact through to billing.",
  },
  {
    title: "Transparency",
    description: "Fair pricing, traceable processes, no hidden costs.",
  },
  {
    title: "Quality",
    description: "Vetted tutors, personal matching, continuous support.",
  },
];

const steps = [
  {
    number: 1,
    title: "Submit a Request",
    description: "Tell us your subject, grade, and availability.",
  },
  {
    number: 2,
    title: "Tutor Assignment",
    description:
      "We match you with the right tutor based on subject and goals.",
  },
  {
    number: 3,
    title: "Trial Lesson",
    description:
      "A first session to ensure the fit \u2014 no commitment required.",
  },
  {
    number: 4,
    title: "Ongoing Support",
    description: "A dedicated tutor, clear scheduling, reliable structure.",
  },
];

const commitments = [
  {
    title: "Transparent Pricing",
    description:
      "Single sessions from 30 \u20AC/h, monthly plan from 25 \u20AC/h \u2014 clearly communicated, cancellable monthly.",
  },
  {
    title: "Performance-Based Tutor Levels",
    description:
      "Tutors advance automatically with experience across 7 levels \u2014 fair pay and a strong incentive for quality.",
  },
  {
    title: "Personal 1-on-1 Support",
    description:
      "No group sessions, no generic plans \u2014 individual guidance tailored to each student\u2019s needs.",
  },
  {
    title: "Digital Organisation",
    description:
      "Automated scheduling, seamless session setup, and digital invoicing \u2014 everything handled end to end.",
  },
];

const audiences = [
  {
    title: "For Students",
    items: [
      "Grades 5 through 13",
      "Exam & Abitur preparation",
      "Long-term learning support",
      "Flexible scheduling",
    ],
  },
  {
    title: "For Parents",
    items: [
      "Clear, fair pricing",
      "Reliable structure & scheduling",
      "Full transparency on process",
      "Monthly cancellation \u2014 no risk",
    ],
  },
  {
    title: "For Tutors",
    items: [
      "Transparent, fair compensation",
      "Automatic level progression",
      "Organised sessions & scheduling",
      "Focus on teaching, not admin",
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

      {/* ── Values ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 justify-center">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex-1 border border-gray-200 rounded-xl p-8 text-center"
            >
              <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Our Mission
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-10">
          Why we do this.
        </h2>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
          <p>
            Traditional tutoring is often unstructured, intransparent, and
            difficult to plan around. Students are assigned tutors without
            consideration for their goals. Parents have little visibility into
            what&apos;s actually happening. Quality varies &mdash; and
            accountability is rare.
          </p>
          <p>
            We built Sch&auml;fer Tutoring to change exactly that. Clear
            processes, fair pricing, and genuine personal support &mdash; for
            everyone involved.
          </p>
          <p>
            Our goal isn&apos;t to simply connect tutors with students. It&apos;s
            to build a system that all three sides &mdash; students, parents, and
            tutors &mdash; can genuinely rely on.
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
                Simon studied Industrial Engineering and brings a strongly
                analytical, entrepreneurial background. Before founding
                Sch&auml;fer Tutoring, he worked in digitalisation and process
                automation &mdash; and recognised how little of that had reached
                the education sector.
              </p>
              <p>
                The idea behind Sch&auml;fer Tutoring was always bigger than
                traditional tutoring: not a tutor on demand, but a structured,
                scalable system that works equally well for students, parents,
                and tutors.
              </p>
              <p>
                His goal is a platform built for long-term growth &mdash; with
                clear standards and genuine quality assurance at every step.
              </p>
            </div>

            <blockquote className="mt-8 border-l-4 border-[#0B31BD] pl-5 py-3 bg-white rounded-r-lg">
              <p className="font-semibold italic text-gray-900">
                &ldquo;Tutoring shouldn&apos;t be left to chance &mdash; it needs
                structure.&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-1">
                &mdash; Simon Sch&auml;fer, Founder
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Our Process
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-14">
          How it works.
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div
              key={s.number}
              className="bg-gray-100 rounded-xl p-8 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#0B31BD] text-white flex items-center justify-center text-lg font-bold mb-5">
                {s.number}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.description}</p>
            </div>
          ))}
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
            <div
              key={a.title}
              className="bg-gray-50 rounded-xl p-8 text-left"
            >
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
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          Our Vision
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-10">
          Where we&apos;re headed.
        </h2>
        <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
          <p>
            Sch&auml;fer Tutoring is built to grow into a scalable platform that
            makes quality education accessible across Germany and beyond. With
            fully automated processes, intelligent matching, and AI-assisted
            learning analysis on the horizon, our goal is to ensure every student
            gets exactly the support they need &mdash; reliably, transparently,
            and for the long term.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0B31BD] py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Start learning with structure.
        </h2>
        <p className="text-blue-100 mb-10 max-w-xl mx-auto">
          Book a free trial lesson and see our approach for yourself &mdash; no
          commitment required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/free-trial-student"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-[#0B31BD] font-medium hover:bg-gray-100 transition-colors"
          >
            Book a Trial Lesson
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
