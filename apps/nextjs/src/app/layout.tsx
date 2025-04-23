import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import "~/styles/globals.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import "@uppy/core/dist/style.min.css";
import "@uppy/drag-drop/dist/style.min.css";
import "@uppy/status-bar/dist/style.min.css";

import { ThemeProvider } from "~/components/theme/ThemeProvider";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Task managment",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
  ],
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark:bg-gray-950">
      <body
        className={[
          "bg-background text-foreground font-sans",
          fontSans.variable,
        ].join(" ")}
      >
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider>{props.children}</ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
