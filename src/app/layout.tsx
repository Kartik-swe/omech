import localFont from "next/font/local";
import "./globals.css";

import LayoutComponent from './components/LayoutComponent';
import { AuthProvider } from "./context/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <AuthProvider> {/* Add the AuthProvider here */}
        <LayoutComponent>
          {children}
        </LayoutComponent>
        </AuthProvider>
      </body>
    </html>
  );
}
