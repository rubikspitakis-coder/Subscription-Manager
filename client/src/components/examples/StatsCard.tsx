import { StatsCard } from "../stats-card";
import { CreditCard } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <StatsCard
        title="Total Subscriptions"
        value={12}
        icon={CreditCard}
        description="Active subscriptions"
      />
    </div>
  );
}
