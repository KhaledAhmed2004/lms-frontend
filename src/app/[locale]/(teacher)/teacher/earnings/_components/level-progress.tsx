"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useTutorStats } from "@/hooks/api";

import { useTranslations } from "next-intl";

export default function LevelProgress() {
  const { data: stats, isLoading } = useTutorStats();
  const t = useTranslations("earnings");

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {t("levelProgress")}
        </h2>
        {isLoading || !stats ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <div className="flex items-center gap-2 bg-[#002AC8] text-white px-4 py-2 rounded-lg">
            <Image width={24} height={24} src="/badge-wt.svg" alt={t("badges")} />
            <span className="font-semibold">
              {t("level", { n: stats.level?.current || 1 })}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {isLoading || !stats ? (
          <>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-full" />
          </>
        ) : stats.nextLevel ? (
          <>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t("progressToLevel", { n: stats.nextLevel.level })}</span>
              <span className="text-[#3052D2]">
                {t("lessonsLeft", { n: stats.nextLevel.sessionsNeeded })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#002AC8] h-full rounded-full transition-all"
                style={{ width: `${stats.nextLevel.progressPercent}%` }}
              />
            </div>
            <div className="bg-[#FFF4E6] border border-[#FFB256] rounded-lg p-3 flex items-start gap-2 mt-5">
              <Image width={24} height={24} src="/badge-yl.svg" alt={t("badges")} />
              <p className="text-sm text-amber-800">
                {t("earningsWillGrow", { rate: stats.nextLevel.hourlyRate, n: stats.nextLevel.level })}
              </p>
            </div>
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <Image width={24} height={24} src="/badge-wt.svg" alt={t("badges")} />
            <p className="text-sm text-green-800">
              {t("maxLevel")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
