"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/pipelines", label: "Pipelines" },
  { href: "/deployments", label: "Deployments" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
        DevOps<span className="mono">/mono</span>
      </Link>
      <div className="nav-links">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={["nav-link", pathname === href ? "active" : ""].join(" ")}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
