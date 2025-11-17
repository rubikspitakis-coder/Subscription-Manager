import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CredentialField } from "@/components/credential-field";

interface AddSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSubscriptionDialog({
  open,
  onOpenChange,
}: AddSubscriptionDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    billingPeriod: "monthly" as "monthly" | "yearly",
    renewalDate: "",
    username: "",
    password: "",
    category: "",
    notes: "",
    paymentMethod: "",
    reminderDays: "30",
    pros: "",
    cons: "",
    usageDescription: "",
    relatedProjects: "",
    officialWebsite: "",
    recommendationScore: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/subscriptions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      toast({
        title: "Success",
        description: "Subscription added successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add subscription",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      cost: "",
      billingPeriod: "monthly",
      renewalDate: "",
      username: "",
      password: "",
      category: "",
      notes: "",
      paymentMethod: "",
      reminderDays: "30",
      pros: "",
      cons: "",
      usageDescription: "",
      relatedProjects: "",
      officialWebsite: "",
      recommendationScore: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.cost || !formData.renewalDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for submission
    const submissionData = {
      name: formData.name,
      cost: parseFloat(formData.cost),
      billingPeriod: formData.billingPeriod,
      renewalDate: new Date(formData.renewalDate).toISOString(),
      username: formData.username || undefined,
      password: formData.password || undefined,
      category: formData.category || undefined,
      notes: formData.notes || undefined,
      paymentMethod: formData.paymentMethod || undefined,
      reminderDays: parseInt(formData.reminderDays),
      pros: formData.pros || undefined,
      cons: formData.cons || undefined,
      usageDescription: formData.usageDescription || undefined,
      relatedProjects: formData.relatedProjects || undefined,
      officialWebsite: formData.officialWebsite || undefined,
      recommendationScore: formData.recommendationScore ? parseInt(formData.recommendationScore) : undefined,
    };

    createMutation.mutate(submissionData);
  };

  const handleChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Add a new AI tool subscription to track its costs and renewal date.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., ChatGPT Plus"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost">
                  Cost <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="20.00"
                  value={formData.cost}
                  onChange={(e) => handleChange("cost", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="billingPeriod">
                  Billing Period <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.billingPeriod}
                  onValueChange={(value) =>
                    handleChange("billingPeriod", value)
                  }
                >
                  <SelectTrigger id="billingPeriod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="renewalDate">
                  Renewal Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="renewalDate"
                  type="date"
                  value={formData.renewalDate}
                  onChange={(e) => handleChange("renewalDate", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reminderDays">Reminder Days Before</Label>
                <Input
                  id="reminderDays"
                  type="number"
                  min="1"
                  placeholder="30"
                  value={formData.reminderDays}
                  onChange={(e) => handleChange("reminderDays", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., AI Assistant, Image Generation"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                placeholder="e.g., Visa ending in 1234"
                value={formData.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username/Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="your@email.com"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <CredentialField
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
                placeholder="Enter password (optional)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="officialWebsite">Official Website</Label>
              <Input
                id="officialWebsite"
                type="url"
                placeholder="https://example.com"
                value={formData.officialWebsite}
                onChange={(e) => handleChange("officialWebsite", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pros">Pro's (Advantages)</Label>
              <Textarea
                id="pros"
                placeholder="What are the advantages of this tool?"
                value={formData.pros}
                onChange={(e) => handleChange("pros", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cons">Con's (Disadvantages)</Label>
              <Textarea
                id="cons"
                placeholder="What are the limitations or downsides?"
                value={formData.cons}
                onChange={(e) => handleChange("cons", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="usageDescription">How I'm Using It</Label>
              <Textarea
                id="usageDescription"
                placeholder="Describe how you're using this tool..."
                value={formData.usageDescription}
                onChange={(e) => handleChange("usageDescription", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relatedProjects">Related Projects</Label>
              <Input
                id="relatedProjects"
                placeholder="Projects where you use this tool"
                value={formData.relatedProjects}
                onChange={(e) => handleChange("relatedProjects", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recommendationScore">Recommendation Score (1-10)</Label>
              <Input
                id="recommendationScore"
                type="number"
                min="1"
                max="10"
                placeholder="Rate this tool"
                value={formData.recommendationScore}
                onChange={(e) => handleChange("recommendationScore", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this subscription..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
