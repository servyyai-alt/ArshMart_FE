import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import SandhaiKart_logo from "../assets/images/SandhaiKart_logo.jpeg";
import api from "../utils/api.js";

// Custom WhatsApp Icon Component for consistent sizing with Lucide icons
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerCategories, setFooterCategories] = useState([]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setFooterCategories(res.data.categories || []))
      .catch(() => setFooterCategories([]));
  }, []);

  // Updated Social Media Configuration
  const socialLinks = [
    {
      Icon: WhatsAppIcon,
      href: "https://wa.me/9342032250",
      label: "WhatsApp",
    },
    {
      Icon: Instagram,
      href: "https://instagram.com/sandhaikart",
      label: "Instagram",
    },
    // {
    //   Icon: Twitter,
    //   href: "https://twitter.com/sandhaikart",
    //   label: "Twitter",
    // },
    {
      Icon: Facebook,
      href: "https://www.facebook.com/share/1HEdACrgz4/",
      label: "Facebook",
    },
    {
      Icon: Youtube,
      href: "https://youtube.com/@sandhaikart?si=kc_z1us0RTIpe-Fi",
      label: "Youtube",
    },
  ];

  return (
    <footer className="border-t border-white/5 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              {/* <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Sandhai<span className="text-primary-400">kart</span>
              </span> */}
              <img
                src={SandhaiKart_logo}
                alt="Sandhaikart Logo"
                className="w-40 lg:w-[70%] object-contain"
              />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your premium shopping destination. Quality products, fast
              delivery, and exceptional service across India.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-[#5bb253] hover:border-[#5bb253]/60 transition-all border border-slate-200"
                >
                  <social.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/products", label: "All Products" },
                ...footerCategories.slice(0, 3).map((c) => ({
                  to: `/products?category=${encodeURIComponent(c.name)}`,
                  label: c.name,
                })),
                { to: "/orders", label: "Track Order" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-[#5bb253] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/contact", label: "Help Center" },
                { to: "/refunds", label: "Returns & Refunds" },
                { to: "/shipping", label: "Shipping Policy" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-[#5bb253] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#5bb253] mt-0.5 flex-shrink-0" />
                <span className="text-slate-500 text-sm">
                  SRI AISHWARIYA GREEN ENERGY SOLUTIONS, 505, Krishnasamy Nagar,
                  Koothapakkam, Cuddalore 607 002.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#5bb253] flex-shrink-0" />
                <a
                  href="tel:+919367632250"
                  className="text-slate-500 hover:text-[#5bb253] text-sm transition-colors"
                >
                  9342032250
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#5bb253] flex-shrink-0" />
                <a
                  href="mailto:sandhaikart@gmail.com"
                  className="text-slate-500 hover:text-[#5bb253] text-sm transition-colors"
                >
                  sandhaikart@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm text-center">
            © {currentYear} Sandhaikart. All rights reserved. Developed by Least
            Action Company.
          </p>
          <div className="flex items-center gap-6">
            <img
              src="https://w7.pngwing.com/pngs/93/992/png-transparent-razorpay-logo-tech-companies.png"
              alt="Razorpay"
              className="h-7 w-20 opacity-40 hover:opacity-70 transition-opacity"
            />
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <span>🔒</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
