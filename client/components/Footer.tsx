import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2 font-playfair">
              Subscribe to stay updated
            </h3>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Get exclusive deals, new arrivals, and style tips delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded text-primary-foreground placeholder-primary-foreground/50 text-sm focus:outline-none focus:border-accent"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-primary rounded font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h4 className="text-base font-semibold font-playfair mb-4">
              About LUXÉ
            </h4>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Premium unisex shoes and purses crafted with elegance and affordability
              in mind for the Indian market.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold font-playfair mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-base font-semibold font-playfair mb-4">
              Policies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/returns"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold font-playfair mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  Jharkhand, India
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  +91 74887 75047
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a
                  href="mailto:hello@luxe.com"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  hello@luxe.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-primary-foreground/10 pt-8 flex items-center justify-between">
          <p className="text-sm text-primary-foreground/50">
            © 2026 LUXÉ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-primary-foreground/70 hover:text-accent transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-primary-foreground/70 hover:text-accent transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-primary-foreground/70 hover:text-accent transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
