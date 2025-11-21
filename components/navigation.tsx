"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lightbulb, Menu, X, Phone } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/simulador", label: "Simulador" },
    { href: "/planes", label: "Planes" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/#contacto", label: "Contacto" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Lightbulb className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground block leading-none">LumiTech</span>
              <span className="text-xs text-muted-foreground">Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" className="bg-[#E4715C] hover:bg-[#E4715C]/90 text-white shadow-lg">
              <Link href="/#contacto">
                <Phone className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button asChild className="w-full bg-[#E4715C] hover:bg-[#E4715C]/90 text-white">
                <Link href="/#contacto">
                  <Phone className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
