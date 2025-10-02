"use client";

import Link from "next/link";
import { Coffee, Facebook, Instagram, Mail, MapPin, Phone, Clock, Linkedin } from "lucide-react";
import { stores } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-gradient-to-b from-neutral-900 to-black text-neutral-300 border-t border-neutral-800">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-12 md:gap-16 md:grid-cols-4">
          {/* Brand / About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-8 w-8 text-amber-400" />
              <span className="font-headline text-2xl text-white">AMBASSADOR's COFFEE</span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400 max-w-xs">
              Crafting a bridge between Vietnamese coffee heritage and modern café culture. Fresh beans, thoughtful brewing, and warm hospitality.
            </p>
            <div className="flex gap-3 mt-5">
              <Link href="mailto:contact@ambassador.coffee" aria-label="Email" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Mail className="h-4 w-4" />
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-white transition">Menu</Link></li>
              <li><Link href="/#stores" className="hover:text-white transition">Stores</Link></li>
              <li><Link href="/#loyalty" className="hover:text-white transition">Rewards</Link></li>
              <li><Link href="/staff-join" className="hover:text-white transition">Join Our Team</Link></li>
              <li><Link href="/journey" className="hover:text-white transition">Coffee Journey</Link></li>
            </ul>
          </div>

          {/* Store Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Locations</h4>
            <ul className="space-y-3 text-sm">
              {stores.slice(0,3).map(store => (
                <li key={store.id} className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-amber-400" />
                  <span>{store.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-amber-400" />
                <span>+84 909 000 111</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-amber-400" />
                <span>contact@ambassador.coffee</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-amber-400" />
                <span>Daily: 7:00 - 22:00</span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-neutral-500 leading-relaxed">
                For partnership & wholesale inquiries, reach out via email. We respond within 24h.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {year} Ambassador's Coffee. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-neutral-300 transition">Terms</Link>
            <Link href="/privacy" className="hover:text-neutral-300 transition">Privacy</Link>
            <Link href="/cookies" className="hover:text-neutral-300 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
