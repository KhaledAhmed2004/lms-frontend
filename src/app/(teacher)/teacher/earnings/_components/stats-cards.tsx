"use client";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useTutorStats } from "@/hooks/api";
import { formatNumber } from "./utils";

export default function StatsCards() {
  const { data: stats, isLoading } = useTutorStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {/* Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-4 bg-blue-50 p-3 rounded-full w-fit">
          <Image src="/cap.svg" alt="" width={24} height={24} />
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Sessions</h3>
        {isLoading ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.stats?.completedSessions || 0}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Total: {formatNumber(stats?.stats?.totalHours || 0)} h
            </p>
          </>
        )}
      </div>

      {/* Earnings */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-4 bg-green-50 p-3 rounded-full w-fit">
          <Image src="/dollar.svg" alt="" width={24} height={24} />
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Earnings</h3>
        {isLoading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900">
              {formatNumber(stats?.earnings?.currentMonth || 0)}{" "}
              <span className="text-lg text-gray-500">€</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Total: {formatNumber(stats?.earnings?.totalEarnings || 0)} €
            </p>
          </>
        )}
      </div>

      {/* Trial Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-4 bg-orange-50 p-3 rounded-full w-fit">
          <BookOpen className="text-[#FF8A00]" size={24} />
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Trial Sessions
        </h3>
        {isLoading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.trialStats?.conversionRate || 0}{" "}
              <span className="text-lg text-gray-500">%</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {stats?.trialStats?.convertedTrials || 0} /{" "}
              {stats?.trialStats?.totalTrials || 0} converted
            </p>
          </>
        )}
      </div>

      {/* Students */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-4 bg-[#F3F3F3] p-3 rounded-full w-fit">
          <Image src="/users.svg" alt="" width={24} height={24} />
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Students</h3>
        {isLoading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.stats?.totalStudents || 0}
            </div>
            <p className="text-sm text-gray-500 mt-3">Active students</p>
          </>
        )}
      </div>
    </div>
  );
}
