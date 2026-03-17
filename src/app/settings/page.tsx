export default function SettingsPage() {
  const sections = [
    {
      title: "Workspace",
      items: ["Details", "Integrations", "SMS settings"],
    },
    {
      title: "Automation",
      items: ["Forms", "splose AI"],
    },
    {
      title: "Business",
      items: [
        "Locations",
        "Custom fields",
        "Rooms/Resources",
        "Services",
        "Busy times",
        "Cancellation reasons",
        "Online bookings",
        "Communication types",
        "Tags",
        "Referral types",
      ],
    },
    {
      title: "Team",
      items: ["Users", "User groups"],
    },
    {
      title: "Templates",
      items: ["Appointments", "Emails", "Progress notes", "Letters", "Body charts"],
    },
    {
      title: "Finances",
      items: ["Payments", "Invoices"],
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-text">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item, i) => (
                <li key={item}>
                  <button
                    className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      section.title === "Workspace" && i === 0
                        ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {item}
                    {item === "Online bookings" && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        New
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-6 text-6xl">&#9881;</div>
        <h2 className="text-xl font-bold text-text">All your settings in one place</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Select a page to customise settings
        </p>
      </div>
    </div>
  );
}
