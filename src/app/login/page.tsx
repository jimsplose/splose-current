import { ChevronRight, EyeOff } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-200/80">
      <div className="w-full max-w-md">
        {/* Header banner */}
        <div className="rounded-t-2xl bg-primary px-8 py-8 text-center">
          <h1 className="text-4xl font-bold italic text-white">splose</h1>
        </div>

        {/* Form card */}
        <div className="rounded-b-2xl bg-white px-8 py-8">
          <p className="text-sm text-primary">You are logging in to</p>
          <p className="mt-1 text-lg font-bold text-text">acme.splose.com</p>

          <div className="mt-6">
            <label className="block text-sm text-text">Email</label>
            <input
              type="email"
              className="mt-1 w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm text-text">Password</label>
            <div className="relative">
              <input
                type="password"
                className="mt-1 w-full border-b border-gray-300 pb-2 pr-8 text-sm outline-none focus:border-primary"
              />
              <EyeOff className="absolute right-0 top-2 h-4 w-4 text-text-secondary" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button className="mt-6 flex w-full items-center justify-between rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
            Log in
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-4 flex justify-center gap-6 text-sm text-primary">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
