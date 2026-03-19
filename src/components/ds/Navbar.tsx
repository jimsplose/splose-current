import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface NavbarProps {
  backHref: string;
  title: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Navbar({ backHref, title, badge, children }: NavbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <Link href={backHref} className="flex items-center text-text-secondary hover:text-text">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold text-text">{title}</h1>
        {badge}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
