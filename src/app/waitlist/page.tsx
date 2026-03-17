import { Plus, List, Filter } from "lucide-react";

export default function WaitlistPage() {
  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex items-center gap-4 border-b border-border px-6 pt-2">
        <button className="border-b-2 border-transparent px-1 pb-2 text-sm text-text-secondary hover:text-text">
          Screener
        </button>
        <button className="border-b-2 border-primary px-1 pb-2 text-sm font-medium text-primary">
          Waitlist
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Waitlist</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Reset all filters
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              Learn
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <List className="h-4 w-4" />
              List
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              <Plus className="h-4 w-4" />
              Add client
            </button>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="flex h-[calc(100vh-14rem)] items-center justify-center rounded-lg border border-border bg-gray-50">
          <div className="text-center">
            <p className="text-lg text-text-secondary">Map View</p>
            <p className="mt-1 text-sm text-text-secondary">
              Waitlist clients will appear on the map based on their address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
