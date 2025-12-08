import Image from "next/image";

interface BrandLogoProps {
  variant?: "light" | "dark";
  showSubtitle?: boolean;
}

export default function BrandLogo({ variant = "dark", showSubtitle = false }: BrandLogoProps) {
  // variant="dark" means we are on a light background (standard headers)
  // variant="light" means we are on a dark background (hero sections)
  const isDark = variant === "dark";

  // Rootwork Brand Colors
  const brandGreen = "#1a472a"; // Deep Forest Green
  const brandGold = "#d4af37";  // Metallic Gold

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        {/* Logo Image */}
        <div className={`relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border ${isDark ? "border-slate-200" : "border-white/20"} shadow-sm`}>
          <Image
            src="/rootwork_logo_120x120.png"
            alt="Rootwork Logo"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text Branding */}
        <div>
          <h1
            className="font-bold text-xl tracking-tight leading-none"
            style={{ color: isDark ? brandGreen : 'white' }}
          >
            GA BioMonitor
          </h1>
          {showSubtitle && (
            <span
              className="text-[10px] uppercase tracking-wider font-bold"
              style={{ color: isDark ? brandGold : 'rgba(255,255,255,0.8)' }}
            >
              Powered by Rootwork
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
