import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import { Providers } from "./_components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSV Trasnsformer",
  description: "Edits and reads large svg files using stream APIs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-indigo-2 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
