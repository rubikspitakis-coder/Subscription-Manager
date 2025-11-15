import { format, differenceInDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Eye } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  renewalDate: Date;
  username?: string;
  password?: string;
  reminderDays?: number;
  status: "active" | "warning" | "urgent" | "critical";
  category?: string;
  notes?: string;
  lastLogin?: Date;
  paymentMethod?: string;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onViewDetails?: (id: string) => void;
  onSendReminder?: (id: string) => void;
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

export function SubscriptionsTable({
  subscriptions,
  onViewDetails,
  onSendReminder,
}: SubscriptionsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Billing</TableHead>
            <TableHead>Renewal Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Reminder (days)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground">
                No subscriptions found
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((sub) => {
              const daysUntilRenewal = differenceInDays(sub.renewalDate, new Date());
              return (
                <TableRow key={sub.id} data-testid={`row-subscription-${sub.id}`}>
                  <TableCell className="font-medium" data-testid={`text-name-${sub.id}`}>
                    {sub.name}
                  </TableCell>
                  <TableCell data-testid={`text-category-${sub.id}`}>
                    {sub.category || "-"}
                  </TableCell>
                  <TableCell data-testid={`text-cost-${sub.id}`}>
                    ${sub.cost}
                  </TableCell>
                  <TableCell data-testid={`text-billing-${sub.id}`}>
                    {sub.billingPeriod === "yearly" ? "Yearly" : "Monthly"}
                  </TableCell>
                  <TableCell data-testid={`text-renewal-${sub.id}`}>
                    {format(sub.renewalDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(sub.status)}
                      data-testid={`badge-status-${sub.id}`}
                    >
                      {getStatusLabel(sub.status, daysUntilRenewal)}
                    </Badge>
                  </TableCell>
                  <TableCell data-testid={`text-payment-${sub.id}`}>
                    {sub.paymentMethod || "-"}
                  </TableCell>
                  <TableCell data-testid={`text-last-login-${sub.id}`}>
                    {sub.lastLogin ? format(sub.lastLogin, "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell data-testid={`text-reminder-${sub.id}`}>
                    {sub.reminderDays || 30}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails?.(sub.id)}
                        data-testid={`button-view-${sub.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSendReminder?.(sub.id)}
                        data-testid={`button-send-reminder-${sub.id}`}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
