import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Layout from "@/components/layout/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kartim - Kredi Kartı Yönetim Uygulaması",
  description: "Kredi kartlarınızı akıllıca yönetin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>
            {children}
            <Toaster position="top-right" />
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
