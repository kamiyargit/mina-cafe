"use client";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder: string;
  lang?: "en" | "fa";
};

export function SearchBox({ value, onChange, onClear, placeholder, lang = "fa" }: SearchBoxProps) {
  const isFa = lang === "fa";
  // In RTL the icon visually still belongs at the start of the input
  const iconSideClass = isFa ? "right-3" : "left-3";
  const clearSideClass = isFa ? "left-2" : "right-2";
  const paddingClass = isFa ? "pr-10 pl-9" : "pl-10 pr-9";

  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute inset-y-0 ${iconSideClass} flex items-center text-gray-400`}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        className={`w-full rounded-full border border-gray-200 bg-white ${paddingClass} py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="search"
        inputMode="search"
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(""))}
          className={`absolute inset-y-0 ${clearSideClass} my-auto h-7 w-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors`}
          aria-label={isFa ? "پاک کردن" : "Clear"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
