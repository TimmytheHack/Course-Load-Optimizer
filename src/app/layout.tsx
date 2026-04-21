import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Course Load Optimizer",
  description:
    "Compare semester plans, detect overload, and choose the most realistic schedule before registration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
