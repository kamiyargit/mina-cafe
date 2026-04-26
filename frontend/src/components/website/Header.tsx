"use client";

type HeaderProps = {
  lang: "en" | "fa";
  onLangChange: (lang: "en" | "fa") => void;
};

export function Header({ lang, onLangChange }: HeaderProps) {
  const isFa = lang === "fa";

  return (
    <header className="flex items-center justify-between gap-3 pt-1 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/mainlogo.png"
          alt="Mina Cafe Logo"
          className="h-11 w-auto sm:h-12 shrink-0"
        />
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {isFa ? "مینا کافه" : "Mina Cafe"}
          </span>
          <span className="text-[11px] sm:text-xs text-gray-500 truncate">
            {isFa ? "منوی دیجیتال" : "Digital Menu"}
          </span>
        </div>
      </div>

      {/* Segmented language toggle */}
      <div
        className="relative inline-flex items-center rounded-full bg-gray-100 p-0.5 text-xs sm:text-sm shrink-0"
        role="tablist"
        aria-label={isFa ? "زبان" : "Language"}
      >
        <button
          type="button"
          role="tab"
          aria-selected={isFa}
          onClick={() => onLangChange("fa")}
          className={`relative px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
            isFa
              ? "bg-black text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          فا
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isFa}
          onClick={() => onLangChange("en")}
          className={`relative px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
            !isFa
              ? "bg-black text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          EN
        </button>
      </div>
    </header>
  );
}
