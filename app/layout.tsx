import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Georgia Biology Progress Tool - RootWork",
  description: "A tool designed to help teachers prepare students for Biology EOC testing and predict individual student performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
