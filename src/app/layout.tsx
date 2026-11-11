import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopGenius — Ecommerce, made a little easier",
  description: "A thoughtful AI workspace for independent ecommerce shops.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
