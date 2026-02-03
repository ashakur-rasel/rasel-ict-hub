import { Geist, Geist_Mono, Rajdhani } from "next/font/google"; // Rajdhani যোগ করা হয়েছে
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// তোমার ড্যাশবোর্ডের জন্য স্পেশাল সাইবার ফন্ট
const rajdhani = Rajdhani({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

export const metadata = {
  title: "Rasel's ICT Hub | Teacher Portal",
  description: "Next-Generation Learning Management System",
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