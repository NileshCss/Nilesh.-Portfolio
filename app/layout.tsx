import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { AuthErrorListener } from "@/components/ui/AuthErrorListener";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nileshkumarsingh.dev"),
  title: {
    default: "Nilesh Kumar Singh — Full Stack Java Developer",
    template: "%s | Nilesh Kumar Singh",
  },
  description:
    "Full Stack Java Developer building scalable SaaS platforms, AI-powered applications, and modern digital products. MCA Graduate with expertise in Java, Spring Boot, React, and Next.js.",
  icons: {
    icon: [
      { url: "/favicon-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-64.svg", sizes: "64x64", type: "image/svg+xml" },
      { url: "/logo-dark.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/app-icon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
  keywords: [
    "Nilesh Kumar Singh",
    "Full Stack Java Developer",
    "Software Engineer",
    "Backend Engineer",
    "Java Developer",
    "Spring Boot",
    "React Developer",
    "Next.js",
    "SaaS Developer",
    "Product Engineer",
    "MCA Graduate",
    "India",
  ],
  authors: [{ name: "Nilesh Kumar Singh", url: "https://nileshkumarsingh.dev" }],
  creator: "Nilesh Kumar Singh",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nileshkumarsingh.dev",
    title: "Nilesh Kumar Singh — Full Stack Java Developer",
    description:
      "Full Stack Java Developer building scalable SaaS platforms, AI-powered applications, and modern digital products.",
    siteName: "Nilesh Kumar Singh Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nilesh Kumar Singh — Full Stack Java Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilesh Kumar Singh — Full Stack Java Developer",
    description:
      "Full Stack Java Developer building scalable SaaS platforms, AI-powered applications, and modern digital products.",
    images: ["/og-image.png"],
    creator: "@nileshksingh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            {children}
            <ToastContainer />
            <AuthErrorListener />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

