import { ChevronRight, EyeOff } from "lucide-react";
import { Button } from "@/components/ds";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-300">
      <div className="w-full max-w-md">
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-t-2xl bg-primary px-8 py-10">
          <h1 className="text-4xl font-bold text-white italic">splose</h1>
          {/* Hand illustration */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
              {/* Sleeve */}
              <path d="M120 25 L75 25 L70 55 L120 55Z" fill="#2d5016" />
              <path d="M120 25 L100 20 L95 30 L120 28Z" fill="#1a3a0a" />
              {/* Hand */}
              <ellipse cx="68" cy="40" rx="20" ry="16" fill="#d4a03c" />
              {/* Fingers */}
              <ellipse cx="52" cy="28" rx="6" ry="10" fill="#d4a03c" transform="rotate(-15 52 28)" />
              <ellipse cx="45" cy="34" rx="5" ry="9" fill="#d4a03c" transform="rotate(-25 45 34)" />
              <ellipse cx="42" cy="42" rx="5" ry="8" fill="#d4a03c" transform="rotate(-35 42 42)" />
              <ellipse cx="44" cy="52" rx="5" ry="7" fill="#d4a03c" transform="rotate(-10 44 52)" />
              {/* Fingernails */}
              <ellipse cx="48" cy="20" rx="3" ry="3" fill="#2d5016" />
              <ellipse cx="40" cy="27" rx="3" ry="3" fill="#2d5016" />
              <ellipse cx="37" cy="36" rx="3" ry="3" fill="#2d5016" />
            </svg>
          </div>
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
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>
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
