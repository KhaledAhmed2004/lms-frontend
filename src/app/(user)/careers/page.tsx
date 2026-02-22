"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";

/* ────────────────────────── data ────────────────────────── */

const roles = [
  {
    id: "online-tutor",
    department: "Tutor",
    title: "Online Tutor",
    tags: ["Tutor", "Remote", "Flexible"],
    description:
      "Work 1-on-1 with students in grades 5\u201313, fully online. You set your own hours \u2014 we handle everything else. Pay starts at 15 \u20AC/h and grows automatically as you gain experience.",
    posted: "Feb 2026",
    detail: {
      breadcrumb: "EDUCATION \u00B7 REMOTE \u00B7 FLEXIBLE",
      badges: ["From 15 \u20AC/h", "Flexible hours", "100% Online"],
      about:
        "As an Online Tutor at Sch\u00E4fer Tutoring, you\u2019ll work 1-on-1 with students in grades 5\u201313, helping them improve in their chosen subjects. All sessions take place via Google Meet. You choose your own hours and availability \u2014 we handle the matching, scheduling, and billing.",
      requirements: [
        "Strong subject knowledge in at least one subject (Grades 5\u201313)",
        "Currently enrolled as a student or university graduate",
        "Patient, reliable, and communicative",
        "Laptop and stable internet connection",
        "Available for at least a few hours per week",
      ],
      compensationText:
        "Pay scales automatically with your experience level. You start at 15 \u20AC/h and increase as you complete more sessions \u2014 up to 20 \u20AC/h with a 90% revenue share at the top level.",
      levels: [
        { label: "Level 0", pay: "15 \u20AC/h", highlight: false },
        { label: "Level 2", pay: "16 \u20AC/h", highlight: false },
        { label: "Level 4", pay: "18 \u20AC/h", highlight: false },
        { label: "Level 6", pay: "20 \u20AC/h", highlight: true },
      ],
    },
  },
];

const departments = [...new Set(roles.map((r) => r.department))];

/* ────────────────────────── page ────────────────────────── */

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const activeRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-blue-50/60 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Build something
              <br />
              that actually matters.
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              We&apos;re a small, fast-moving team on a mission to make great
              tutoring accessible to every student. Come help us get there.
            </p>
          </div>

          <div className="flex items-center gap-0 shrink-0">
            <div className="text-center px-8">
              <p className="text-3xl font-bold text-[#0B31BD]">{roles.length}</p>
              <p className="text-sm text-gray-500 mt-1">Open role</p>
            </div>
            <div className="w-px h-14 bg-gray-200" />
            <div className="text-center px-8">
              <p className="text-3xl font-bold text-gray-900">DE</p>
              <p className="text-sm text-gray-500 mt-1">Based in Germany</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="border-y border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Filter:</span>
            <select className="h-9 px-3 pr-8 rounded-md border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer">
              <option>All Departments</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select className="h-9 px-3 pr-8 rounded-md border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer">
              <option>All Locations</option>
              <option>Remote</option>
            </select>
            <select className="h-9 px-3 pr-8 rounded-md border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer">
              <option>All Types</option>
              <option>Flexible</option>
            </select>
          </div>
          <p className="text-sm text-[#0B31BD] font-medium">
            {roles.length} position found
          </p>
        </div>
      </div>

      {/* ── Job Listings ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {departments.map((dept) => {
          const deptRoles = roles.filter((r) => r.department === dept);
          return (
            <div key={dept} className="mb-10">
              {/* Department header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase shrink-0">
                  {dept}
                </span>
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <span className="text-sm text-[#0B31BD] font-medium shrink-0">
                  {deptRoles.length} role
                </span>
              </div>

              {/* Role cards */}
              <div className="space-y-4">
                {deptRoles.map((role) => (
                  <div
                    key={role.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {role.tags.map((tag, i) => (
                          <span
                            key={tag}
                            className={`text-xs font-medium px-3 py-1 rounded-full border ${
                              i === 0
                                ? "text-[#0B31BD] border-[#0B31BD]/20 bg-blue-50"
                                : "text-gray-500 border-gray-200 bg-gray-50"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {role.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                        {role.description}
                      </p>
                      <p className="text-xs text-amber-600 mt-3">
                        Posted {role.posted}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedRole(role.id)}
                      className="shrink-0 px-6 py-2.5 rounded-lg border border-[#0B31BD] text-[#0B31BD] text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      View Role &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Role Detail Modal ── */}
      {activeRole ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedRole(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-[#0B31BD] rounded-t-2xl px-8 pt-8 pb-6 relative">
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <p className="text-xs text-blue-200 tracking-widest font-medium mb-2">
                {activeRole.detail.breadcrumb}
              </p>
              <h2 className="text-2xl font-bold text-white mb-4">
                {activeRole.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {activeRole.detail.badges.map((badge) => (
                  <span
                    key={badge}
                    className="text-xs font-medium text-white bg-white/20 px-3 py-1 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal body */}
            <div className="px-8 py-8 space-y-8">
              {/* About the Role */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  About the Role
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activeRole.detail.about}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {activeRole.detail.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#0B31BD] mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compensation */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  Compensation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {activeRole.detail.compensationText}
                </p>
                <div className="grid grid-cols-4 border border-gray-200 rounded-lg overflow-hidden">
                  {activeRole.detail.levels.map((level) => (
                    <div
                      key={level.label}
                      className="text-center py-3 border-r last:border-r-0 border-gray-200"
                    >
                      <p
                        className={`text-sm font-semibold ${
                          level.highlight ? "text-[#0B31BD]" : "text-gray-900"
                        }`}
                      >
                        {level.label}
                      </p>
                      <p
                        className={`text-sm ${
                          level.highlight ? "text-[#0B31BD]" : "text-gray-500"
                        }`}
                      >
                        {level.pay}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-8 pb-8 flex justify-center gap-3">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-8 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <Link
                href="/free-trial-teacher"
                className="px-8 py-2.5 rounded-lg bg-[#0B31BD] text-white text-sm font-medium hover:bg-[#062183] transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
