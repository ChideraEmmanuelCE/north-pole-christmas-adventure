import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "North Pole — The Christmas Mission", description: "Become Santa, build toys, prepare your sleigh and deliver Christmas magic around the world.", appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "North Pole" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, themeColor: "#07131b" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
