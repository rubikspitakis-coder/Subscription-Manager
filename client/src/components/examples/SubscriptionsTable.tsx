import { SubscriptionsTable } from "../subscriptions-table";
import { addDays, subDays } from "date-fns";

export default function SubscriptionsTableExample() {
  const subscriptions = [
    {
      id: 1,
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
      createdAt: new Date(),
    },
    {
      id: 2,
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
      createdAt: new Date(),
    },
  ];

  return (
    <div className="p-4">
      <SubscriptionsTable
        subscriptions={subscriptions}
        onViewDetails={(id) => console.log("View", id)}
        onSendReminder={(id) => console.log("Remind", id)}
      />
    </div>
  );
}
