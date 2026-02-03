import Link from "next/link";

const buttons = [
  { label: "Insights", href: "/insights" },
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
];

const HeroButtons = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {buttons.map((button) => (
        <Link
          key={button.href}
          href={button.href}
          className="flex items-center justify-center rounded-2xl bg-[#012169] px-6 py-5 text-base font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#012169]/90"
        >
          {button.label}
        </Link>
      ))}
    </div>
  );
};

export default HeroButtons;
