import { CheckCircle2, FileText, FileWarning } from "lucide-react";
import { useTranslations } from "next-intl";

type PostsStatsProps = {
  totalPosts: number;
  published: number;
  drafts: number;
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
}: PostsStatsProps) {
  const t = useTranslations("postsStats");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label={t("totalPosts")} value={totalPosts} icon={FileText} />
      <StatCard label={t("published")} value={published} icon={CheckCircle2} />
      <StatCard label={t("drafts")} value={drafts} icon={FileWarning} />
    </div>
  );
}
