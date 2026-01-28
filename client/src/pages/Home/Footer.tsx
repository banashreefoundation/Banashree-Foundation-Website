// Footer.tsx
import React, { useMemo } from "react";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getDynamicContent } from "./dynamicContent";

export default function Footer() {
  const dynamicContent = useMemo(() => getDynamicContent(), []);
  const {  navLinks } = dynamicContent;
  
  return (
    
    <footer className="w-full">
      {/* Top nav strip */}
      <div className="bg-white border-t border-b border-[#d9d0ce]">
        <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4">

           
             


          <nav className="flex flex-wrap gap-6 text-sm font-medium text-[#8f6f5f]">
             {navLinks.map(({ to, label }) => (
                <a
                  key={label}
                  href={to}
                  className="hover:underline"
                >
                  {label}
                </a>
              ))} 
            {/* <a href="/about" target="_blank" rel="noopener noreferrer" className="hover:underline">
              About Us
            </a>
            <a href="/programs" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Programs
            </a>
            <a href="/projects" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Projects
            </a>
            <a href="/events" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Events
            </a>
            <a href="/campaigns" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Campaigns
            </a>
            <a href="/contact" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Contact Us
            </a> */}
          </nav>
          <div className="flex gap-4">

            <a
              href="https://www.instagram.com/banashreefoundation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full border border-black/30 hover:bg-black/5"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/banashreefoundation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full border border-black/30 hover:bg-black/5"
            >
              <Facebook className="w-5 h-5" />
            </a>
            {/* <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-full border border-black/30 hover:bg-black/5"
            >
              <Twitter className="w-5 h-5" />
            </a> */}
            <a
              href="https://www.linkedin.com/company/banashree-foundation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full border border-black/30 hover:bg-black/5"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com/@banashreefoundationofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-full border border-black/30 hover:bg-black/5"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom dark bar */}
      <div className="bg-[#3f3f3f]">
        <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4 text-white text-sm">
          <div className="flex-1">
            © {new Date().getFullYear()} Banashree Foundation India. All rights reserved.
          </div>
          <div className="flex gap-8">
            {/* <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacy Policy
            </a> */}
            {/* <a href="/contactus" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Contact Us
            </a> */}
            {/* <a href="/faq" target="_blank" rel="noopener noreferrer" className="hover:underline">
              FAQ
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
