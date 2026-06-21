import Link from "next/link";
import { getTranslations } from "next-intl/server";

/* ──────────────────────────── page ──────────────────────────── */

export default async function AboutPage() {
  const t = await getTranslations("aboutPage");

  const commitments = [
    { title: t("commitment0Title"), description: t("commitment0Desc") },
    { title: t("commitment1Title"), description: t("commitment1Desc") },
    { title: t("commitment2Title"), description: t("commitment2Desc") },
    { title: t("commitment3Title"), description: t("commitment3Desc") },
  ];

  const audiences = [
    {
      title: t("audience0Title"),
      items: [t("audience0Item0"), t("audience0Item1"), t("audience0Item2")],
    },
    {
      title: t("audience1Title"),
      items: [t("audience1Item0"), t("audience1Item1"), t("audience1Item2")],
    },
    {
      title: t("audience2Title"),
      items: [t("audience2Item0"), t("audience2Item1"), t("audience2Item2")],
    },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-[#0B31BD] py-24 px-4 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200 mb-4">
          {t("heroLabel")}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {t("heroTitle")}
          <br />
          {t("heroSubtitle")}
        </h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-lg">
          {t("heroDesc")}
        </p>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          {t("missionLabel")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-10">
          {t("missionTitle")}
        </h2>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
          <p>{t("missionBody")}</p>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Founder image */}
          <div className="aspect-3/4 max-w-sm mx-auto w-full rounded-2xl overflow-hidden">
            <img
              src="/images/8.webp"
              alt="Simon Schäfer"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-2">
              {t("founderLabel")}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("founderName")}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t("founderBio1")}</p>

              <p>{t("founderBio2")}</p>

              <p>{t("founderBio3")}</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>{t("founderBullet1")}</li>
                <li>{t("founderBullet2")}</li>
                <li>{t("founderBullet3")}</li>
              </ul>
            </div>

            <blockquote className="mt-8 border-l-4 border-[#0B31BD] pl-5 py-3 bg-white rounded-r-lg">
              <p className="font-semibold italic text-gray-900">
                {t("quoteText")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("quoteAuthor")}
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Quality Commitment ── */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          {t("standardsLabel")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-14">
          {t("standardsTitle")}
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
          {t("whoLabel")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-14">
          {t("whoTitle")}
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
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0B31BD] mb-3">
          {t("visionLabel")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD] mb-10">
          {t("visionTitle")}
        </h2>

        <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-6">
          <p>{t("visionP1")}</p>

          <p>{t("visionP2")}</p>

          {/* Centered block but left-aligned bullet text */}
          <ul className="list-disc pl-6 space-y-2 inline-block text-left mx-auto">
            <li>{t("visionBullet0")}</li>
            <li>{t("visionBullet1")}</li>
            <li>{t("visionBullet2")}</li>
            <li>{t("visionBullet3")}</li>
          </ul>

          <p>{t("visionP3")}</p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0B31BD] py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t("ctaTitle")}
        </h2>
        <p className="text-blue-100 mb-10 max-w-xl mx-auto">
          {t("ctaDesc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/free-trial-student"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-[#0B31BD] font-medium hover:bg-gray-100 transition-colors"
          >
            {t("ctaTrial")}
          </Link>
          <Link
            href="/free-trial-teacher"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
          >
            {t("ctaTutor")}
          </Link>
        </div>
      </section>
    </div>
  );
}
