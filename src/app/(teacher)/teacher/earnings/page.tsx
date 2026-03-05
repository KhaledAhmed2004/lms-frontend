import LevelProgress from "./_components/level-progress";
import StatsCards from "./_components/stats-cards";
import PayoutSettings from "./_components/payout-settings";
import EarningsHistory from "./_components/earnings-history";

export default function EarningsPage() {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <LevelProgress />
      <StatsCards />
      <PayoutSettings />
      <EarningsHistory />
    </div>
  );
}
