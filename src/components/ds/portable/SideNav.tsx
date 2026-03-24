/**
 * Portable SideNav -- framework-agnostic version.
 * Replaces next/link with <a> and usePathname() with an activePath prop.
 */

export interface SideNavItem {
  name: string;
  href: string;
  badge?: string;
}

export interface SideNavSection {
  title: string;
  items: SideNavItem[];
}

export interface SideNavProps {
  sections: SideNavSection[];
  /** Current path for active state (replaces usePathname). */
  activePath?: string;
  /** Custom active-state check. Overrides activePath if provided. */
  isActive?: (href: string) => boolean;
  className?: string;
}

export default function SideNav({ sections, activePath = "", isActive: customIsActive, className = "" }: SideNavProps) {
  const isActive = customIsActive || ((href: string) => {
    if (href === "/settings") return activePath === "/settings";
    return activePath === href || activePath.startsWith(href + "/");
  });

  return (
    <aside className={`shrink-0 overflow-y-auto border-r border-border bg-white ${className}`}>
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          {section.title && (
            <h3 className="mb-1 text-body-sm font-bold uppercase tracking-wider text-text">
              {section.title}
            </h3>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`block w-full rounded px-3 py-1.5 text-left text-body-md transition-colors hover:bg-primary/10 hover:text-primary ${
                    isActive(item.href)
                      ? "border-l-2 border-primary bg-primary/10 font-medium text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-caption-sm text-white">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
