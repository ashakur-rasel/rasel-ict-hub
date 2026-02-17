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

// ১. metadata থেকে themeColor এবং viewport সরিয়ে ফেলা হয়েছে
export const metadata = {
  title: "Rasel's ICT Hub",
  description: "Next-Generation Learning Management System",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192x192.png",
  },
};

// ২. আলাদাভাবে viewport এক্সপোর্ট করা হলো (এতে এরর থাকবে না)
export const viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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