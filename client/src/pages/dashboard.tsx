import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { StatsCard } from "@/components/stats-card";
import { SubscriptionCard } from "@/components/subscription-card";
import { SubscriptionsTable } from "@/components/subscriptions-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  AlertCircle,
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

type ViewMode = "grid" | "table";

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  renewalDate: string;
  username?: string;
  password?: string;
  reminderDays?: number;
  status: "active" | "warning" | "urgent" | "critical";
  category?: string;
  notes?: string;
  lastLogin?: string;
  paymentMethod?: string;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { toast } = useToast();

  const { data: subscriptions = [], isLoading } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const updateReminderDaysMutation = useMutation({
    mutationFn: async ({ id, days }: { id: string; days: number }) => {
      return apiRequest("PATCH", `/api/subscriptions/${id}/reminder-days`, { reminderDays: days });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      toast({
        title: "Success",
        description: "Reminder days updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder days",
        variant: "destructive",
      });
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/subscriptions/${id}/send-reminder`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reminder sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reminder",
        variant: "destructive",
      });
    },
  });

  const handleUpdateReminderDays = (id: string, days: number) => {
    updateReminderDaysMutation.mutate({ id, days });
  };

  const handleViewDetails = (id: string) => {
    console.log(`View details for subscription ${id}`);
  };

  const handleSendReminder = (id: string) => {
    sendReminderMutation.mutate(id);
  };

  const upcomingRenewals = subscriptions.filter((sub) => {
    const days = Math.floor(
      (new Date(sub.renewalDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days <= 30;
  }).length;

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const subscriptionsWithDates = filteredSubscriptions.map((sub) => ({
    ...sub,
    renewalDate: new Date(sub.renewalDate),
    lastLogin: sub.lastLogin ? new Date(sub.lastLogin) : undefined,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading subscriptions...</p>
      </div>
    );
  }

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
                <ToggleGroupItem
                  value="grid"
                  aria-label="Grid view"
                  data-testid="button-grid-view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="table"
                  aria-label="Table view"
                  data-testid="button-table-view"
                >
                  <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subscriptionsWithDates.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onUpdateReminderDays={handleUpdateReminderDays}
                  />
                ))}
              </div>
            ) : (
              <SubscriptionsTable
                subscriptions={subscriptionsWithDates}
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
