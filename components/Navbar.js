import Link from "next/link";
import { useRouter } from "next/router";

const menuItems = [
  { label: "Insights", href: "/insights" },
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "List With Cheru", href: "/list-with-cheru" },
];

const Navbar = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-[#012169] shadow-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <img
            src="/logo.png"
            alt="Cheru Housing"
            className="h-10 w-10 rounded-full bg-white/10 object-contain"
          />
          <span className="text-lg font-semibold tracking-wide">
            Cheru Housing
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white underline underline-offset-8"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="md:hidden">
          <Link
            href="/insights"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
          >
            Explore
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
