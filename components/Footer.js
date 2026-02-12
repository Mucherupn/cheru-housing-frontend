import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#012169] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Cheru" className="h-10 w-10 rounded-full bg-white/10 object-contain" />
            <span className="text-lg font-semibold">Cheru.</span>
          </div>
          <p className="text-sm text-white/80">
            Nairobi&apos;s trusted housing reference point for premium homes and market clarity.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">Company</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/our-story" className="hover:text-white">Our story</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/press" className="hover:text-white">Press</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">Explore</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/buy" className="hover:text-white">Buy</Link></li>
            <li><Link href="/rent" className="hover:text-white">Rent</Link></li>
            <li><Link href="/insights" className="hover:text-white">Insights</Link></li>
            <li><Link href="/estimate" className="hover:text-white">Cheru Estimate</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">Services</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/list-with-cheru" className="hover:text-white">List with Cheru</Link></li>
            <li><Link href="/property-advisory" className="hover:text-white">Property advisory</Link></li>
            <li><Link href="/market-reports" className="hover:text-white">Market reports</Link></li>
            <li><Link href="/valuation-insights" className="hover:text-white">Valuation insights</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="#" aria-label="Facebook" className="text-white/80 transition hover:text-white">
            <FaFacebookF size={20} />
          </a>
          <a href="#" aria-label="Instagram" className="text-white/80 transition hover:text-white">
            <FaInstagram size={22} />
          </a>
          <a href="#" aria-label="TikTok" className="text-white/80 transition hover:text-white">
            <FaTiktok size={20} />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-white/80 transition hover:text-white">
            <FaLinkedinIn size={22} />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <span className="text-white/40">•</span>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <span className="text-white/40">•</span>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </div>

        <p className="text-center text-xs text-white/60">© {new Date().getFullYear()} Cheru. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
