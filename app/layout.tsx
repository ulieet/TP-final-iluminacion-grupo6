import type React from "react"
import type { Metadata } from "next"
import { Inter, IBM_Plex_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import {Navigation} from "@/components/navigation"
import { Nav } from "react-day-picker"
import Floatwsp from "@/components/Floatwsp"

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LumiTech Solutions - Soluciones de Iluminación Inteligente",
  description:
    "Empresa líder en soluciones de iluminación LED y fluorescente con simulador de dimensionamiento lumínico avanzado",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <Navigation/>
        <Floatwsp/>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
