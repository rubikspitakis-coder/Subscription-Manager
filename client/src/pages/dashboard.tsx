import { useState } from "react";
import { addDays, addMonths, subDays } from "date-fns";
import { StatsCard } from "@/components/stats-card";
import { SubscriptionCard } from "@/components/subscription-card";
import { SubscriptionsTable } from "@/components/subscriptions-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CreditCard,
  AlertCircle,
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

type ViewMode = "grid" | "table";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // todo: remove mock functionality - these fields would come from Airtable
  const [subscriptions, setSubscriptions] = useState([
    {
      id: "1",
      name: "ChatGPT Plus",
      cost: 20,
      billingPeriod: "monthly" as const,
      renewalDate: addDays(new Date(), 5),
      username: "user@example.com",
      password: "secure_password_123",
      reminderDays: 30,
      status: "critical" as const,
      category: "AI Assistant",
      notes: "Used for coding and research",
      lastLogin: subDays(new Date(), 2),
      paymentMethod: "Visa **** 4242",
    },
    {
      id: "2",
      name: "Claude Pro",
      cost: 240,
      billingPeriod: "yearly" as const,
      renewalDate: addDays(new Date(), 12),
      username: "user@example.com",
      password: "another_secure_pass",
      reminderDays: 30,
      status: "urgent" as const,
      category: "AI Assistant",
      notes: "Long-form content generation",
      lastLogin: subDays(new Date(), 5),
      paymentMethod: "Mastercard **** 5555",
    },
    {
      id: "3",
      name: "Midjourney Annual",
      cost: 360,
      billingPeriod: "yearly" as const,
      renewalDate: addDays(new Date(), 22),
      username: "artist@example.com",
      password: "creative_password",
      reminderDays: 30,
      status: "warning" as const,
      category: "Image Generation",
      notes: "Marketing assets and design",
      lastLogin: subDays(new Date(), 1),
      paymentMethod: "Amex **** 1234",
    },
    {
      id: "4",
      name: "GitHub Copilot",
      cost: 120,
      billingPeriod: "yearly" as const,
      renewalDate: addMonths(new Date(), 2),
      username: "dev@example.com",
      password: "code_master_2024",
      reminderDays: 30,
      status: "active" as const,
      category: "Developer Tools",
      notes: "Code completion and suggestions",
      lastLogin: new Date(),
      paymentMethod: "Visa **** 4242",
    },
    {
      id: "5",
      name: "Perplexity Pro",
      cost: 200,
      billingPeriod: "yearly" as const,
      renewalDate: addMonths(new Date(), 5),
      username: "research@example.com",
      password: "search_pro_pass",
      reminderDays: 30,
      status: "active" as const,
      category: "Research",
      notes: "Academic and market research",
      lastLogin: subDays(new Date(), 3),
      paymentMethod: "Visa **** 4242",
    },
  ]);

  const handleUpdateReminderDays = (id: string, days: number) => {
    setSubscriptions(subs =>
      subs.map(sub => sub.id === id ? { ...sub, reminderDays: days } : sub)
    );
    console.log(`Updated reminder days for subscription ${id} to ${days} days`);
  };

  const handleViewDetails = (id: string) => {
    console.log(`View details for subscription ${id}`);
  };

  const handleSendReminder = (id: string) => {
    console.log(`Sending reminder for subscription ${id}`);
  };

  const upcomingRenewals = subscriptions.filter(
    (sub) => {
      const days = Math.floor((sub.renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    }
  ).length;

  const filteredSubscriptions = subscriptions.filter((sub) =>
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
          <div className="grid gap-4 md:grid-cols-2">
            <StatsCard
              title="Total Subscriptions"
              value={subscriptions.length}
              icon={CreditCard}
              description={`${subscriptions.length} active subscriptions`}
              testId="card-total-subscriptions"
            />
            <StatsCard
              title="Upcoming Renewals"
              value={upcomingRenewals}
              icon={AlertCircle}
              description="Next 30 days"
              testId="card-upcoming-renewals"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
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
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as ViewMode)}
                data-testid="toggle-view-mode"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view" data-testid="button-grid-view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view" data-testid="button-table-view">
                  <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onUpdateReminderDays={handleUpdateReminderDays}
                  />
                ))}
              </div>
            ) : (
              <SubscriptionsTable
                subscriptions={filteredSubscriptions}
                onViewDetails={handleViewDetails}
                onSendReminder={handleSendReminder}
              />
            )}

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
