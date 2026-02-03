const Footer = () => {
  return (
    <footer className="bg-[#012169] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Cheru Housing"
              className="h-10 w-10 rounded-full bg-white/10 object-contain"
            />
            <span className="text-lg font-semibold">Cheru Housing</span>
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
            <li>List with Cheru</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>hello@cheruhousing.com</li>
            <li>+254 700 000 000</li>
            <li>Westlands, Nairobi</li>
          </ul>
          <div className="pt-4 text-xs text-white/60">Legal</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
