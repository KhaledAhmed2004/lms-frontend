"use client";

interface Stat {
  value: string;
  label: string;
}

interface StatsProps {
  stats: Stat[];
}

export default function Stats({ stats }: StatsProps) {
  return (
    <section className="bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl md:text-2xl font-bold text-[#0B31BD]">
                {stat.value}
              </p>
              <p className="text-sm md:text-2xl font-bold text-[#0B85BD] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}