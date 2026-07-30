import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xaywebgiare.shop"),
  title: {
    default: "NKS Electric - Đèn Điện, NLMT, Inverter, Pin Lưu Trữ",
    template: "%s | NKS Electric",
  },
  description:
    "Chuyên cung cấp đèn điện dân dụng, đèn hàng hải, hệ thống năng lượng mặt trời, inverter, pin lưu trữ và dịch vụ lắp đặt chuyên nghiệp.",
  keywords: [
    "đèn LED",
    "đèn hàng hải",
    "năng lượng mặt trời",
    "inverter",
    "pin lưu trữ",
    "lắp đặt điện",
    "NKS Electric",
  ],
  authors: [{ name: "NKS Electric" }],
  creator: "NKS Electric",
  publisher: "NKS Electric",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://xaywebgiare.shop",
    siteName: "NKS Electric",
    title: "NKS Electric - Đèn Điện, NLMT, Inverter, Pin Lưu Trữ",
    description:
      "Chuyên cung cấp đèn điện, năng lượng mặt trời và dịch vụ lắp đặt chuyên nghiệp",
  },
  twitter: {
    card: "summary_large_image",
    title: "NKS Electric - Đèn Điện, NLMT, Inverter, Pin Lưu Trữ",
    description: "Chuyên cung cấp đèn điện, năng lượng mặt trời và dịch vụ lắp đặt chuyên nghiệp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
