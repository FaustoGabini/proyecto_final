import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "InmobIA - Buscador Inmobiliario con IA",
  description: "Plataforma inmobiliaria potenciada por IA para buscar propiedades en Argentina",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`font-sans ${inter.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
