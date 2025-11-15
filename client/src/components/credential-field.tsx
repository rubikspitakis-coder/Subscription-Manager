import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CredentialFieldProps {
  label: string;
  value: string;
  type?: "text" | "password";
  testId?: string;
}

export function CredentialField({ label, value, type = "password", testId }: CredentialFieldProps) {
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={type === "password" && !showValue ? "password" : "text"}
            value={value}
            readOnly
            className="pr-10"
            data-testid={`${testId}-input`}
          />
          {type === "password" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowValue(!showValue)}
              data-testid={`${testId}-toggle`}
            >
              {showValue ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopy}
          data-testid={`${testId}-copy`}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
