import { ChevronRight, EyeOff } from "lucide-react";
import { Button, Checkbox } from "@/components/ds";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-300">
      <div className="w-full max-w-md">
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-t-2xl bg-primary px-8 py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/splose logo.svg" alt="splose" className="h-8 brightness-0 invert" />
          {/* Settings illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/settings.png" alt="" className="absolute top-1/2 right-6 h-20 -translate-y-1/2 object-contain" />
        </div>

        {/* Form card */}
        <div className="rounded-b-2xl bg-white px-8 py-8">
          <p className="text-sm text-primary">You are logging into</p>
          <p className="mt-1 text-heading-lg text-text">acme.splose.com</p>

          <div className="mt-6">
            <label className="block text-sm text-text-secondary">Email</label>
            <input
              type="email"
              className="mt-1 w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm text-text-secondary">Password</label>
            <div className="relative">
              <input
                type="password"
                className="mt-1 w-full border-b border-gray-300 bg-transparent py-2 pr-8 text-sm outline-none focus:border-primary"
              />
              <EyeOff className="absolute top-3 right-0 h-4 w-4 text-text-secondary" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Checkbox label="Remember me" />
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="mt-6 flex w-full justify-between py-3"
          >
            Log in
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Footer links */}
        <div className="mt-4 flex justify-center gap-6 text-sm text-primary">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
