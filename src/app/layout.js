import { Geist, Geist_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Your special cyber font for the dashboard
const rajdhani = Rajdhani({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

// Combined Metadata - Only one export allowed
export const metadata = {
  title: "Rasel's ICT Hub",
  description: "Next-Generation Learning Management System",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    apple: "/icon-192.png", // For iPhones
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}