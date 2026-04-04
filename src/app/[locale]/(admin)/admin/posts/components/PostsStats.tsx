import { CheckCircle2, Eye, FileText, FileWarning } from "lucide-react";

type PostsStatsProps = {
  totalPosts: number;
  published: number;
  drafts: number;
  totalViews: number;
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof FileText;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#0B31BD]" />
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function PostsStats({
  totalPosts,
  published,
  drafts,
  totalViews,
}: PostsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Posts" value={totalPosts} icon={FileText} />
      <StatCard label="Published" value={published} icon={CheckCircle2} />
      <StatCard label="Drafts" value={drafts} icon={FileWarning} />
      <StatCard
        label="Total Views"
        value={totalViews.toLocaleString()}
        icon={Eye}
      />
    </div>
  );
}
