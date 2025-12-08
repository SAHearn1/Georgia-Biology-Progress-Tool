import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Georgia Biology Progress Tool",
  description: "A comprehensive web application for Biology EOC testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
