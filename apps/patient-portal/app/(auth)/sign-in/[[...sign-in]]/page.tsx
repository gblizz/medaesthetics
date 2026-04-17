import { SignIn } from "@repo/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-black px-16">
        <div className="text-center">
          <p
            style={{ color: "#ffffff" }}
            className="font-serif text-6xl font-light tracking-[0.12em]"
          >
            Refined
          </p>
          <p
            style={{ color: "#ffffff" }}
            className="font-serif text-6xl font-light tracking-[0.12em]"
          >
            Aesthetic
          </p>
          <div className="mx-auto mt-8 h-px w-16" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <p
            style={{ color: "rgba(255,255,255,0.45)" }}
            className="mt-8 text-[11px] tracking-[0.3em] uppercase"
          >
            Your features. Your goals. Your beauty.
          </p>
        </div>
      </div>

      {/* Right panel — sign-in */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-16">
        {/* Mobile brand mark */}
        <div className="mb-10 text-center lg:hidden">
          <p className="font-serif text-4xl font-light text-gray-900">
            Refined Aesthetic
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-gray-200" />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 hidden lg:block">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400">
              Patient Portal
            </p>
            <h1 className="mt-2 font-serif text-3xl font-light text-gray-900">
              Sign in
            </h1>
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
