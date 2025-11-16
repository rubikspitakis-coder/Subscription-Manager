import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Calendar,
  DollarSign,
  Bell,
  Edit,
} from "lucide-react";
import { CredentialField } from "./credential-field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Subscription {
  id: number;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  renewalDate: Date;
  username?: string;
  password?: string;
  reminderDays?: number;
  status: "active" | "warning" | "urgent" | "critical";
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onUpdateReminderDays?: (id: number, days: number) => void;
  onEdit?: (subscription: Subscription) => void;
}

function getStatusVariant(status: Subscription["status"]) {
  switch (status) {
    case "active":
      return "secondary";
    case "warning":
      return "default";
    case "urgent":
      return "default";
    case "critical":
      return "destructive";
  }
}

function getStatusLabel(status: Subscription["status"], daysUntil: number) {
  if (daysUntil < 0) return "Expired";
  if (status === "critical") return `${daysUntil}d left`;
  if (status === "urgent") return `${daysUntil}d left`;
  if (status === "warning") return `${daysUntil}d left`;
  return "Active";
}

export function SubscriptionCard({ subscription, onUpdateReminderDays, onEdit }: SubscriptionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reminderDays, setReminderDays] = useState(subscription.reminderDays?.toString() || "30");
  const daysUntilRenewal = differenceInDays(subscription.renewalDate, new Date());
  const hasCredentials = subscription.username || subscription.password;

  const handleSendReminder = () => {
    console.log(`Sending reminder for ${subscription.name}`);
  };

  const handleReminderDaysChange = (value: string) => {
    setReminderDays(value);
    const days = parseInt(value);
    if (!isNaN(days) && days > 0 && onUpdateReminderDays) {
      onUpdateReminderDays(subscription.id, days);
    }
  };

  return (
    <Card data-testid={`card-subscription-${subscription.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base" data-testid={`text-subscription-name-${subscription.id}`}>
              {subscription.name}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span data-testid={`text-cost-${subscription.id}`}>
                  ${subscription.cost}/{subscription.billingPeriod === "yearly" ? "yr" : "mo"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span data-testid={`text-renewal-${subscription.id}`}>
                  {format(subscription.renewalDate, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={getStatusVariant(subscription.status)} data-testid={`badge-status-${subscription.id}`}>
              {getStatusLabel(subscription.status, daysUntilRenewal)}
            </Badge>
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => onEdit(subscription)}
                data-testid={`button-edit-${subscription.id}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor={`reminder-${subscription.id}`} className="text-xs text-muted-foreground flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Remind me (days before renewal)
              </Label>
              <Input
                id={`reminder-${subscription.id}`}
                type="number"
                min="1"
                value={reminderDays}
                onChange={(e) => handleReminderDaysChange(e.target.value)}
                className="mt-1"
                data-testid={`input-reminder-days-${subscription.id}`}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendReminder}
              data-testid={`button-send-reminder-${subscription.id}`}
            >
              <Mail className="h-3 w-3 mr-2" />
              Send Now
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Auto-reminders: Daily when ≤ 5 days until renewal
          </p>
        </div>

        {hasCredentials && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between px-0 hover:bg-transparent"
                data-testid={`button-toggle-credentials-${subscription.id}`}
              >
                <span className="text-xs font-medium">Login Credentials</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {subscription.username && (
                <CredentialField
                  label="Username"
                  value={subscription.username}
                  type="text"
                  testId={`credential-username-${subscription.id}`}
                />
              )}
              {subscription.password && (
                <CredentialField
                  label="Password"
                  value={subscription.password}
                  type="password"
                  testId={`credential-password-${subscription.id}`}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
