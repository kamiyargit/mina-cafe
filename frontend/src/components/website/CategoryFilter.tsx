"use client";

import type { Category } from "@/types";

type Props = {
  categories: Category[];
  activeId?: string;
  onChange: (id?: string) => void;
  lang: "en" | "fa";
};

export function CategoryFilter({ categories, activeId, onChange, lang }: Props) {
  const titleKey = lang === "fa" ? "titleFa" : "titleEn";
  const fallbackKey = lang === "fa" ? "titleEn" : "titleFa";

  return (
    <div className="-mx-1">
      <div
        className="flex gap-2 overflow-x-auto px-1 py-1 no-scrollbar scroll-smooth"
        role="tablist"
        aria-label={lang === "fa" ? "دسته‌بندی محصولات" : "Product categories"}
      >
        <CategoryChip
          active={!activeId}
          onClick={() => onChange(undefined)}
          label={lang === "fa" ? "همه" : "All"}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            active={activeId === cat.id}
            onClick={() => onChange(cat.id)}
            label={cat[titleKey] || cat[fallbackKey] || ""}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium whitespace-nowrap border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/30 ${
        active
          ? "bg-black text-white border-black shadow-sm"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}
