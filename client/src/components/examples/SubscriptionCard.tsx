import { SubscriptionCard } from "../subscription-card";
import { addDays } from "date-fns";

export default function SubscriptionCardExample() {
  const subscription = {
    id: "1",
    name: "ChatGPT Plus",
    cost: 20,
    renewalDate: addDays(new Date(), 5),
    username: "user@example.com",
    password: "secure_password_123",
    status: "critical" as const,
  };

  return (
    <div className="p-4 max-w-md">
      <SubscriptionCard subscription={subscription} />
    </div>
  );
}
