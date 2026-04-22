import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "./components/Nav";

export const metadata: Metadata = {
  title: "DevOps Monorepo — Dashboard",
  description: "Turborepo monorepo showcasing modern DevOps practices with CI/CD pipelines and automated deployments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Nav />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
