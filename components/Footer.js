import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#012169] text-white">
      {/* Main footer grid */}
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="C."
              className="h-10 w-10 rounded-full bg-white/10 object-contain"
            />
            <span className="text-lg font-semibold">Cheru.</span>
          </div>
          <p className="text-sm text-white/80">
            Nairobi&apos;s trusted housing reference point for premium homes and
            market clarity.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
            About
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Our story</li>
            <li>Neighborhood focus</li>
            <li>Trusted advisory</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Insights</li>
            <li>Buy</li>
            <li>Rent</li>
            <li>Cheru Estimate</li>
            <li>List with Cheru</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>info@cheru.co.ke</li>
            <li>+254 722 423 005</li>
            <li>Karen, Nairobi</li>
          </ul>
         {/*<div className="pt-4 text-xs text-white/60">Legal</div>*/} 
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-white/10"></div>
      </div>

      {/* Bottom social icons */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a
            href="#"
            aria-label="Facebook"
            className="text-white/80 transition hover:text-white"
          >
            <FaFacebookF size={20} />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="text-white/80 transition hover:text-white"
          >
            <FaInstagram size={22} />
          </a>

          <a
            href="#"
            aria-label="TikTok"
            className="text-white/80 transition hover:text-white"
          >
            <FaTiktok size={20} />
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="text-white/80 transition hover:text-white"
          >
            <FaLinkedinIn size={22} />
          </a>
        </div>

        <p className="text-xs text-white/60 text-center">
          © {new Date().getFullYear()} Cheru. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
