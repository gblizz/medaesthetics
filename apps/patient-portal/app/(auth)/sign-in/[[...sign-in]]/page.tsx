import { SignIn } from "@repo/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
        <SignIn />
      </div>
    </div>
  );
}
