import { useState } from "react";
import { addDays } from "date-fns";
import { StatsCard } from "@/components/stats-card";
import { SubscriptionCard } from "@/components/subscription-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  Search,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockSubscriptions = [
    {
      id: "1",
      name: "ChatGPT Plus",
      cost: 20,
      renewalDate: addDays(new Date(), 5),
      username: "user@example.com",
      password: "secure_password_123",
      status: "critical" as const,
    },
    {
      id: "2",
      name: "Claude Pro",
      cost: 20,
      renewalDate: addDays(new Date(), 12),
      username: "user@example.com",
      password: "another_secure_pass",
      status: "urgent" as const,
    },
    {
      id: "3",
      name: "Midjourney",
      cost: 30,
      renewalDate: addDays(new Date(), 22),
      username: "artist@example.com",
      password: "creative_password",
      status: "warning" as const,
    },
    {
      id: "4",
      name: "GitHub Copilot",
      cost: 10,
      renewalDate: addDays(new Date(), 45),
      username: "dev@example.com",
      password: "code_master_2024",
      status: "active" as const,
    },
  ];

  const totalCost = mockSubscriptions.reduce((sum, sub) => sum + sub.cost, 0);
  const upcomingRenewals = mockSubscriptions.filter(
    (sub) => {
      const days = Math.floor((sub.renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 14;
    }
  ).length;

  const filteredSubscriptions = mockSubscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your AI tool subscriptions
          </p>
        </div>
        <Button data-testid="button-add-subscription">
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              title="Total Subscriptions"
              value={mockSubscriptions.length}
              icon={CreditCard}
              description={`${mockSubscriptions.length} active subscriptions`}
              testId="card-total-subscriptions"
            />
            <StatsCard
              title="Monthly Spend"
              value={`$${totalCost}`}
              icon={DollarSign}
              description={`$${totalCost * 12}/year total`}
              testId="card-monthly-spend"
            />
            <StatsCard
              title="Upcoming Renewals"
              value={upcomingRenewals}
              icon={AlertCircle}
              description="Next 14 days"
              testId="card-upcoming-renewals"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-subscriptions"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>

            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No subscriptions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
