import { CredentialField } from "../credential-field";

export default function CredentialFieldExample() {
  return (
    <div className="p-4 max-w-md space-y-4">
      <CredentialField
        label="Username"
        value="user@example.com"
        type="text"
      />
      <CredentialField
        label="Password"
        value="secure_password_123"
        type="password"
      />
    </div>
  );
}
