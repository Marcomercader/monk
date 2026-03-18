import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "monk",
  description: "A calm space for daily practice and reflection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
